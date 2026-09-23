"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface TatvaHeroProps {
  /**
   * Video source URL. Defaults to "/tatva-hero-interior.mp4".
   */
  videoSrc?: string;

  /**
   * Primary brand title. Defaults to "TATVA".
   */
  title?: string;

  /**
   * Reveal tagline displayed over the final 18% of scroll progress (or always when scrollLock is disabled).
   * Defaults to "Where Spaces Take Shape".
   *
   * Alternative Hinglish/English options:
   * // "Ghar Ko Do Naya Roop" (Hinglish: Give your home a new form)
   * // "Crafting Soulful Sanctuaries"
   * // "Rooted in Essence, Shaped by Space"
   */
  tagline?: string;

  /**
   * Text for the initial scroll call-to-action hint. Defaults to "SCROLL".
   */
  scrollHint?: string;

  /**
   * Total input pixels needed to scrub from 0% to 100% video progress (when enableScrollLock is true).
   * Defaults to 3200px.
   */
  scrubDistance?: number;

  /**
   * Whether to lock document.body scroll and scrub video on scroll.
   * Defaults to false so it flows seamlessly when placed below TatvaDoorIntro.
   */
  enableScrollLock?: boolean;

  /**
   * Optional custom className for outer wrapper.
   */
  className?: string;

  /**
   * Optional custom inline styles.
   */
  style?: React.CSSProperties;
}

