"use client";

import React, { useState } from "react";
import { TatvaEntrance } from "@/components/ui/tatva-entrance";
import { Button } from "@/components/ui/button";
import { PricingSection } from "@/components/ui/pricing-section";
import { ABOUT_TATTVA_CONTENT } from "@/lib/pricing-data";

export default function Home() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "Residential Sanctuary",
    location: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#4A0A00] text-[#F6EAD8] selection:bg-[#F6EAD8] selection:text-[#4A0A00]">
      {/* Scroll through the entrance before exploring the interior. */}
      <TatvaEntrance />

      {/* 2. MAROON-AND-CREAM TATVA BRAND SECTION (Next section scrolled into) */}
      <section
        id="tatva-hero"
        aria-label="Tatva Studio Brand Entrance"
        className="relative w-full min-h-[90vh] flex flex-col justify-between px-6 sm:px-12 py-10 sm:py-16 bg-[#4A0A00] bg-tatva-grain text-[#F6EAD8] border-b border-[#F6EAD8]/15"
      >
        {/* Navigation Bar */}
        <header className="w-full flex items-center justify-between pb-8">
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-start leading-none group cursor-pointer" onClick={scrollToTop}>
              <span
                className="text-2xl sm:text-3xl font-bold tracking-normal text-[#F6EAD8] drop-shadow-md"
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

          <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.25em] text-[#F6EAD8]/85 font-medium uppercase">
            <a href="#interior-showcase" className="hover:text-[#F6EAD8] transition-colors">
              Walkthrough
            </a>
            <a href="#tatva-hero" className="hover:text-[#F6EAD8] transition-colors">
              Studio
            </a>
            <a href="#studio-intro" className="hover:text-[#F6EAD8] transition-colors">
              Philosophy
            </a>
            <a href="#services" className="hover:text-[#F6EAD8] transition-colors">
              Disciplines
            </a>
            <a href="#materiality" className="hover:text-[#F6EAD8] transition-colors">
              Materiality
            </a>
            <a href="#pricing" className="hover:text-[#F6EAD8] transition-colors">
              Packages & Pricing
            </a>
            <a href="#contact" className="hover:text-[#F6EAD8] transition-colors">
              Inquire
            </a>
          </nav>

          <div>
            <a
              href="#contact"
              className="inline-block px-4 py-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold border border-[#F6EAD8]/40 text-[#F6EAD8] hover:bg-[#F6EAD8] hover:text-[#4A0A00] transition-all duration-300 cursor-pointer"
            >
              Consultation
            </a>
          </div>
        </header>

        {/* Hero Centerpiece: Devanagari तत्व Wordmark + TATVA Latin Lettering */}
        <div className="max-w-5xl mx-auto my-auto text-center flex flex-col items-center py-12 sm:py-20">
          {/* Large Stylized Devanagari Wordmark */}
          <div
            className="text-7xl sm:text-9xl md:text-[11rem] font-bold tracking-tight text-[#F6EAD8] mb-2 drop-shadow-[0_12px_40px_rgba(0,0,0,0.6)] select-none"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
            }}
          >
            तत्व
          </div>

          {/* Letter-spaced Latin Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-light tracking-[0.45em] text-[#F6EAD8] uppercase pl-[0.45em] mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            TATVA
          </h1>

          <div className="w-20 h-[1px] bg-[#F6EAD8]/40 my-4" />

          {/* Tagline */}
          <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-[#F6EAD8]/90 font-light max-w-xl">
            Where Spaces Take Shape
          </p>

          <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#C59B6D] font-light mt-3">
            Architecture • Interior Craft • Spatial Poetry
          </p>
        </div>

        {/* Hero Bottom Anchor */}
        <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#F6EAD8]/60 pt-6 border-t border-[#F6EAD8]/15">
          <span>01 // STUDIO INCEPTION</span>
          <span className="hidden sm:inline">GHAR KO DO NAYA ROOP • MUMBAI • DELHI • BENGALURU</span>
          <a href="#studio-intro" className="text-[#C59B6D] hover:text-[#F6EAD8] transition-colors">
            Explore Philosophy ↓
          </a>
        </div>
      </section>

      {/* 
        3. STUDIO PHILOSOPHY & ABOUT BLOCK
      */}
      <div className="relative z-10 bg-[#4A0A00] bg-tatva-grain">
        <section
          id="studio-intro"
          className="relative py-28 sm:py-36 px-6 sm:px-12 max-w-7xl mx-auto border-t border-[#F6EAD8]/15"
        >
          {/* Decorative Sanskrit / Devanagari background watermark */}
          <div
            aria-hidden="true"
            className="absolute top-12 right-6 sm:right-16 text-[120px] sm:text-[220px] font-bold text-[#F6EAD8]/[0.03] select-none pointer-events-none"
            style={{
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
            }}
          >
            तत्व
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium mb-4">
                About TATTVA • तत्व परिचय
              </span>
              <h2
                className="text-3xl sm:text-5xl font-normal tracking-tight text-[#F6EAD8] leading-[1.15] mb-6"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {ABOUT_TATTVA_CONTENT.title}
              </h2>
              <p className="text-xs sm:text-sm tracking-[0.25em] text-[#C59B6D] uppercase font-light">
                {ABOUT_TATTVA_CONTENT.tagline}
              </p>
            </div>

            <div className="lg:col-span-7 space-y-6 text-[#F6EAD8]/85 font-light text-base sm:text-lg leading-relaxed">
              {ABOUT_TATTVA_CONTENT.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* 
          4. SERVICE HIGHLIGHTS (4 CARDS)
        */}
        <section id="services" className="py-24 sm:py-32 bg-[#3B0700]/70 border-t border-[#F6EAD8]/15">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium block mb-3">
                  Capabilities & Craft
                </span>
                <h2 className="text-3xl sm:text-4xl font-light text-[#F6EAD8] tracking-wide">
                  Architectural Disciplines
                </h2>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-[#F6EAD8]/70 max-w-md">
                From structural conceptualization to bespoke artisan millwork, we manage the entire spatial lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div className="group relative bg-[#4A0A00] border border-[#F6EAD8]/15 p-8 transition-all duration-300 hover:border-[#F6EAD8]/50 hover:-translate-y-1 shadow-md">
                <div className="text-[#C59B6D] text-xs font-mono mb-4 tracking-widest">
                  01 // RESIDENTIAL
                </div>
                <h3 className="text-xl font-light text-[#F6EAD8] mb-3 group-hover:text-[#F6EAD8] transition-colors">
                  Bespoke Residential Sanctuaries
                </h3>
                <p className="text-sm text-[#F6EAD8]/75 font-light leading-relaxed mb-6">
                  Penthouses, ancestral villas, and intimate urban flats designed around natural light, acoustic calm, and heirloom joinery.
                </p>
                <div className="pt-4 border-t border-[#F6EAD8]/10 text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/60 space-y-1">
                  <div>• Master Suite Spatial Planning</div>
                  <div>• Custom Teakwood Joinery</div>
                  <div>• Integrated Daylighting</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group relative bg-[#4A0A00] border border-[#F6EAD8]/15 p-8 transition-all duration-300 hover:border-[#F6EAD8]/50 hover:-translate-y-1 shadow-md">
                <div className="text-[#C59B6D] text-xs font-mono mb-4 tracking-widest">
                  02 // COMMERCIAL
                </div>
                <h3 className="text-xl font-light text-[#F6EAD8] mb-3 group-hover:text-[#F6EAD8] transition-colors">
                  Commercial & Experiential
                </h3>
                <p className="text-sm text-[#F6EAD8]/75 font-light leading-relaxed mb-6">
                  Signature flagship boutiques, executive boardrooms, and atmospheric hospitality lounges that communicate prestige.
                </p>
                <div className="pt-4 border-t border-[#F6EAD8]/10 text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/60 space-y-1">
                  <div>• Flagship Retail Environments</div>
                  <div>• Bespoke Reception Lounges</div>
                  <div>• Brand Identity Translation</div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group relative bg-[#4A0A00] border border-[#F6EAD8]/15 p-8 transition-all duration-300 hover:border-[#F6EAD8]/50 hover:-translate-y-1 shadow-md">
                <div className="text-[#C59B6D] text-xs font-mono mb-4 tracking-widest">
                  03 // TURNKEY
                </div>
                <h3 className="text-xl font-light text-[#F6EAD8] mb-3 group-hover:text-[#F6EAD8] transition-colors">
                  Turnkey Design-Build Execution
                </h3>
                <p className="text-sm text-[#F6EAD8]/75 font-light leading-relaxed mb-6">
                  Single-point accountability from foundation MEP and structural detailing to the final hand-stitched linen curtain.
                </p>
                <div className="pt-4 border-t border-[#F6EAD8]/10 text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/60 space-y-1">
                  <div>• 3D Photorealistic Previews</div>
                  <div>• Rigorous On-Site Supervision</div>
                  <div>• Guaranteed Turnkey Handover</div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="group relative bg-[#4A0A00] border border-[#F6EAD8]/15 p-8 transition-all duration-300 hover:border-[#F6EAD8]/50 hover:-translate-y-1 shadow-md">
                <div className="text-[#C59B6D] text-xs font-mono mb-4 tracking-widest">
                  04 // HERITAGE & CRAFT
                </div>
                <h3 className="text-xl font-light text-[#F6EAD8] mb-3 group-hover:text-[#F6EAD8] transition-colors">
                  Heritage Restoration & Craft
                </h3>
                <p className="text-sm text-[#F6EAD8]/75 font-light leading-relaxed mb-6">
                  Revitalizing historical architectural properties with Indian stone-cutters, brass turners, and master lime plasterers.
                </p>
                <div className="pt-4 border-t border-[#F6EAD8]/10 text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/60 space-y-1">
                  <div>• Thikri Mirror & Brass Detailing</div>
                  <div>• Breathable Lime-Mortar Walls</div>
                  <div>• Reclaimed Wood Preservation</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 
          5. MATERIAL SYMPHONY
        */}
        <section id="materiality" className="py-24 sm:py-32 px-6 sm:px-12 max-w-7xl mx-auto border-t border-[#F6EAD8]/15">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium block mb-3">
              Sensory Palette • स्पर्श
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-[#F6EAD8] tracking-wide mb-4">
              The Material Symphony
            </h2>
            <p className="text-sm text-[#F6EAD8]/75 font-light leading-relaxed">
              We celebrate living, tactile surfaces that gain character and warmth across decades.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-[#F6EAD8]/20 bg-[#350700] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#C59B6D]/40 flex items-center justify-center text-[#C59B6D] text-sm font-serif">
                I
              </div>
              <h4 className="text-lg font-light text-[#F6EAD8] mb-2">Reclaimed Teak & Rosewood</h4>
              <p className="text-xs text-[#F6EAD8]/70 leading-relaxed font-light">
                Seasoned timber salvaged from heritage homes, finished with organic cold-pressed beeswax.
              </p>
            </div>

            <div className="border border-[#F6EAD8]/20 bg-[#350700] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#C59B6D]/40 flex items-center justify-center text-[#C59B6D] text-sm font-serif">
                II
              </div>
              <h4 className="text-lg font-light text-[#F6EAD8] mb-2">Chuna & Hydraulic Lime</h4>
              <p className="text-xs text-[#F6EAD8]/70 leading-relaxed font-light">
                Hand-troweled multi-coat lime plaster offering breathable, naturally antimicrobial wall finishes.
              </p>
            </div>

            <div className="border border-[#F6EAD8]/20 bg-[#350700] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#C59B6D]/40 flex items-center justify-center text-[#C59B6D] text-sm font-serif">
                III
              </div>
              <h4 className="text-lg font-light text-[#F6EAD8] mb-2">Chiseled Indian Stones</h4>
              <p className="text-xs text-[#F6EAD8]/70 leading-relaxed font-light">
                Rough-sawn Dholpur sandstone, honed Jaisalmer yellow stone, and textured Kadappa black slabs.
              </p>
            </div>

            <div className="border border-[#F6EAD8]/20 bg-[#350700] p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[#C59B6D]/40 flex items-center justify-center text-[#C59B6D] text-sm font-serif">
                IV
              </div>
              <h4 className="text-lg font-light text-[#F6EAD8] mb-2">Hand-Turned Brass Hardware</h4>
              <p className="text-xs text-[#F6EAD8]/70 leading-relaxed font-light">
                Raw, unlacquered brass handles and joinery forged by generational metalsmiths in Moradabad.
              </p>
            </div>
          </div>
        </section>

        {/* 
          6. PACKAGES & PRICING (MANASVINI)
        */}
        <PricingSection />

        {/* 
          6. CONTACT & CONSULTATION CTA
        */}
        <section id="contact" className="py-24 sm:py-32 bg-[#320700] border-t border-[#F6EAD8]/15">
          <div className="max-w-6xl mx-auto px-6 sm:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Studio Contact Information */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span
                      className="text-4xl font-bold tracking-normal text-[#F6EAD8]"
                      style={{
                        fontFamily:
                          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
                      }}
                    >
                      तत्व
                    </span>
                    <span className="text-xs tracking-[0.35em] text-[#F6EAD8]/80 font-medium uppercase">
                      TATVA STUDIO
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-light text-[#F6EAD8] leading-tight mb-4">
                    Begin the Dialogue
                  </h3>
                  <p className="text-sm text-[#F6EAD8]/80 font-light leading-relaxed mb-8">
                    Every landmark project begins with an unhurried conversation. Share your architectural vision, floor plans, or site aspirations with our principal design partners.
                  </p>

                  <div className="space-y-4 text-xs tracking-wider uppercase text-[#F6EAD8]/75">
                    <div>
                      <span className="text-[#C59B6D] block font-semibold mb-1">Studio Headquarters</span>
                      <p className="normal-case font-light text-sm text-[#F6EAD8]/90">
                        Level 4, The Art Guild House, Phoenix Market City, Kurla West, Mumbai 400070
                      </p>
                    </div>

                    <div>
                      <span className="text-[#C59B6D] block font-semibold mb-1">Regional Studios</span>
                      <p className="normal-case font-light text-sm text-[#F6EAD8]/90">
                        Golf Course Road (Gurugram) • 12th Main Indiranagar (Bengaluru)
                      </p>
                    </div>

                    <div>
                      <span className="text-[#C59B6D] block font-semibold mb-1">Direct Inquiries</span>
                      <p className="normal-case font-light text-sm text-[#F6EAD8]/90">
                        concierge@tatvadesign.in • +91 (022) 6820 9000
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-[#F6EAD8]/15">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#C59B6D]">
                    Ghar Ko Do Naya Roop • Transforming Spaces Nationwide
                  </p>
                </div>
              </div>

              {/* Consultation Booking Form */}
              <div className="lg:col-span-7 bg-[#4A0A00] border border-[#F6EAD8]/20 p-8 sm:p-10 shadow-2xl">
                {formSubmitted ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-[#C59B6D] flex items-center justify-center text-[#C59B6D] text-2xl">
                      ✓
                    </div>
                    <h4 className="text-2xl font-light text-[#F6EAD8] mb-3">
                      Inquiry Received • धन्यवाद
                    </h4>
                    <p className="text-sm text-[#F6EAD8]/80 max-w-md mx-auto leading-relaxed mb-6 font-light">
                      Thank you for inviting Tatva into your vision. Our senior design director will review your project brief and connect within 24 business hours.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs tracking-widest uppercase"
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="border-b border-[#F6EAD8]/15 pb-3">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-[#C59B6D] font-medium block">
                        Direct Appointment Brief
                      </span>
                      <h4 className="text-xl font-light text-[#F6EAD8]">
                        Schedule an Architectural Consultation
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="e.g. Radhika Singhania"
                          className="w-full bg-[#320700]/70 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#F6EAD8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="radhika@domain.com"
                          className="w-full bg-[#320700]/70 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#F6EAD8]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Phone / WhatsApp *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+91 98200 00000"
                          className="w-full bg-[#320700]/70 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#F6EAD8]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                          Project Typology
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) =>
                            setFormData({ ...formData, projectType: e.target.value })
                          }
                          className="w-full bg-[#320700] border border-[#F6EAD8]/25 text-[#F6EAD8] px-4 py-2.5 text-sm focus:outline-none focus:border-[#F6EAD8]"
                        >
                          <option value="Residential Sanctuary">Residential Sanctuary (Villa/Penthouse)</option>
                          <option value="Commercial Space">Commercial / Boutique Hospitality</option>
                          <option value="Turnkey Architectural Delivery">Turnkey Architectural Delivery</option>
                          <option value="Heritage Restoration">Heritage Restoration</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                        Site Location / City
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="e.g. Worli, Mumbai or Central Delhi"
                        className="w-full bg-[#320700]/70 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#F6EAD8]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.2em] text-[#F6EAD8]/70 mb-2">
                        Project Scope & Timeline
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Briefly describe the square footage, architectural vision, or desired aesthetic..."
                        className="w-full bg-[#320700]/70 border border-[#F6EAD8]/25 text-[#F6EAD8] placeholder-[#F6EAD8]/30 px-4 py-2.5 text-sm focus:outline-none focus:border-[#F6EAD8] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#F6EAD8] text-[#4A0A00] hover:bg-[#EBDED0] uppercase tracking-[0.25em] text-xs font-semibold transition-all duration-300 shadow-md cursor-pointer"
                    >
                      Submit Consultation Request →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 
          7. FOOTER
        */}
        <footer className="py-12 px-6 sm:px-12 border-t border-[#F6EAD8]/15 bg-[#2A0600]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span
                className="text-3xl font-bold tracking-normal text-[#F6EAD8]"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Devanagari', 'Mangal', serif",
                }}
              >
                तत्व
              </span>
              <div className="text-[11px] tracking-[0.3em] uppercase text-[#F6EAD8]/70">
                TATVA • STUDIO OF ARCHITECTURE & INTERIORS
              </div>
            </div>

            <div className="text-[11px] tracking-widest text-[#F6EAD8]/50 uppercase text-center md:text-right">
              © {new Date().getFullYear()} TATVA STUDIO. ALL RIGHTS RESERVED.
            </div>

            <button
              onClick={scrollToTop}
              className="text-[10px] uppercase tracking-[0.25em] text-[#F6EAD8]/80 hover:text-[#F6EAD8] border border-[#F6EAD8]/20 px-3 py-1.5 transition-colors cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
