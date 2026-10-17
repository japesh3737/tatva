"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface TatvaShowcaseProps {
  doorVideoSrc?: string;
  showcaseVideoSrc?: string;
  doorScrollDistance?: number;
  walkthroughScrollDistance?: number;
  className?: string;
  style?: React.CSSProperties;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

const VS_SOURCE = `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;

void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_uv;
}
`;

const FS_SOURCE = `
precision mediump float;
uniform sampler2D u_video;
uniform float u_tMin;
uniform float u_tMax;
varying vec2 v_uv;

void main() {
  vec4 col = texture2D(u_video, v_uv);
  
  // Calculate green dominance over the maximum of red and blue
  float maxRB = max(col.r, col.b);
  float diff = col.g - maxRB;
  
  // Smooth chroma key cut using hardware smoothstep
  float alpha = 1.0 - smoothstep(u_tMin, u_tMax, diff);
  
  // Despill algorithm to eliminate any green halo on door edges
  vec3 rgb = col.rgb;
  if (diff > 0.0) {
    rgb.g = min(rgb.g, maxRB * 1.05);
  }
  
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

export function TatvaShowcase({
  doorVideoSrc = "/door.mp4",
  showcaseVideoSrc = "/tatva-showcase.mp4",
  doorScrollDistance = 1400,
  walkthroughScrollDistance = 3000,
  className = "",
  style = {},
}: TatvaShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const doorVideoRef = useRef<HTMLVideoElement>(null);
  const interiorVideoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Ready states
  const [doorReady, setDoorReady] = useState(false);
  const [interiorReady, setInteriorReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);

  // Physics & seeking state
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const isDoorSeekingRef = useRef(false);
  const isInteriorSeekingRef = useRef(false);
  const pendingDoorTimeRef = useRef<number | null>(null);
  const pendingInteriorTimeRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const isVisibleRef = useRef(true);
  const lastRenderedDoorTimeRef = useRef(-1);
  const wakeLoopRef = useRef<() => void>(() => {});

  // WebGL context and handles
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const glProgramRef = useRef<WebGLProgram | null>(null);
  const glTexRef = useRef<WebGLTexture | null>(null);

  const totalScroll = doorScrollDistance + walkthroughScrollDistance;
  const doorSplit = doorScrollDistance / totalScroll; // ~0.318

  // Cached layout metrics to avoid layout thrashing during scroll
  const layoutMetricsRef = useRef({ top: 0, range: 1 });

  const updateMetrics = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset || 0;
    layoutMetricsRef.current = {
      top: rect.top + scrollTop,
      range: Math.max(1, el.offsetHeight - window.innerHeight),
    };
  }, []);

  // Gated seek for door video with hardware fastSeek fallback
  const seekDoor = useCallback((time: number) => {
    const v = doorVideoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const clamped = clamp(time, 0, v.duration);

    if (isDoorSeekingRef.current) {
      pendingDoorTimeRef.current = clamped;
      return;
    }
    if (Math.abs(v.currentTime - clamped) > 0.02) {
      isDoorSeekingRef.current = true;
      if ("fastSeek" in v && typeof (v as any).fastSeek === "function") {
        (v as any).fastSeek(clamped);
      } else {
        v.currentTime = clamped;
      }
    }
  }, []);

  // Gated seek for interior walkthrough video with hardware fastSeek fallback
  const seekInterior = useCallback((time: number) => {
    const v = interiorVideoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const clamped = clamp(time, 0, v.duration);

    if (isInteriorSeekingRef.current) {
      pendingInteriorTimeRef.current = clamped;
      return;
    }
    if (Math.abs(v.currentTime - clamped) > 0.03) {
      isInteriorSeekingRef.current = true;
      if ("fastSeek" in v && typeof (v as any).fastSeek === "function") {
        (v as any).fastSeek(clamped);
      } else {
        v.currentTime = clamped;
      }
    }
  }, []);

  // WebGL Frame Renderer for Door Chroma Key
  const renderDoorFrame = useCallback(() => {
    const v = doorVideoRef.current;
    const gl = glRef.current;
    const prog = glProgramRef.current;
    const tex = glTexRef.current;

    if (!v || v.readyState < 2 || !gl || !prog || !tex) return;

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    lastRenderedDoorTimeRef.current = v.currentTime;
  }, []);

  // Toggle play/pause for interior walkthrough
  const togglePlay = useCallback(() => {
    const v = interiorVideoRef.current;
    if (!v) return;

    if (v.paused) {
      isPlayingRef.current = true;
      setIsPlaying(true);
      wakeLoopRef.current();
      v.play().catch(() => {});
    } else {
      v.pause();
      isPlayingRef.current = false;
      setIsPlaying(false);
    }
  }, []);

  // Skip directly to studio section
  const handleSkip = useCallback(() => {
    const hero = document.getElementById("tatva-hero");
    if (hero) {
      hero.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Initialize WebGL for Door Chroma Key
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    cvs.width = 1920;
    cvs.height = 1080;

    const gl = (cvs.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "high-performance",
    }) ||
      cvs.getContext("experimental-webgl", {
        alpha: true,
        premultipliedAlpha: false,
      })) as WebGLRenderingContext | null;

    if (!gl) return;
    glRef.current = gl;

    const compileShader = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FS_SOURCE);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    gl.useProgram(prog);
    glProgramRef.current = prog;

    // Quad covering full screen
    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // UV coordinates
    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW
    );
    const aUv = gl.getAttribLocation(prog, "a_uv");
    gl.enableVertexAttribArray(aUv);
    gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

    // Green thresholds
    const uTMin = gl.getUniformLocation(prog, "u_tMin");
    const uTMax = gl.getUniformLocation(prog, "u_tMax");
    gl.uniform1f(uTMin, 0.05);
    gl.uniform1f(uTMax, 0.18);

    // Texture
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Initial 1x1 black pixel
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([0, 0, 0, 255])
    );
    gl.viewport(0, 0, 1920, 1080);
    glTexRef.current = tex;
  }, []);

  // Main Scroll & Animation Lifecycle
  useEffect(() => {
    const doorVideo = doorVideoRef.current;
    const interiorVideo = interiorVideoRef.current;
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!doorVideo || !interiorVideo || !canvas || !container) return;

    // Track when door video is decodable
    const onDoorLoaded = () => {
      setDoorReady(true);
      doorVideo.currentTime = 0;
      renderDoorFrame();
    };
    doorVideo.addEventListener("loadeddata", onDoorLoaded);
    if (doorVideo.readyState >= 2) onDoorLoaded();

    // Track when interior video is decodable
    const onInteriorLoaded = () => {
      setInteriorReady(true);
      interiorVideo.currentTime = 0;
      if (!isPlayingRef.current && !interiorVideo.paused) {
        interiorVideo.pause();
      }
    };
    interiorVideo.addEventListener("loadeddata", onInteriorLoaded);
    if (interiorVideo.readyState >= 2) onInteriorLoaded();

    // Door seek queue drain
    const onDoorSeeked = () => {
      isDoorSeekingRef.current = false;
      if (pendingDoorTimeRef.current !== null) {
        const nextTime = pendingDoorTimeRef.current;
        pendingDoorTimeRef.current = null;
        seekDoor(nextTime);
      } else {
        renderDoorFrame();
      }
    };
    doorVideo.addEventListener("seeked", onDoorSeeked);

    // Interior seek queue drain
    const onInteriorSeeked = () => {
      isInteriorSeekingRef.current = false;
      if (pendingInteriorTimeRef.current !== null) {
        const nextTime = pendingInteriorTimeRef.current;
        pendingInteriorTimeRef.current = null;
        seekInterior(nextTime);
      }
    };
    interiorVideo.addEventListener("seeked", onInteriorSeeked);

    // Passive scroll listener: computes normalized progress across the combined section [0..1]
    const onScroll = () => {
      if (!isVisibleRef.current) return;
      const { top, range } = layoutMetricsRef.current;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const p = clamp((scrollY - top) / range, 0, 1);
      targetProgressRef.current = p;

      // If user is scrolling, pause interior video if it was playing
      if (!interiorVideo.paused) {
        interiorVideo.pause();
        isPlayingRef.current = false;
        setIsPlaying(false);
      }

      wakeLoop();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateMetrics, { passive: true });
    updateMetrics();

    // IntersectionObserver: Pause RAF & video when section is out of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisibleRef.current = entry.isIntersecting;
        if (!entry.isIntersecting) {
          if (!interiorVideo.paused) interiorVideo.pause();
        } else {
          updateMetrics();
          wakeLoop();
        }
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );
    observer.observe(container);

    // 60FPS Lerp Animation Loop with Idle Sleep (0% CPU when stationary)
    let rafId: number;
    let isLoopRunning = false;

    const renderLoop = () => {
      if (!isVisibleRef.current) {
        isLoopRunning = false;
        return;
      }

      // Smooth lerp damping (0.22 coefficient for buttery responsiveness)
      const diff = targetProgressRef.current - currentProgressRef.current;
      const isSettled = Math.abs(diff) <= 0.0001;

      if (!isSettled) {
        currentProgressRef.current += diff * 0.22;
      } else {
        currentProgressRef.current = targetProgressRef.current;
      }

      const p = currentProgressRef.current;

      // --- PHASE 1: DOOR OPENING (0.00 -> doorSplit) ---
      if (p <= doorSplit + 0.05) {
        const doorNorm = clamp(p / doorSplit, 0, 1);
        if (doorVideo.duration && Number.isFinite(doorVideo.duration)) {
          seekDoor(doorNorm * doorVideo.duration);
        }

        // Fade out overlay hints as door swings open
        if (doorNorm > 0.05) {
          setUiVisible(false);
        } else {
          setUiVisible(true);
        }

        // Fade door canvas smoothly to reveal full interior underneath near end of door swing
        let canvasOpacity = 1;
        if (doorNorm >= 0.88) {
          canvasOpacity = 1 - (doorNorm - 0.88) / 0.12;
        }
        canvas.style.opacity = String(clamp(canvasOpacity, 0, 1));
      } else {
        // Door is completely open and passed
        canvas.style.opacity = "0";
      }

      // --- PHASE 2: INTERIOR WALKTHROUGH (doorSplit -> 1.00) ---
      if (p >= doorSplit - 0.05) {
        const interiorNorm = clamp((p - doorSplit) / (1 - doorSplit), 0, 1);

        if (!isPlayingRef.current) {
          // Scroll-driven scrubbing: interior video only changes when user scrolls
          if (interiorVideo.duration && Number.isFinite(interiorVideo.duration)) {
            seekInterior(interiorNorm * interiorVideo.duration);
          }
        }
      }

      // Sync progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${p})`;
      }

      // If settled and interior video is not playing, sleep RAF loop to save 100% idle CPU
      if (isSettled && !isPlayingRef.current) {
        isLoopRunning = false;
        return;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    const wakeLoop = () => {
      if (!isLoopRunning && isVisibleRef.current) {
        isLoopRunning = true;
        rafId = requestAnimationFrame(renderLoop);
      }
    };
    wakeLoopRef.current = wakeLoop;

    wakeLoop();

    return () => {
      cancelAnimationFrame(rafId);
      isLoopRunning = false;
      observer.disconnect();
      doorVideo.removeEventListener("loadeddata", onDoorLoaded);
      doorVideo.removeEventListener("seeked", onDoorSeeked);
      interiorVideo.removeEventListener("loadeddata", onInteriorLoaded);
      interiorVideo.removeEventListener("seeked", onInteriorSeeked);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateMetrics);
    };
  }, [doorSplit, renderDoorFrame, seekDoor, seekInterior, updateMetrics]);

  return (
    <section
      ref={containerRef}
      id="interior-showcase"
      aria-label="Tatva Door Entrance & Interior Walkthrough"
      className={`relative w-full bg-[#05070D] ${className}`}
      style={{
        height: `calc(100vh + ${totalScroll}px)`,
        ...style,
      }}
    >
      {/* Sticky Full-Viewport Container (Native compositor-thread pinning) */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden select-none bg-[#05070D] transform-gpu"
        style={{
          contain: "paint layout",
          willChange: "transform",
        }}
      >
        {/* 
          LAYER 1: Interior Walkthrough Video (Positioned directly behind the door)
          Revealed right through the opening doors via WebGL green screen alpha transparency!
        */}
        <video
          ref={interiorVideoRef}
          src={showcaseVideoSrc}
          muted
          playsInline
          preload="auto"
          loop
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-transform transform-gpu"
          style={{
            opacity: interiorReady ? 1 : 0,
            transition: "opacity 0.5s ease-out",
          }}
        />

        {/* Subtle Architectural Atmosphere Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,7,13,0.3) 0%, rgba(5,7,13,0.02) 35%, rgba(5,7,13,0.1) 70%, rgba(5,7,13,0.5) 100%)",
          }}
        />

        {/* 
          LAYER 2: WebGL Chroma-Key Door Canvas (Positioned on top of interior video)
          Renders double doors; green screen background is stripped in real-time GPU shader (<0.1ms).
        */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none will-change-transform z-20"
          style={{
            opacity: doorReady ? 1 : 0,
            transition: "opacity 0.4s ease-out",
          }}
        />

        {/* Hidden Door Video decoding element */}
        <video
          ref={doorVideoRef}
          src={doorVideoSrc}
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "1px",
            height: "1px",
            opacity: 0.001,
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        {/* 
          LAYER 3: Luxury Entrance Header & Skip Action
        */}
        <header className="absolute top-0 left-0 w-full flex items-center justify-between p-6 sm:p-10 z-30 pointer-events-auto">
          <a
            href="#tatva-hero"
            className="flex flex-col items-start leading-none group cursor-pointer text-[#F6EAD8]"
          >
            <span
              className="text-2xl sm:text-3xl font-bold tracking-normal drop-shadow-md"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
              }}
            >
              तत्व
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.35em] text-[#F6EAD8]/75 font-medium mt-1 uppercase">
              TATVA
            </span>
          </a>

          <button
            type="button"
            onClick={handleSkip}
            className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium text-[#F6EAD8]/80 hover:text-[#F6EAD8] border border-white/20 hover:border-white/50 bg-black/30 hover:bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            Skip to Studio ↓
          </button>
        </header>

        {/* Initial Door Invitation Overlay (Fades out when doors start swinging open) */}
        <div
          className={`absolute inset-0 flex flex-col justify-center items-center text-center p-8 pointer-events-none transition-opacity duration-500 z-30 ${
            uiVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex flex-col items-center space-y-3 mb-12">
            <h1 className="text-3xl md:text-6xl font-serif tracking-[0.22em] text-[#F6EAD8] drop-shadow-md">
              TATVA
            </h1>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.38em] text-[#F6EAD8]/70">
              Where Spaces Take Shape
            </p>
          </div>

          <div className="flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#F6EAD8]/25 bg-black/40 backdrop-blur-md shadow-lg">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#F6EAD8] font-light">
              Scroll Down to Open
            </span>
            <svg
              className="w-3.5 h-3.5 text-[#F6EAD8]/80 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Walkthrough Architectural Title (Bottom Left) */}
        <div className="absolute bottom-12 left-6 sm:left-12 z-20 max-w-lg pointer-events-none">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium block mb-2">
            Spatial Walkthrough • Scroll to Explore
          </span>
          <h2 className="text-2xl sm:text-4xl font-light text-[#F6EAD8] tracking-tight font-serif drop-shadow-md">
            The Interior Sanctuary
          </h2>
          <p className="text-xs sm:text-sm text-[#F6EAD8]/75 mt-1 max-w-md font-sans font-light leading-relaxed drop-shadow-sm">
            A curated walkthrough of living space, natural courtyard light, and raw materiality.
          </p>
        </div>

        {/* Clean GPU-Accelerated Bottom Scrub Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#F6EAD8]/15 z-30 overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full w-full bg-gradient-to-r from-[#C59B6D] via-[#F6EAD8] to-[#C59B6D] origin-left transform-gpu will-change-transform"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Minimal Control Pill: Play / Pause Toggle (Bottom Right) */}
        <div className="absolute bottom-8 right-6 sm:right-12 z-20 pointer-events-auto">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause walkthrough" : "Play continuous walkthrough"}
            className="px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#F6EAD8]/20 text-[#F6EAD8] text-xs font-mono tracking-wider hover:bg-black/60 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span>{isPlaying ? "PAUSE" : "PLAY"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
