"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface TatvaDoorIntroProps {
  /**
   * Source path for the door video.
   * Defaults to "/door.mp4".
   */
  videoSrc?: string;

  /**
   * Cumulative scroll pixels needed to scrub the door from fully closed (0) to fully open (1).
   * Defaults to 1100px for a natural, responsive 1.5–2 scroll gestures feel.
   */
  scrubDistance?: number;

  /**
   * Duration in seconds where the doors reach full open (100% green screen).
   * In the 1080p master door clip, the doors fully open at 8.0s (frame 240).
   * Defaults to 8.0.
   */
  doorOpenDuration?: number;

  /**
   * Progress threshold (0 to 1) where the end-of-clip crossfade begins.
   * Defaults to 0.88.
   */
  crossfadeStartProgress?: number;

  /**
   * Sensitivity threshold for chroma keying (green dominance over max of red & blue).
   * Normalized 0.0 to 1.0.
   */
  greenThresholdMin?: number;
  greenThresholdMax?: number;

  /**
   * Optional callback when unlocked.
   */
  onUnlock?: () => void;

  /**
   * Optional custom className.
   */
  className?: string;

  /**
   * Optional inline styles.
   */
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
  
  // Despill algorithm to eliminate any green halo/fringing on the door edges
  vec3 rgb = col.rgb;
  if (diff > 0.0) {
    rgb.g = min(rgb.g, maxRB * 1.05);
  }
  
  gl_FragColor = vec4(rgb * alpha, alpha);
}
`;

export function TatvaDoorIntro({
  videoSrc = "/door.mp4",
  scrubDistance = 1100,
  doorOpenDuration = 8.0,
  crossfadeStartProgress = 0.88,
  greenThresholdMin = 0.12,
  greenThresholdMax = 0.28,
  onUnlock,
  className = "",
  style = {},
}: TatvaDoorIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [uiVisible, setUiVisible] = useState(true);

  // Skip handler to immediately dismiss intro if user prefers
  const handleSkip = useCallback(() => {
    const c = containerRef.current;
    if (c) {
      c.style.transition = "opacity 0.4s ease-out";
      c.style.opacity = "0";
      c.style.pointerEvents = "none";
    }
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.height = "";
    document.body.style.overscrollBehavior = "";
    if (onUnlock) onUnlock();
  }, [onUnlock]);

  useEffect(() => {
    const rawVideo = videoRef.current;
    const rawCanvas = canvasRef.current;
    const rawContainer = containerRef.current;
    if (!rawVideo || !rawCanvas || !rawContainer) return;

    const v: HTMLVideoElement = rawVideo;
    const cvs: HTMLCanvasElement = rawCanvas;
    const c: HTMLDivElement = rawContainer;

    let rafId = 0;
    let isRafRunning = false;
    let targetProgress = 0;
    let currentProgress = 0;
    let locked = false;
    let lockedScrollY = 0;
    let touchStartY = 0;

    // Fast seek queuing for intra-coded video frames
    let isSeeking = false;
    let pendingTime: number | null = null;
    let lastRenderedTime = -1;

    // --- WebGL Context & Shaders ---
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

    let glProgram: WebGLProgram | null = null;
    let glTex: WebGLTexture | null = null;
    let uTMinLoc: WebGLUniformLocation | null = null;
    let uTMaxLoc: WebGLUniformLocation | null = null;

    if (gl) {
      const compileShader = (type: number, src: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.warn("WebGL Shader error:", gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      };

      const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
      const fs = compileShader(gl.FRAGMENT_SHADER, FS_SOURCE);

      if (vs && fs) {
        glProgram = gl.createProgram();
        if (glProgram) {
          gl.attachShader(glProgram, vs);
          gl.attachShader(glProgram, fs);
          gl.linkProgram(glProgram);

          if (gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
            gl.useProgram(glProgram);

            // Quad positions covering full screen [-1, 1]
            const posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1,
              ]),
              gl.STATIC_DRAW
            );
            const aPosLoc = gl.getAttribLocation(glProgram, "a_pos");
            gl.enableVertexAttribArray(aPosLoc);
            gl.vertexAttribPointer(aPosLoc, 2, gl.FLOAT, false, 0, 0);

            // TexCoords: pos(-1, 1) top-left -> uv(0, 0), pos(1, -1) bottom-right -> uv(1, 1)
            const uvBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([
                0, 1,
                1, 1,
                0, 0,
                0, 0,
                1, 1,
                1, 0,
              ]),
              gl.STATIC_DRAW
            );
            const aUvLoc = gl.getAttribLocation(glProgram, "a_uv");
            gl.enableVertexAttribArray(aUvLoc);
            gl.vertexAttribPointer(aUvLoc, 2, gl.FLOAT, false, 0, 0);

            uTMinLoc = gl.getUniformLocation(glProgram, "u_tMin");
            uTMaxLoc = gl.getUniformLocation(glProgram, "u_tMax");
            gl.uniform1f(uTMinLoc, greenThresholdMin);
            gl.uniform1f(uTMaxLoc, greenThresholdMax);

            glTex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, glTex);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            // Initialize with 1x1 black pixel until video frame arrives
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
          }
        }
      }
    }

    // 2D fallback context if WebGL fails
    const ctx2d = !gl
      ? cvs.getContext("2d", { willReadFrequently: true, alpha: true })
      : null;

    // --- Fast GPU Chroma Key Render ---
    function renderFrame() {
      if (!v || v.readyState < 2 || v.videoWidth === 0) return;

      if (gl && glProgram && glTex) {
        // High-Performance WebGL Pass (< 0.1ms GPU execution)
        gl.bindTexture(gl.TEXTURE_2D, glTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, v);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      } else if (ctx2d) {
        // 2D Canvas TypedArray Fallback
        ctx2d.drawImage(v, 0, 0, 1920, 1080);
        const imgData = ctx2d.getImageData(0, 0, 1920, 1080);
        const u32 = new Uint32Array(imgData.data.buffer);
        const len = u32.length;
        const tMin = (greenThresholdMin * 255) | 0;
        const tMax = (greenThresholdMax * 255) | 0;
        const range = tMax - tMin;

        for (let i = 0; i < len; i++) {
          const p = u32[i];
          const r = p & 0xff;
          const g = (p >> 8) & 0xff;
          const b = (p >> 16) & 0xff;
          const maxOther = r > b ? r : b;
          const diff = g - maxOther;

          if (g > 65 && diff > tMin) {
            if (diff >= tMax) {
              u32[i] = 0;
            } else {
              const alphaFactor = 1 - (diff - tMin) / range;
              const a = (255 * alphaFactor) | 0;
              u32[i] = (a << 24) | (b << 16) | (maxOther << 8) | r;
            }
          }
        }
        ctx2d.putImageData(imgData, 0, 0);
      }

      lastRenderedTime = v.currentTime;
    }

    // --- Scroll Lock Management ---
    function engageLock() {
      if (locked || typeof document === "undefined") return;
      locked = true;
      lockedScrollY = window.scrollY;
      const b = document.body.style;
      b.position = "fixed";
      b.top = `-${lockedScrollY}px`;
      b.left = "0";
      b.right = "0";
      b.width = "100%";
      b.height = "100%";
      b.overscrollBehavior = "none";
      c.style.pointerEvents = "auto";
      c.style.opacity = "1";
      cvs.style.opacity = "1";
      startRaf();
    }

    function releaseLock(resumeScrollOffset = 0) {
      if (!locked || typeof document === "undefined") return;
      locked = false;
      const y = lockedScrollY;
      const b = document.body.style;
      b.position = "";
      b.top = "";
      b.left = "";
      b.right = "";
      b.width = "";
      b.height = "";
      b.overscrollBehavior = "";

      c.style.transition = "opacity 0.4s ease-out";
      c.style.opacity = "0";
      c.style.pointerEvents = "none";

      if (onUnlock) onUnlock();
      window.scrollTo(0, Math.max(y, resumeScrollOffset));
    }

    // Lock screen at start so scroll exclusively drives the door opening
    engageLock();

    // Kickstart video loading and draw the closed door immediately
    const onLoadedData = () => {
      v.currentTime = 0;
      renderFrame();
    };
    v.addEventListener("loadeddata", onLoadedData);
    v.addEventListener("canplay", onLoadedData);
    v.load();
    if (v.readyState >= 2) {
      onLoadedData();
    }

    // Seek queuing
    const onSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null) {
        const nextTime = pendingTime;
        pendingTime = null;
        isSeeking = true;
        v.currentTime = nextTime;
      } else {
        renderFrame();
      }
    };
    v.addEventListener("seeked", onSeeked);

    function seekTo(t: number) {
      const clamped = clamp(t, 0, doorOpenDuration);
      if (isSeeking) {
        pendingTime = clamped;
        return;
      }
      if (Math.abs(v.currentTime - clamped) > 0.015) {
        isSeeking = true;
        v.currentTime = clamped;
      }
    }

    // Listen to video frame updates
    const onTimeUpdate = () => {
      if (Math.abs(v.currentTime - lastRenderedTime) > 0.01) {
        renderFrame();
      }
    };
    v.addEventListener("timeupdate", onTimeUpdate);

    // --- Pure Scroll-Driven Interaction (Changes ONLY if we scroll) ---
    function addDelta(deltaY: number) {
      if (locked) {
        if (targetProgress >= 0.98 && deltaY > 0) {
          releaseLock(10);
          window.scrollBy({ top: deltaY, behavior: "auto" });
          return;
        }
        targetProgress = clamp(targetProgress + deltaY / scrubDistance, 0, 1);
        startRaf();
      } else {
        if (window.scrollY <= 0 && deltaY < -20) {
          engageLock();
          targetProgress = clamp(1 + deltaY / scrubDistance, 0, 1);
          startRaf();
        }
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (locked || (window.scrollY <= 0 && e.deltaY < -20)) {
        e.preventDefault();
        addDelta(e.deltaY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - y;
      touchStartY = y;

      if (locked || (window.scrollY <= 0 && deltaY < -20)) {
        e.preventDefault();
        addDelta(deltaY);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!locked) return;
      if (e.key === "Escape") {
        handleSkip();
      } else if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        addDelta(250);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        addDelta(-250);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    c.addEventListener("wheel", onWheel, { passive: false, capture: true });
    c.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    c.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });

    // --- Tab and Window Lifecycle ---
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopRaf();
      } else {
        if (locked) startRaf();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    function startRaf() {
      if (!isRafRunning) {
        isRafRunning = true;
        rafId = requestAnimationFrame(loop);
      }
    }

    function stopRaf() {
      if (isRafRunning) {
        cancelAnimationFrame(rafId);
        isRafRunning = false;
      }
    }

    // --- Master Render Loop (Scroll Driven Only) ---
    function loop() {
      // Lerp-damped interactive scrubbing: silky smooth responsiveness
      const delta = targetProgress - currentProgress;
      if (Math.abs(delta) > 0.0001) {
        currentProgress += delta * 0.18;
      } else {
        currentProgress = targetProgress;
      }

      const targetTime = currentProgress * doorOpenDuration;
      seekTo(targetTime);

      if (Math.abs(v.currentTime - lastRenderedTime) > 0.005 || lastRenderedTime === -1) {
        renderFrame();
      }

      // UI Overlay fade out as doors open
      if (currentProgress > 0.04) {
        setUiVisible(false);
      } else {
        setUiVisible(true);
      }

      // Smooth crossfade handoff near completion (0.88 -> 1.0)
      let canvasOpacity = 1;
      if (currentProgress >= crossfadeStartProgress) {
        const fadeRange = 1 - crossfadeStartProgress;
        canvasOpacity = Math.max(0, 1 - (currentProgress - crossfadeStartProgress) / fadeRange);
      }

      cvs.style.opacity = canvasOpacity.toFixed(3);
      c.style.pointerEvents = canvasOpacity < 0.02 ? "none" : "auto";

      // Unlock trigger when scrub crosses threshold
      if (locked && currentProgress >= 0.985) {
        releaseLock(10);
      }

      // Idle sleep: suspend RAF when steady state is reached to save GPU
      if (!locked && Math.abs(targetProgress - currentProgress) < 0.0001 && currentProgress >= 0.98) {
        isRafRunning = false;
        return;
      }

      rafId = requestAnimationFrame(loop);
    }

    startRaf();

    return () => {
      stopRaf();
      v.removeEventListener("loadeddata", onLoadedData);
      v.removeEventListener("canplay", onLoadedData);
      v.removeEventListener("seeked", onSeeked);
      v.removeEventListener("timeupdate", onTimeUpdate);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      c.removeEventListener("wheel", onWheel, true);
      c.removeEventListener("touchstart", onTouchStart, true);
      c.removeEventListener("touchmove", onTouchMove, true);
      if (locked && typeof document !== "undefined") {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.height = "";
        document.body.style.overscrollBehavior = "";
      }
    };
  }, [
    scrubDistance,
    doorOpenDuration,
    crossfadeStartProgress,
    greenThresholdMin,
    greenThresholdMax,
    handleSkip,
    onUnlock,
  ]);

  return (
    <div
      ref={containerRef}
      aria-label="Tatva Door Chroma-Key Reveal Layer"
      className={`fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto touch-none transition-opacity duration-300 ${className}`}
      style={{
        opacity: 1,
        ...style,
      }}
    >
      {/* 
        CHROMA-KEY CANVAS (Hardware-Accelerated WebGL)
        Draws the door footage and strips green screen in real-time on the GPU (<0.1ms).
        Reveals the Tatva website underneath through the widening doors.
      */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover pointer-events-none will-change-transform"
        style={{ opacity: 1 }}
      />

      {/* 
        LUXURY ENTRANCE OVERLAY
        Minimalist architectural typography, skip button, and scroll invitation.
      */}
      <div
        className={`absolute inset-0 flex flex-col justify-between p-8 md:p-14 pointer-events-none transition-opacity duration-500 z-10 ${
          uiVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Top Header */}
        <div className="w-full flex items-center justify-between pointer-events-auto">
          <span className="text-[11px] uppercase tracking-[0.35em] font-light text-[#F6EAD8]/80">
            Tatva Atelier
          </span>
          <button
            type="button"
            onClick={handleSkip}
            className="text-[10px] uppercase tracking-[0.25em] text-[#F6EAD8]/70 hover:text-[#F6EAD8] transition-colors duration-200 px-4 py-1.5 rounded-full border border-white/20 hover:border-white/50 bg-black/30 hover:bg-black/50 backdrop-blur-sm shadow-sm cursor-pointer"
          >
            Skip Intro
          </button>
        </div>

        {/* Center Title */}
        <div className="flex flex-col items-center text-center space-y-3 pointer-events-none">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-[0.22em] text-[#F6EAD8] drop-shadow-md">
            TATVA
          </h1>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.38em] text-[#F6EAD8]/70">
            Where Spaces Take Shape
          </p>
        </div>

        {/* Bottom CTA / Hint */}
        <div className="flex flex-col items-center space-y-2 pointer-events-none">
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
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#F6EAD8]/40">
            Architectural Walkthrough
          </span>
        </div>
      </div>

      {/* 
        Native Video Decoding Element
        Maintained in background for GPU hardware decoding.
      */}
      <video
        ref={videoRef}
        src={videoSrc}
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
    </div>
  );
}
