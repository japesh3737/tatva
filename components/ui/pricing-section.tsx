"use client";

import React, { useState, useEffect } from "react";
import {
  PRICING_WORKFLOW_STEPS,
  PRICING_PACKAGES,
  PRICING_DISCLAIMER,
  PACKAGE_COMPARISON_DATA,
  PRICING_FAQS
} from "@/lib/pricing-data";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

export function PricingSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [isRequestMode, setIsRequestMode] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>("faq-1");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const activePackage = PRICING_PACKAGES[activeIndex];
  const activeImages = activePackage.images;
  const currentImage = activeImages[imageIndex] || activeImages[0];

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
    projectType: "Commercial Workplace",
    location: "",
    approxArea: "",
    budgetRange: "",
    preferredDateTime: "",
    description: ""
  });

  // Preload all local images across all packages for 0-lag transitions
  useEffect(() => {
    PRICING_PACKAGES.forEach((pkg) => {
      pkg.images.forEach((imgObj) => {
        const img = new Image();
        img.src = imgObj.src;
      });
    });
  }, []);

  // Continuous Navigation across all package images
  const navigateNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (imageIndex < activeImages.length - 1) {
      setImageIndex((prev) => prev + 1);
    } else {
      const nextPkgIndex = (activeIndex + 1) % PRICING_PACKAGES.length;
      setActiveIndex(nextPkgIndex);
      setImageIndex(0);
    }
  };

  const navigatePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (imageIndex > 0) {
      setImageIndex((prev) => prev - 1);
    } else {
      const prevPkgIndex =
        (activeIndex - 1 + PRICING_PACKAGES.length) % PRICING_PACKAGES.length;
      const prevPkgImages = PRICING_PACKAGES[prevPkgIndex].images;
      setActiveIndex(prevPkgIndex);
      setImageIndex(prevPkgImages.length - 1);
    }
  };

  const handleSelectPackage = (idx: number) => {
    setActiveIndex(idx);
    setImageIndex(0);
  };

  // Keyboard Navigation Support (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isRequestMode) return;
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "ArrowRight") {
        navigateNext();
      } else if (e.key === "ArrowLeft") {
        navigatePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRequestMode, activeIndex, imageIndex, activeImages.length]);

  const handlePrevPackage = (e?: React.MouseEvent) => {
    navigatePrev(e);
  };

  const handleNextPackage = (e?: React.MouseEvent) => {
    navigateNext(e);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    navigatePrev(e);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    navigateNext(e);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="pricing"
      aria-label="Packages, Pricing and Consultation Scope"
      className="relative z-10 py-24 sm:py-32 bg-[#3B0700] text-[#F6EAD8] bg-tatva-grain border-t border-[#F6EAD8]/15 overflow-hidden"
    >
      {/* Subtle Background Architectural Detailing */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.04]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #F6EAD8 1px, transparent 1px), linear-gradient(to bottom, #F6EAD8 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}
        />
        <div className="absolute top-12 left-12 font-mono text-[10px] text-[#F6EAD8] tracking-widest hidden sm:block">+ 00.120 / ARCH GRID</div>
        <div className="absolute top-12 right-12 font-mono text-[10px] text-[#F6EAD8] tracking-widest hidden sm:block">SPEC: REF-2026 +</div>
        <div className="absolute bottom-12 left-12 font-mono text-[10px] text-[#F6EAD8] tracking-widest hidden sm:block">+ ELEVATION LAYOUT</div>
        <div className="absolute bottom-12 right-12 font-mono text-[10px] text-[#F6EAD8] tracking-widest hidden sm:block">TATTVA TIER SYSTEM +</div>
      </div>

      <div className="w-full max-w-[1560px] lg:w-[92vw] mx-auto px-4 sm:px-8 relative z-10">
        {/* 1. EDITORIAL HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium mb-3">
            Investment & Engagement Tiers • मूल्य संरचना
          </span>
          <h2
            className="text-3xl sm:text-5xl font-normal tracking-tight text-[#F6EAD8] mb-4"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Pricing & Packages
          </h2>
          <div className="w-16 h-[1px] bg-[#C59B6D]/50 mx-auto mb-5" />
          <h3 className="text-base sm:text-xl font-light text-[#C59B6D] tracking-wide mb-3">
            Choose the level of support your project needs.
          </h3>
          <p className="text-xs sm:text-base text-[#F6EAD8]/80 font-light leading-relaxed">
            TATTVA offers tailored engagement models depending on whether your commercial space requires standalone architectural design, coordinated execution supervision, or complete end-to-end turnkey delivery.
          </p>
        </div>

        {/* 2. HOW OUR PRICING WORKS (4-STEP WORKFLOW) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C59B6D] font-mono">
              Transparent Valuation Process
            </span>
            <h4
              className="text-lg sm:text-2xl font-light text-[#F6EAD8] mt-1"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              How Our Pricing Works
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_WORKFLOW_STEPS.map((step) => (
              <div
                key={step.number}
                className="bg-[#4A0A00]/70 border border-[#F6EAD8]/15 p-6 flex flex-col justify-between hover:border-[#C59B6D]/40 transition-colors"
              >
                <div>
                  <span className="text-2xl sm:text-3xl font-mono font-light text-[#C59B6D] block mb-2">
                    {step.number}
                  </span>
                  <h5 className="text-sm font-medium text-[#F6EAD8] mb-1">
                    {step.title}
                  </h5>
                  <p className="text-xs text-[#F6EAD8]/75 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. EXPANDED FULL-SCREEN 1:1 INTERACTIVE EDITORIAL PACKAGE SLIDER WITH IMAGE CAROUSEL */}
        <div className="mb-24">
          <div className="bg-[#4A0A00] border border-[#F6EAD8]/20 shadow-2xl relative overflow-hidden min-h-[760px] lg:min-h-[82vh]">
            {!isRequestMode ? (
              /* VIEW MODE: EXPANDED 50/50 SPLIT PRESENTATION */
              <div className="flex flex-col lg:flex-row items-stretch w-full h-full min-h-[760px] lg:min-h-[82vh]">
                
                {/* LEFT 50%: MULTI-IMAGE CAROUSEL COLUMN */}
                <div className="lg:w-1/2 relative min-h-[360px] lg:min-h-[760px] lg:min-h-[82vh] bg-[#320700] overflow-hidden border-b lg:border-b-0 lg:border-r border-[#F6EAD8]/15 group">
                  {/* Subtle architectural framing overlay */}
                  <div className="absolute inset-5 border border-[#C59B6D]/30 pointer-events-none z-20 hidden sm:block" />

                  {/* Active Carousel Images */}
                  {activeImages.map((imgObj, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 w-full h-full transition-all duration-350 ease-out ${
                        idx === imageIndex
                          ? "opacity-100 scale-100 z-10"
                          : "opacity-0 scale-105 z-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={imgObj.src}
                        alt={imgObj.alt}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4A0A00] via-[#4A0A00]/20 to-transparent" />
                    </div>
                  ))}

                  {/* Top Left Banner: Image Counter */}
                  <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1 bg-[#320700]/80 border border-[#C59B6D]/40 text-xs font-mono text-[#F6EAD8] backdrop-blur-sm">
                    <ImageIcon className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span>
                      0{imageIndex + 1} / 0{activeImages.length}
                    </span>
                  </div>

                  {/* Top Right Banner: Photo Caption Overlay */}
                  {currentImage.caption && (
                    <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 px-3 py-1 bg-[#320700]/85 border border-[#C59B6D]/40 text-[10px] font-mono text-[#C59B6D] backdrop-blur-sm uppercase tracking-wider max-w-[300px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59B6D] shrink-0" />
                      <span className="truncate">{currentImage.caption}</span>
                    </div>
                  )}

                  {/* Image Carousel Controls: Left / Right Arrows */}
                  {activeImages.length > 1 && (
                    <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 z-20 flex items-center justify-between pointer-events-none">
                      <button
                        onClick={handlePrevImage}
                        aria-label="Previous project photo"
                        className="w-10 h-10 border border-[#F6EAD8]/30 bg-[#320700]/70 text-[#F6EAD8] hover:border-[#C59B6D] hover:bg-[#C59B6D] hover:text-[#320700] transition-all cursor-pointer pointer-events-auto flex items-center justify-center backdrop-blur-sm"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        aria-label="Next project photo"
                        className="w-10 h-10 border border-[#F6EAD8]/30 bg-[#320700]/70 text-[#F6EAD8] hover:border-[#C59B6D] hover:bg-[#C59B6D] hover:text-[#320700] transition-all cursor-pointer pointer-events-auto flex items-center justify-center backdrop-blur-sm"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {/* Bottom overlay: Subtitle & Pagination Dots */}
                  <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.25em] text-[#C59B6D] font-mono block mb-1">
                        {activePackage.subtitle}
                      </span>
                      <h4
                        className="text-3xl sm:text-4xl font-normal text-[#F6EAD8]"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        {activePackage.name}
                      </h4>
                    </div>

                    {/* Pagination Dots */}
                    {activeImages.length > 1 && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        {activeImages.map((_, dotIdx) => (
                          <button
                            key={dotIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setImageIndex(dotIdx);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                              dotIdx === imageIndex
                                ? "bg-[#C59B6D] w-6"
                                : "bg-[#F6EAD8]/40 hover:bg-[#F6EAD8]"
                            }`}
                            aria-label={`Go to photo ${dotIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT 50%: EDITORIAL CONTENT & NAVIGATION */}
                <div
                  key={activePackage.id}
                  className="lg:w-1/2 p-8 sm:p-12 lg:p-14 flex flex-col justify-between transition-all duration-350 ease-out"
                >
                  <div>
                    {/* Slide Navigation Header: Slide Counter & Package Tabs */}
                    <div className="flex items-center justify-between border-b border-[#F6EAD8]/15 pb-5 mb-8">
                      <div className="flex items-center gap-6 text-xs sm:text-sm font-mono tracking-widest text-[#F6EAD8]/60">
                        {PRICING_PACKAGES.map((pkg, idx) => (
                          <button
                            key={pkg.id}
                            onClick={() => handleSelectPackage(idx)}
                            className={`py-1 uppercase cursor-pointer transition-colors ${
                              idx === activeIndex
                                ? "text-[#C59B6D] border-b-2 border-[#C59B6D] font-bold"
                                : "hover:text-[#F6EAD8]"
                            }`}
                          >
                            {pkg.number} {pkg.name}
                          </button>
                        ))}
                      </div>

                      <div className="text-xs sm:text-sm font-mono tracking-widest text-[#C59B6D]">
                        0{activeIndex + 1} / 0{PRICING_PACKAGES.length}
                      </div>
                    </div>

                    {/* Active Package Header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C59B6D]">
                          ENGAGEMENT MODEL 0{activeIndex + 1}
                        </span>
                        {/* Package Indicator Label */}
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono tracking-widest text-[#C59B6D] bg-[#320700] border border-[#C59B6D]/40 uppercase">
                          {activePackage.indicator}
                        </span>
                      </div>

                      <h3
                        className="text-3xl sm:text-5xl font-normal text-[#F6EAD8] mb-3"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        {activePackage.name}
                      </h3>

                      {/* Ideal For Section */}
                      <div className="mb-4 py-2 px-4 bg-[#320700]/70 border-l-2 border-[#C59B6D] flex items-center gap-2 text-xs text-[#F6EAD8]/90 font-light">
                        <span className="text-[10px] font-mono text-[#C59B6D] uppercase tracking-wider font-medium shrink-0">
                          IDEAL FOR:
                        </span>
                        <span>{activePackage.idealFor}</span>
                      </div>

                      <p className="text-sm sm:text-base text-[#F6EAD8]/85 font-light leading-relaxed mb-4">
                        {activePackage.whoIsItFor}
                      </p>
                      <div className="py-3 px-5 bg-[#320700]/80 border-l-2 border-[#C59B6D]/50 text-xs sm:text-sm text-[#F6EAD8]/90 font-light leading-relaxed">
                        {activePackage.summary}
                      </div>
                    </div>

                    {/* Timeline Indicator */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C59B6D] font-light mb-8 pb-4 border-b border-[#F6EAD8]/10">
                      <Clock className="w-4.5 h-4.5 shrink-0 text-[#C59B6D]" />
                      <span>
                        <strong className="font-medium text-[#F6EAD8]">Estimated Timeline:</strong> {activePackage.timeline}
                      </span>
                    </div>

                    {/* Key Inclusions List */}
                    <div className="mb-8">
                      <span className="text-[11px] uppercase tracking-[0.25em] text-[#F6EAD8]/70 block mb-4 font-medium">
                        Key Inclusions & Deliverables:
                      </span>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#F6EAD8]/90 font-light">
                        {activePackage.includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 leading-snug">
                            <Check className="w-4 h-4 text-[#C59B6D] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Navigation & Action Bar */}
                  <div className="pt-6 border-t border-[#F6EAD8]/15 flex items-center justify-between gap-4 mt-auto">
                    <button
                      onClick={() => setIsRequestMode(true)}
                      className="flex-1 py-4 px-8 bg-[#C59B6D] text-[#320700] hover:bg-[#F6EAD8] uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Request a Quote</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    {/* Arrow Navigation */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={handlePrevPackage}
                        aria-label="Previous package"
                        className="w-12 h-12 border border-[#F6EAD8]/30 flex items-center justify-center text-[#F6EAD8] hover:bg-[#F6EAD8] hover:text-[#4A0A00] transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextPackage}
                        aria-label="Next package"
                        className="w-12 h-12 border border-[#F6EAD8]/30 flex items-center justify-center text-[#F6EAD8] hover:bg-[#F6EAD8] hover:text-[#4A0A00] transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* REQUEST MODE: IN-LINE CONSULTATION REQUEST FORM */
              <div className="p-8 sm:p-12 lg:p-14 w-full">
                <div className="flex items-center justify-between pb-6 border-b border-[#F6EAD8]/15 mb-8">
                  <button
                    onClick={() => {
                      setIsRequestMode(false);
                      setFormSubmitted(false);
                    }}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59B6D] hover:text-[#F6EAD8] transition-colors cursor-pointer font-mono"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Packages</span>
                  </button>

                  <div className="px-4 py-1.5 bg-[#320700] border border-[#C59B6D]/50 text-xs font-mono uppercase text-[#F6EAD8] tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B6D]" />
                    <span>Selected Package: {activePackage.name}</span>
                  </div>
                </div>

                {formSubmitted ? (
                  <div className="py-16 text-center max-w-xl mx-auto">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[#C59B6D] flex items-center justify-center text-[#C59B6D]">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4
                      className="text-2xl sm:text-3xl font-light text-[#F6EAD8] mb-4"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      Thank you for reaching out to TATTVA.
                    </h4>
                    <p className="text-sm text-[#F6EAD8]/85 font-light leading-relaxed mb-8">
                      Your project details have been received. Our team will review your requirements for <strong className="text-[#C59B6D] font-semibold">{activePackage.name}</strong> and get in touch shortly.
                    </p>
                    <button
                      onClick={() => {
                        setIsRequestMode(false);
                        setFormSubmitted(false);
                      }}
                      className="px-8 py-3.5 border border-[#F6EAD8]/40 text-xs uppercase tracking-[0.25em] text-[#F6EAD8] hover:bg-[#F6EAD8] hover:text-[#4A0A00] transition-colors cursor-pointer"
                    >
                      ← Return to Packages
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-6 max-w-4xl mx-auto">
                    <div className="mb-4">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-[#C59B6D] font-mono block mb-1">
                        Direct Scope Brief
                      </span>
                      <h4
                        className="text-2xl sm:text-3xl font-normal text-[#F6EAD8]"
                        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                      >
                        Request a Quotation — {activePackage.name}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Radhika Singhania"
                          className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. Acme Commercial Studio"
                          className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="radhika@domain.com"
                          className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98200 00000"
                          className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Project Type
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full bg-[#320700] border border-[#F6EAD8]/25 text-[#F6EAD8] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        >
                          <option value="Commercial Workplace">Commercial Workplace / Corporate Office</option>
                          <option value="Boutique Retail">Flagship Retail & Boutique Store</option>
                          <option value="Hospitality & Dining">Hospitality, Hotel & Dining Lounge</option>
                          <option value="Healthcare & Wellness">Healthcare & Wellness Facility</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Site Location / City
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. BKC, Mumbai or Aerocity, Delhi"
                          className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Approximate Area (sq. ft.)
                        </label>
                        <input
                          type="text"
                          value={formData.approxArea}
                          onChange={(e) => setFormData({ ...formData, approxArea: e.target.value })}
                          placeholder="e.g. 3,500 sq. ft."
                          className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Budget Range & Preferred Time
                        </label>
                        <input
                          type="text"
                          value={formData.budgetRange}
                          onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                          placeholder="e.g. ₹25L–₹50L • Weekday Afternoons"
                          className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                        Project Description & Specific Requirements
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Share details regarding architectural scope, target handover dates, floor plans..."
                        className="w-full bg-[#320700]/80 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#C59B6D] resize-none"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-4 bg-[#C59B6D] text-[#320700] hover:bg-[#F6EAD8] uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-md cursor-pointer"
                      >
                        Submit Consultation Request →
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 4. REDESIGNED COMPARISON & DIFFERENCES SECTION: THREE LARGE SIDE-BY-SIDE CARDS */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium block mb-2">
              Deliverables Matrix • तुलनात्मक विवरण
            </span>
            <h3
              className="text-3xl sm:text-5xl font-normal text-[#F6EAD8] mb-3"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Package Comparison & Scope Differences
            </h3>
            <p className="text-sm sm:text-base text-[#F6EAD8]/75 font-light">
              Explore pricing structures, timelines, and complete deliverable breakdown across our three engagement tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PRICING_PACKAGES.map((pkg, idx) => (
              <div
                key={pkg.id}
                className="bg-[#4A0A00] border border-[#F6EAD8]/20 hover:border-[#C59B6D]/70 p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 shadow-2xl relative group"
              >
                <div>
                  {/* Card Header & Number */}
                  <div className="flex items-center justify-between border-b border-[#F6EAD8]/15 pb-4 mb-6">
                    <span className="text-xs font-mono tracking-widest text-[#C59B6D]">
                      {pkg.number} // PACKAGE
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-[#C59B6D] px-2 py-0.5 bg-[#320700] border border-[#C59B6D]/30 uppercase">
                      {pkg.indicator}
                    </span>
                  </div>

                  <h4
                    className="text-2xl sm:text-3xl font-normal text-[#F6EAD8] mb-2"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {pkg.name}
                  </h4>

                  <div className="mb-4 py-1.5 px-3 bg-[#320700]/70 border-l border-[#C59B6D] text-[11px] text-[#F6EAD8]/85 font-light">
                    <span className="font-mono text-[#C59B6D] uppercase text-[10px] block mb-0.5">IDEAL FOR:</span>
                    {pkg.idealFor}
                  </div>

                  <p className="text-xs sm:text-sm text-[#F6EAD8]/75 font-light leading-relaxed mb-6">
                    {pkg.summary}
                  </p>

                  {/* PROMINENT PRICE DISPLAY INSIDE CARD */}
                  <div className="py-5 px-6 bg-[#320700]/90 border border-[#C59B6D]/40 mb-8 shadow-inner">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C59B6D] font-mono block mb-1">
                      {pkg.pricing.supporting}
                    </span>
                    <div
                      className="text-2xl sm:text-3xl font-normal text-[#F6EAD8] tracking-tight mb-2"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {pkg.pricing.main}
                    </div>
                    {pkg.pricing.note && (
                      <p className="text-[11px] text-[#F6EAD8]/70 font-light pt-2 border-t border-[#F6EAD8]/10 leading-snug">
                        {pkg.pricing.note}
                      </p>
                    )}
                  </div>

                  {/* SUBSTANTIALLY ENLARGED FEATURE DIFFERENCES */}
                  <div className="mb-8">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#C59B6D] font-semibold block mb-4 border-b border-[#F6EAD8]/10 pb-2">
                      Deliverables & Scope Breakdown
                    </span>
                    <ul className="space-y-3.5">
                      {PACKAGE_COMPARISON_DATA.map((row, rowIdx) => {
                        const val =
                          idx === 0
                            ? row.designOnly
                            : idx === 1
                            ? row.designExecution
                            : row.turnkey;
                        const isNotIncluded =
                          val === "Not included" || val === "Not specified";
                        const isIncluded = val.includes("Included");

                        return (
                          <li
                            key={rowIdx}
                            className="flex items-start justify-between gap-3 text-xs sm:text-sm leading-snug border-b border-[#F6EAD8]/5 pb-2"
                          >
                            <span className="font-medium text-[#F6EAD8]/90">
                              {row.feature}
                            </span>
                            <span
                              className={`font-semibold shrink-0 text-right ${
                                isNotIncluded
                                  ? "text-[#F6EAD8]/40 italic"
                                  : isIncluded
                                  ? "text-[#C59B6D]"
                                  : "text-[#F6EAD8]"
                              }`}
                            >
                              {val}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                {/* Direct Request CTA Button */}
                <div className="pt-6 border-t border-[#F6EAD8]/15 mt-auto">
                  <button
                    onClick={() => {
                      setActiveIndex(idx);
                      setIsRequestMode(true);
                      const element = document.getElementById("pricing");
                      if (element) {
                        element.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full py-4 bg-[#C59B6D] text-[#320700] hover:bg-[#F6EAD8] uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Request Quote for {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. CONCEPT TO COMPLETION & WHAT CHANGES PROGRESSION */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-mono block mb-2">
              Scope Progression • जिम्मेदारी का विकास
            </span>
            <h3
              className="text-3xl sm:text-4xl font-normal text-[#F6EAD8] mb-3"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              From Concept to Completion
            </h3>
            <p className="text-xs sm:text-base text-[#F6EAD8]/75 font-light">
              A transparent visual breakdown showing how responsibility and execution layers expand across each engagement tier.
            </p>
          </div>

          <div className="bg-[#4A0A00] border border-[#F6EAD8]/20 p-8 sm:p-12 relative overflow-hidden">
            <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-[1px] bg-gradient-to-r from-[#C59B6D]/20 via-[#C59B6D]/50 to-[#C59B6D]/20 -translate-y-6 z-0" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
              {/* STAGE 01 */}
              <div className="bg-[#320700]/90 border border-[#F6EAD8]/15 hover:border-[#C59B6D]/50 p-6 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-mono text-[#C59B6D]">01</span>
                    <span className="text-[10px] font-mono tracking-widest text-[#C59B6D] px-2 py-0.5 bg-[#4A0A00] border border-[#C59B6D]/30 uppercase">
                      DESIGN FOCUSED
                    </span>
                  </div>
                  <h4
                    className="text-xl font-normal text-[#F6EAD8] mb-2"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    Design-Only
                  </h4>
                  <p className="text-xs text-[#F6EAD8]/70 font-light leading-relaxed mb-6">
                    Architectural spatial strategy, 2D/3D layouts and documentation.
                  </p>

                  <div className="pt-4 border-t border-[#F6EAD8]/10 text-xs text-[#F6EAD8]/90">
                    <div className="flex items-center gap-2 text-[#C59B6D] font-mono text-[11px] flex-wrap">
                      <span>Concept</span>
                      <span>→</span>
                      <span>Plans</span>
                      <span>→</span>
                      <span>Visualisation</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 02 */}
              <div className="bg-[#320700]/90 border border-[#C59B6D]/50 p-6 flex flex-col justify-between transition-all shadow-lg">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-mono text-[#C59B6D]">02</span>
                    <span className="text-[10px] font-mono tracking-widest text-[#C59B6D] px-2 py-0.5 bg-[#4A0A00] border border-[#C59B6D]/30 uppercase">
                      DESIGN + MANAGEMENT
                    </span>
                  </div>
                  <h4
                    className="text-xl font-normal text-[#F6EAD8] mb-2"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    Design + Execution
                  </h4>
                  <p className="text-xs text-[#F6EAD8]/70 font-light leading-relaxed mb-6">
                    Design strategy combined with contractor coordination & on-site supervision.
                  </p>

                  <div className="pt-4 border-t border-[#F6EAD8]/10 text-xs text-[#F6EAD8]/90">
                    <div className="flex items-center gap-2 text-[#C59B6D] font-mono text-[11px] flex-wrap">
                      <span>Design</span>
                      <span>→</span>
                      <span>Coordination</span>
                      <span>→</span>
                      <span>Execution Management</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STAGE 03 */}
              <div className="bg-[#320700]/90 border border-[#F6EAD8]/15 hover:border-[#C59B6D]/50 p-6 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-mono text-[#C59B6D]">03</span>
                    <span className="text-[10px] font-mono tracking-widest text-[#C59B6D] px-2 py-0.5 bg-[#4A0A00] border border-[#C59B6D]/30 uppercase">
                      COMPLETE DELIVERY
                    </span>
                  </div>
                  <h4
                    className="text-xl font-normal text-[#F6EAD8] mb-2"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    Turnkey
                  </h4>
                  <p className="text-xs text-[#F6EAD8]/70 font-light leading-relaxed mb-6">
                    Single-point ownership from design & procurement to civil build and handover.
                  </p>

                  <div className="pt-4 border-t border-[#F6EAD8]/10 text-xs text-[#F6EAD8]/90">
                    <div className="flex items-center gap-1.5 text-[#C59B6D] font-mono text-[10px] sm:text-[11px] flex-wrap">
                      <span>Design</span>
                      <span>→</span>
                      <span>Procurement</span>
                      <span>→</span>
                      <span>Execution</span>
                      <span>→</span>
                      <span>Handover</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6. PRICING DISCLAIMER */}
        <div className="max-w-4xl mx-auto mb-24 p-6 sm:p-8 bg-[#320700]/80 border border-[#F6EAD8]/20 text-[#F6EAD8]/90 text-xs sm:text-sm leading-relaxed flex items-start gap-4">
          <Info className="w-5 h-5 text-[#C59B6D] shrink-0 mt-0.5" />
          <div>
            <span className="font-medium text-[#C59B6D] block uppercase tracking-[0.2em] text-[11px] mb-1.5">
              Every project is different.
            </span>
            <p className="font-light text-[#F6EAD8]/85">{PRICING_DISCLAIMER}</p>
          </div>
        </div>

        {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium mb-2">
              <HelpCircle className="w-4 h-4 text-[#C59B6D]" />
              <span>Clarifications & Guidance</span>
            </div>
            <h3
              className="text-2xl sm:text-4xl font-normal text-[#F6EAD8]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {PRICING_FAQS.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-[#F6EAD8]/20 bg-[#4A0A00] transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-5 px-6 flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none focus:bg-[#320700]/70"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="text-base sm:text-lg font-light text-[#F6EAD8]"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#C59B6D] shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-[#F6EAD8]/85 font-light leading-relaxed border-t border-[#F6EAD8]/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. REFINED FINAL CONSULTATION CTA BLOCK */}
        <div className="max-w-4xl mx-auto text-center p-10 sm:p-14 bg-[#4A0A00] border border-[#C59B6D]/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 border-r border-t border-[#C59B6D]/20 pointer-events-none" />
          <span className="text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-mono block mb-3">
            NOT SURE WHICH PACKAGE FITS YOUR PROJECT?
          </span>
          <h3
            className="text-3xl sm:text-4xl font-normal text-[#F6EAD8] mb-3"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Let's understand your space.
          </h3>
          <p className="text-sm text-[#F6EAD8]/80 font-light max-w-xl mx-auto leading-relaxed mb-8">
            Tell us about your space, requirements and timeline. We'll help you determine the right approach.
          </p>
          <button
            onClick={() => {
              setIsRequestMode(true);
              const element = document.getElementById("pricing");
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#C59B6D] text-[#320700] hover:bg-[#F6EAD8] uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-lg cursor-pointer"
          >
            <span>BOOK A CONSULTATION →</span>
          </button>
        </div>
      </div>
    </section>
  );
}
