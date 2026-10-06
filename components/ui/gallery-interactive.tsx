"use client";

import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Project = {
  name: string;
  images: string[];
};

export function GalleryInteractive({ projects }: { projects: Project[] }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Helper to find the current image index and project
  const getCurrentImageContext = () => {
    if (!selectedImage) return null;
    for (let pIdx = 0; pIdx < projects.length; pIdx++) {
      const project = projects[pIdx];
      const iIdx = project.images.findIndex((img) => img === selectedImage);
      if (iIdx !== -1) {
        return { project, pIdx, iIdx };
      }
    }
    return null;
  };

  const navigateImage = (e: React.MouseEvent, direction: "prev" | "next") => {
    e.stopPropagation();
    const context = getCurrentImageContext();
    if (!context) return;
    
    const { project, iIdx } = context;
    let newIndex = direction === "next" ? iIdx + 1 : iIdx - 1;
    
    // Cycle within the same project
    if (newIndex >= project.images.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = project.images.length - 1;
    }
    
    setSelectedImage(project.images[newIndex]);
  };

  return (
    <>
      <div className="space-y-32">
        {projects.map((project, idx) => (
          <section key={idx} className="relative">
            <div className="sticky top-20 z-30 bg-[#3B0700]/95 backdrop-blur-sm py-4 mb-8 border-b border-[#F6EAD8]/15">
              <h2
                className="text-2xl sm:text-3xl text-[#C59B6D] capitalize"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                {project.name.replace(/-/g, " ")}
              </h2>
              <span className="text-[10px] font-mono tracking-widest text-[#F6EAD8]/50 uppercase">
                {project.images.length} Photos
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {project.images.map((imgSrc, imgIdx) => (
                <div
                  key={imgIdx}
                  onClick={() => setSelectedImage(imgSrc)}
                  className="aspect-[4/3] overflow-hidden border border-[#F6EAD8]/10 group relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[#4A0A00] animate-pulse -z-10" />
                  <img
                    src={imgSrc}
                    alt={`${project.name} image ${imgIdx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <span className="text-[#F6EAD8] text-xs tracking-widest font-mono border border-[#F6EAD8]/50 px-4 py-2 backdrop-blur-sm bg-black/30">
                      VIEW FULLSCREEN
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 p-2 text-[#F6EAD8]/70 hover:text-[#F6EAD8] transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Left Arrow */}
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 text-[#F6EAD8]/70 hover:text-[#F6EAD8] bg-black/50 hover:bg-black/80 transition-all rounded-full z-[110]"
            onClick={(e) => navigateImage(e, "prev")}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Main Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center p-4">
            <img
              src={selectedImage}
              alt="Fullscreen gallery view"
              className="max-w-full max-h-[85vh] object-contain shadow-2xl border border-[#F6EAD8]/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Right Arrow */}
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 text-[#F6EAD8]/70 hover:text-[#F6EAD8] bg-black/50 hover:bg-black/80 transition-all rounded-full z-[110]"
            onClick={(e) => navigateImage(e, "next")}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </>
  );
}
