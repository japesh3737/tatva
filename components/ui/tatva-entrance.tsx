"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** A bounded look-ahead cache, rather than decoding hundreds of images at once. */
function frameCache(folder: string, count: number, onReady: () => void, capacity = 20) {
  const images = new Map<number, HTMLImageElement>();
  const pending = new Map<number, HTMLImageElement>();
  const failed = new Set<number>();
  let center = 0;
  let radius = 0;
  let direction = 1;
  let disposed = false;
  const pump = () => {
    if (disposed) return;
    const wanted = [center];
    for (let offset = 1; offset <= radius; offset++) {
      wanted.push(center + offset * direction, center - offset * direction);
    }
    for (const index of wanted) {
      if (pending.size >= 3) break;
      if (index < 0 || index >= count || images.has(index) || pending.has(index) || failed.has(index)) continue;
      const image = new Image();
      image.decoding = "async";
      pending.set(index, image);
      image.onload = async () => {
        try { await image.decode(); } catch { /* onload still provides a drawable image */ }
        if (disposed) return;
        pending.delete(index);
        images.set(index, image);
        // Keep decoded memory bounded, including when jumping far along the page.
        const farthest = [...images.keys()].sort((a, b) => Math.abs(b - center) - Math.abs(a - center));
        while (images.size > capacity) images.delete(farthest.shift()!);
        onReady();
        pump();
      };
      image.onerror = () => { pending.delete(index); failed.add(index); pump(); };
      image.src = `/${folder}/frame_${String(index).padStart(4, "0")}.webp`;
    }
  };
  return {
    get(index: number, lookAhead: boolean) {
      direction = index === center ? direction : Math.sign(index - center);
      center = index;
      radius = lookAhead ? Math.min(8, Math.floor((capacity - 1) / 2)) : 0;
      pump();
      return images.get(index);
    },
    dispose() {
      disposed = true;
      pending.forEach((image) => { image.onload = null; image.onerror = null; image.src = ""; });
      pending.clear();
      images.clear();
    },
  };
}

