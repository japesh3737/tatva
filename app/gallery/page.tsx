import React from "react";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GalleryInteractive } from "@/components/ui/gallery-interactive";

export const metadata = {
  title: "Gallery | Tatva Studio",
  description: "Explore our portfolio of previous architectural and interior design projects.",
};

import galleryData from "@/lib/gallery-data.json";

export default function GalleryPage() {
  const projects = galleryData;

  return (
    <main className="min-h-screen bg-[#3B0700] text-[#F6EAD8] bg-tatva-grain">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#3B0700]/90 backdrop-blur-md border-b border-[#F6EAD8]/10 px-6 sm:px-12 py-5 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#C59B6D] hover:text-[#F6EAD8] transition-colors font-mono">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-sm font-semibold tracking-[0.3em] uppercase" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Tatva Studio</span>
      </nav>

      <div className="pt-32 pb-24 px-6 sm:px-12 max-w-[1600px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-[#C59B6D] font-medium mb-3">
            Our Portfolio • हमारी कृतियाँ
          </span>
          <h1 
            className="text-4xl sm:text-6xl font-normal tracking-tight text-[#F6EAD8] mb-6"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Project Gallery
          </h1>
          <div className="w-16 h-[1px] bg-[#C59B6D]/50 mx-auto mb-6" />
          <p className="text-sm sm:text-base text-[#F6EAD8]/80 font-light leading-relaxed">
            Explore a curated selection of our previous architectural and interior design works, showcasing our commitment to detail, material, and spatial harmony.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center text-[#F6EAD8]/60 py-20">
            No projects found in the gallery.
          </div>
        ) : (
          <GalleryInteractive projects={projects} />
        )}
      </div>
    </main>
  );
}