export function TatvaHero({
  videoSrc = "/tatva-hero-interior.mp4",
  title = "TATVA",
  tagline = "Where Spaces Take Shape",
  // Alternative options for tagline:
  // tagline = "Ghar Ko Do Naya Roop",
  // tagline = "Crafting Soulful Sanctuaries",
  scrollHint = "SCROLL",
  scrubDistance = 3200,
  enableScrollLock = false,
  className = "",
  style = {},
}: TatvaHeroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Animation & transform DOM refs
  const titleRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Gesture tracking & physics state
  const targetProgressRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const isLockedRef = useRef<boolean>(enableScrollLock);
  const hasStartedRef = useRef<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(!enableScrollLock);

  // Video seek queue & decoding guard
  const isSeekingRef = useRef<boolean>(false);
  const pendingSeekTimeRef = useRef<number | null>(null);

  // Touch tracking
  const touchStartYRef = useRef<number>(0);

  // Body scroll lock helpers using position: fixed and scroll restoration
  const lockBody = useCallback(() => {
    if (typeof window === "undefined" || !enableScrollLock) return;
    const currentScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${currentScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    isLockedRef.current = true;
  }, [enableScrollLock]);

  const unlockBody = useCallback((resumeScrollOffset: number = 2) => {
    if (typeof window === "undefined") return;
    const scrollYStr = document.body.style.top;
    const scrollY = scrollYStr ? Math.abs(parseInt(scrollYStr, 10)) : 0;

    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    isLockedRef.current = false;
    window.scrollTo(0, Math.max(scrollY, resumeScrollOffset));
  }, []);

  // Video seek dispatcher with queueing
  const dispatchSeek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;

    const clampedTime = Math.max(0, Math.min(video.duration, time));

    if (isSeekingRef.current) {
      pendingSeekTimeRef.current = clampedTime;
      return;
    }

    if (Math.abs(video.currentTime - clampedTime) > 0.025) {
      isSeekingRef.current = true;
      video.currentTime = clampedTime;
    }
  }, []);

  // Update visual DOM elements directly for smooth 60/120 FPS
  const updateVisuals = useCallback(
    (progress: number) => {
      if (!enableScrollLock) return;

      // 1. Video subtle scale up (1 -> ~1.06)
      if (videoRef.current) {
        const scale = 1 + progress * 0.06;
        videoRef.current.style.transform = `scale(${scale.toFixed(4)})`;
      }

      // 2. Brand title fades/blurs out over first 35% of progress (0 -> 0.35)
      if (titleRef.current) {
        const titleProgress = Math.min(1, Math.max(0, progress / 0.35));
        const opacity = 1 - titleProgress;
        const blur = titleProgress * 14;
        const translateY = -titleProgress * 32;

        titleRef.current.style.opacity = opacity.toFixed(3);
        titleRef.current.style.filter = `blur(${blur.toFixed(1)}px)`;
        titleRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        titleRef.current.style.pointerEvents = opacity < 0.1 ? "none" : "auto";
      }

      // 3. Tagline fades/blurs IN over the last 18% of progress (0.82 -> 1.0)
      if (taglineRef.current) {
        const taglineProgress = Math.min(1, Math.max(0, (progress - 0.82) / 0.18));
        const opacity = taglineProgress;
        const blur = (1 - taglineProgress) * 12;
        const translateY = (1 - taglineProgress) * 24;

        taglineRef.current.style.opacity = opacity.toFixed(3);
        taglineRef.current.style.filter = `blur(${blur.toFixed(1)}px)`;
        taglineRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
        taglineRef.current.style.pointerEvents = opacity > 0.3 ? "auto" : "none";
      }

      // 4. Thin progress bar at viewport bottom fills left-to-right
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${(progress * 100).toFixed(2)}%`;
      }
    },
    [enableScrollLock]
  );

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    if (!enableScrollLock) {
      // Normal flow mode: play video ambiently, don't lock body
      video.play().catch(() => {});
      return;
    }

    // Check for prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      targetProgressRef.current = 1;
      currentProgressRef.current = 1;
      updateVisuals(1);
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = video.duration * 0.95;
      }
      return;
    }

    // Lock page scrolling initially if enabled
    lockBody();

    // iOS Safari buffering kick-off
    const bufferPromise = video.play();
    if (bufferPromise !== undefined) {
      bufferPromise
        .then(() => {
          video.pause();
        })
        .catch(() => {});
    }

    const handleSeeked = () => {
      isSeekingRef.current = false;
      if (pendingSeekTimeRef.current !== null) {
        const nextTime = pendingSeekTimeRef.current;
        pendingSeekTimeRef.current = null;
        dispatchSeek(nextTime);
      }
    };
    video.addEventListener("seeked", handleSeeked);

    let rafId: number;
    const LERP_FACTOR = 0.18;

    const animate = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      const delta = target - current;
      if (Math.abs(delta) > 0.0001) {
        currentProgressRef.current = current + delta * LERP_FACTOR;
      } else {
        currentProgressRef.current = target;
      }

      const progress = currentProgressRef.current;

      if (Number.isFinite(video.duration) && video.duration > 0) {
        const targetTime = progress * video.duration;
        dispatchSeek(targetTime);
      }

      updateVisuals(progress);

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    const markInteractionStarted = () => {
      if (!hasStartedRef.current) {
        hasStartedRef.current = true;
        setHasStarted(true);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      markInteractionStarted();

      if (isLockedRef.current) {
        e.preventDefault();

        if (targetProgressRef.current >= 0.999 && e.deltaY > 0) {
          unlockBody(10);
          window.scrollBy({ top: e.deltaY, behavior: "auto" });
          return;
        }

        const nextProgress = targetProgressRef.current + e.deltaY / scrubDistance;
        targetProgressRef.current = Math.max(0, Math.min(1, nextProgress));
      } else {
        if (window.scrollY <= 0 && e.deltaY < 0) {
          e.preventDefault();
          lockBody();
          targetProgressRef.current = Math.max(
            0,
            Math.min(1, 1 + e.deltaY / scrubDistance)
          );
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0) return;
      markInteractionStarted();

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartYRef.current - currentY;
      touchStartYRef.current = currentY;

      if (isLockedRef.current) {
        e.preventDefault();

        if (targetProgressRef.current >= 0.999 && deltaY > 0) {
          unlockBody(10);
          window.scrollBy({ top: deltaY, behavior: "auto" });
          return;
        }

        const nextProgress = targetProgressRef.current + deltaY / scrubDistance;
        targetProgressRef.current = Math.max(0, Math.min(1, nextProgress));
      } else {
        if (window.scrollY <= 0 && deltaY < 0) {
          e.preventDefault();
          lockBody();
          targetProgressRef.current = Math.max(
            0,
            Math.min(1, 1 + deltaY / scrubDistance)
          );
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    container.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true,
    });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
      capture: true,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
      capture: true,
    });

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener("seeked", handleSeeked);

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);

      container.removeEventListener("wheel", handleWheel, { capture: true });
      container.removeEventListener("touchstart", handleTouchStart, {
        capture: true,
      });
      container.removeEventListener("touchmove", handleTouchMove, {
        capture: true,
      });

      unlockBody(0);
    };
  }, [
    enableScrollLock,
    scrubDistance,
    lockBody,
    unlockBody,
    dispatchSeek,
    updateVisuals,
  ]);

  const handleExploreClick = () => {
    if (enableScrollLock) {
      targetProgressRef.current = 1;
      currentProgressRef.current = 1;
      updateVisuals(1);
      unlockBody(20);
    }
    const studioSection = document.getElementById("studio-intro");
    if (studioSection) {
      studioSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={containerRef}
      aria-label="Tatva Hero Experience"
      className={`relative w-full h-screen h-[100dvh] overflow-hidden bg-[#4A0A00] select-none text-[#F6EAD8] ${className}`}
      style={style}
    >
      {/* Background full-bleed video */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        autoPlay={!enableScrollLock}
        loop={!enableScrollLock}
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover object-center will-change-transform pointer-events-none"
        style={{
          transform: "scale(1)",
          transformOrigin: "center center",
        }}
      />

      {/* Neutral, light dark gradient overlay for text legibility (no red/maroon tint) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,13,0.3) 0%, rgba(5,7,13,0.05) 30%, rgba(5,7,13,0.15) 70%, rgba(5,7,13,0.5) 100%)",
        }}
      />

      {/* Persistent Brand Header Navigation */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-6 sm:py-8">
        <div className="flex items-center gap-3">
          {/* Stylized Devanagari Wordmark + Letter-spaced Latin subtext */}
          <div className="flex flex-col items-start leading-none group cursor-pointer">
            <span
              className="text-2xl sm:text-3xl font-bold tracking-normal text-[#F6EAD8] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
              style={{
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
              }}
            >
              तत्व
            </span>
            <span className="text-[10px] sm:text-[11px] tracking-[0.35em] text-[#F6EAD8]/80 font-medium mt-1 uppercase">
              TATVA
            </span>
          </div>
        </div>

        {/* Minimal Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.25em] text-[#F6EAD8]/85 font-medium uppercase">
          <a
            href="#interior-showcase"
            className="hover:text-[#F6EAD8] transition-colors"
          >
            Sanctuary
          </a>
          <a
            href="#studio-intro"
            className="hover:text-[#F6EAD8] transition-colors"
          >
            Philosophy
          </a>
          <a
            href="#services"
            className="hover:text-[#F6EAD8] transition-colors"
          >
            Services
          </a>
          <a
            href="#materiality"
            className="hover:text-[#F6EAD8] transition-colors"
          >
            Materiality
          </a>
          <a
            href="#contact"
            className="hover:text-[#F6EAD8] transition-colors"
          >
            Inquire
          </a>
        </nav>

        {/* Quick Consultation CTA */}
        <div>
          <button
            onClick={handleExploreClick}
            className="px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold border border-[#F6EAD8]/40 text-[#F6EAD8] hover:bg-[#F6EAD8] hover:text-[#4A0A00] transition-all duration-300 rounded-none cursor-pointer"
          >
            Consultation
          </button>
        </div>
      </header>

      {/* Brand Title Overlay */}
      <div
        ref={titleRef}
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 will-change-[transform,opacity,filter] ${
          !enableScrollLock ? "opacity-100" : ""
        }`}
        style={{
          opacity: 1,
          filter: "blur(0px)",
          transform: "translate3d(0, 0px, 0)",
        }}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Devanagari Hero Emblem */}
          <div
            className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-[#F6EAD8] mb-1 drop-shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
            }}
          >
            तत्व
          </div>

          {/* Letterspaced Latin Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.45em] text-[#F6EAD8] uppercase pl-[0.45em] mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
            {title}
          </h1>

          <div className="w-16 h-[1px] bg-[#F6EAD8]/40 my-3" />

          <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-[#F6EAD8]/90 font-light drop-shadow-md">
            {tagline}
          </p>

          <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C59B6D] font-light mt-2">
            Architecture • Interior Craft • Spatial Poetry
          </p>
        </div>
      </div>

      {/* Tagline Reveal (only active if scrollLock is enabled) */}
      {enableScrollLock && (
        <div
          ref={taglineRef}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6 will-change-[transform,opacity,filter] pointer-events-none"
          style={{
            opacity: 0,
            filter: "blur(12px)",
            transform: "translate3d(0, 24px, 0)",
          }}
        >
          <div className="max-w-3xl mx-auto flex flex-col items-center bg-[#05070D]/80 backdrop-blur-md border border-[#F6EAD8]/20 px-8 py-10 sm:px-14 sm:py-12 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#C59B6D] font-medium mb-3">
              The Reveal
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-[#F6EAD8] tracking-wide leading-tight mb-4">
              {tagline}
            </h2>

            <p className="text-xs sm:text-sm text-[#F6EAD8]/80 font-light max-w-lg mb-8 tracking-wider leading-relaxed">
              Where architecture listens to the soul of raw material. Welcome to
              the world of Tatva.
            </p>

            <button
              onClick={handleExploreClick}
              className="inline-flex items-center gap-3 px-6 py-3 bg-[#F6EAD8] text-[#05070D] hover:bg-[#EBDED0] text-xs font-semibold uppercase tracking-[0.25em] transition-transform duration-300 hover:scale-105 cursor-pointer shadow-lg"
            >
              <span>Enter Studio</span>
              <svg
                className="w-3.5 h-3.5 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Initial SCROLL Hint */}
      {enableScrollLock && (
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none transition-opacity duration-500 ${
            hasStarted ? "opacity-0" : "opacity-90"
          }`}
        >
          <span className="text-[10px] tracking-[0.35em] uppercase text-[#F6EAD8]/80 font-light">
            {scrollHint}
          </span>
          <svg
            className="w-4 h-4 text-[#F6EAD8]/80 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}

      {/* Bottom Progress Bar */}
      {enableScrollLock && (
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black/40 z-30">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#F6EAD8]/70 via-[#F6EAD8] to-[#E2CEB9] will-change-[width]"
            style={{ width: "0%" }}
          />
        </div>
      )}
    </section>
  );
}