export function TatvaEntrance() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const roomTitleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    const canvas = canvasRef.current!;
    const canvasContext = canvas.getContext("2d", { alpha: false });
    if (!canvasContext) return;
    const context = canvasContext;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let target = 0;
    let progress = 0;
    let lastTime = 0;
    let visible = true;
    let dirty = true;
    let lastDoor = -1;
    let lastRoom = -1;
    let scrollDistances = [3200, 800, 18000, 600];
    const schedule = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(render); };
    const doors = frameCache("entrance-frames", 241, schedule);
    // Use the original 1080p frames, avoiding the extra 720p resize/compression.
    // A smaller decoded cache keeps memory close to the previous version.
    const rooms = frameCache("showcase-frames", 480, schedule, 10);
    const drawCover = (image: HTMLImageElement) => {
      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
    };
    function render(now: number) {
      raf = 0;
      const dt = Math.min(0.05, lastTime ? (now - lastTime) / 1000 : 1 / 60);
      lastTime = now;
      // Time-based easing absorbs wheel bursts, with a speed limit on large jumps.
      const difference = target - progress;
      const atDoor = progress < 0.40;
      const step = difference * (1 - Math.exp(-dt / (atDoor ? 0.18 : 0.24)));
      const speedLimit = atDoor ? 0.16 : 0.06;
      progress = motion.matches ? 1 : progress + Math.max(-dt * speedLimit, Math.min(dt * speedLimit, step));
      if (Math.abs(target - progress) < 0.00005) progress = target;
      const doorProgress = clamp(progress / 0.40);
      const roomProgress = motion.matches ? 0 : clamp((progress - 0.48) / 0.50);
      const doorIndex = Math.round(doorProgress * 240);
      const roomIndex = Math.round(roomProgress * 479);
      const showDoor = !motion.matches && progress < 0.42;
      const door = showDoor ? doors.get(doorIndex, true) : undefined;
      const room = rooms.get(roomIndex, !motion.matches && progress > 0.40);
      const renderedDoor = showDoor ? doorIndex : -1;
      // Hold the last complete composition until the requested frames are decoded.
      // No decoder seeks, green-screen processing, or repeated drawing while idle.
      if (room && (!showDoor || door) && (dirty || renderedDoor !== lastDoor || roomIndex !== lastRoom)) {
        drawCover(room);
        if (door && showDoor) {
          context.globalAlpha = 1 - clamp((progress - 0.39) / 0.03);
          drawCover(door);
          context.globalAlpha = 1;
        }
        canvas.style.opacity = "1";
        posterRef.current!.style.opacity = "0";
        lastDoor = renderedDoor;
        lastRoom = roomIndex;
        dirty = false;
      }
      introRef.current!.style.opacity = String(motion.matches ? 0 : 1 - clamp(progress / 0.15));
      roomTitleRef.current!.style.opacity = String(motion.matches ? 1 : clamp((progress - 0.40) / 0.07));
      progressRef.current!.style.transform = `scaleX(${progress})`;
      if (progress !== target) schedule();
    }
    const measure = () => {
      const rect = section.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      // Independent distances keep the entrance responsive without speeding up the tour.
      const weights = [0.40, 0.08, 0.50, 0.02];
      let remaining = Math.max(0, -rect.top);
      target = 0;
      scrollDistances.forEach((distance, index) => {
        target += clamp(remaining / distance) * weights[index];
        remaining = Math.max(0, remaining - distance);
      });
      target = motion.matches ? 1 : clamp(target);
      // Off-screen navigation must not leave a long catch-up animation behind.
      if (!visible || motion.matches) progress = target;
      schedule();
    };
    const resize = () => {
      const stage = section.firstElementChild!;
      const styles = getComputedStyle(section);
      scrollDistances = ["--door-scroll", "--reveal-scroll", "--tour-scroll", "--exit-scroll"]
        .map((name) => parseFloat(styles.getPropertyValue(name)));
      // Match high-density displays while bounding the backing surface to 1440p.
      const scale = Math.min(window.devicePixelRatio || 1, 2,
        Math.sqrt((2560 * 1440) / (stage.clientWidth * stage.clientHeight)));
      canvas.width = Math.round(stage.clientWidth * scale);
      canvas.height = Math.round(stage.clientHeight * scale);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      dirty = true;
      measure();
    };
    const onVisibility = () => {
      lastTime = 0;
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else measure();
    };
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", resize);
    motion.addEventListener("change", resize);
    document.addEventListener("visibilitychange", onVisibility);
    resize();
    progress = target;
    return () => {
      cancelAnimationFrame(raf);
      doors.dispose();
      rooms.dispose();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", resize);
      motion.removeEventListener("change", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <section ref={sectionRef} id="interior-showcase" className="tatva-entrance" aria-label="Scroll to open the door and explore the living room">
      <div className="tatva-entrance-stage">
        <canvas ref={canvasRef} width={1920} height={1080} className="tatva-entrance-media tatva-scene-canvas" aria-hidden="true" />
        <div ref={posterRef} className="tatva-entrance-media tatva-door-poster" aria-hidden="true" />
        <div className="tatva-entrance-shade" />
        <header className="tatva-entrance-header">
          <a href="#tatva-hero" className="tatva-entrance-brand" aria-label="Tatva studio">तत्व<span>TATVA</span></a>
          <a href="#tatva-hero" className="tatva-entrance-skip">Skip to studio <span aria-hidden="true">↗</span></a>
        </header>
        <div ref={introRef} className="tatva-entrance-intro">
          <p>A new perspective begins here</p>
          <h2>Every home.<br /><em>A world within.</em></h2>
          <span className="tatva-entrance-hint">Scroll to open the door <span aria-hidden="true">↓</span></span>
        </div>
        <div ref={roomTitleRef} className="tatva-entrance-room-title">
          <p>Welcome inside</p>
          <h2>Room to live.<br /><em>Space to belong.</em></h2>
          <span>Keep scrolling to explore</span>
        </div>
        <div className="tatva-entrance-footer" aria-hidden="true"><span>Architecture · Interiors · Tatva</span><span>A world within ↓</span></div>
        <div className="tatva-entrance-progress"><div ref={progressRef} /></div>
      </div>
    </section>
  );
}
