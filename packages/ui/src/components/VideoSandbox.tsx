import React, { useState } from 'react';
import { useLayoutTheme } from '../context/LayoutThemeContext';

interface VideoSandboxProps {
  videoUrl?: string; // YouTube/Loom embed or watch url
  ctaLink: string;
  thumbnailUrl?: string; // Optional custom thumbnail URL
  title?: string;
  description?: string;
}

export function VideoSandbox({
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", // fallback premium video placeholder
  ctaLink,
  thumbnailUrl,
  title = "Bridgeway Walkthrough & Feature Roster Loop",
  description = "Learn how to manage your practice scheduling, walk-ins, and analytics in under 5 minutes."
}: VideoSandboxProps) {
  const { layoutTheme, themeConfig } = useLayoutTheme() as any;
  const [isPlaying, setIsPlaying] = useState(false);

  // Layout Theme configurations for visual alignment
  const borderClass = 
    themeConfig?.borderStyle === 'rounded' ? 'rounded-2xl' :
    themeConfig?.borderStyle === 'sharp' ? 'rounded-none' :
    themeConfig?.borderStyle === 'subtle' ? 'rounded-lg border border-gray-800' :
    'rounded-none border-none';

  const paddingClass =
    themeConfig?.density === 'dense' ? 'p-4' :
    themeConfig?.density === 'spacious' ? 'p-8' :
    'p-6';

  // Convert watch/share URL to embed URL if needed
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('loom.com/share/')) {
      return url.replace('loom.com/share/', 'loom.com/embed/');
    }
    return url;
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <div className={`bg-gray-900 border border-gray-800/80 shadow-2xl overflow-hidden text-left transition-all ${borderClass} ${paddingClass}`}>
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white tracking-tight leading-snug">{title}</h3>
        <p className="text-xs text-gray-400 mt-1">{description}</p>
      </div>

      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full overflow-hidden bg-black/90 aspect-video rounded-xl shadow-inner group">
        {!isPlaying ? (
          <button
            onClick={handlePlayClick}
            className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-xl"
            aria-label="Play video overview"
          >
            {/* Custom thumbnail or rich CSS gradient placeholder */}
            {thumbnailUrl ? (
              <img 
                src={thumbnailUrl} 
                alt="Walkthrough Preview Thumbnail" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-amber-950/20 flex flex-col justify-center items-center p-6 text-center">
                <span className="text-[10px] text-amber-500/80 font-semibold uppercase tracking-[0.2em] mb-2">Automated Sandbox Tour</span>
                <span className="text-lg font-serif text-gray-100 font-medium line-clamp-1 max-w-sm">Watch the 60s Bridgeway Engine Demo</span>
                <span className="text-xs text-gray-500 mt-2">Click to load dynamic media stream</span>
              </div>
            )}

            {/* Play Button Overlay Overlay */}
            <div className="absolute inset-0 bg-neutral-950/40 group-hover:bg-neutral-950/30 transition-colors duration-300 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={`${getEmbedUrl(videoUrl)}?autoplay=1&mute=0`}
            title={title}
            className="absolute inset-0 w-full h-full border-none rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>

      {/* Call to Action Container */}
      <div className="mt-5 pt-4 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-left">
          <p className="text-xs font-semibold text-gray-200">Import Client Lists Instantly</p>
          <p className="text-[11px] text-gray-500">Map fields manually or automatically inside our live sandboxes.</p>
        </div>
        <a
          href={ctaLink}
          className="w-full sm:w-auto text-center px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold uppercase tracking-[0.1em] rounded-lg shadow-md hover:shadow-amber-500/10 transition-all duration-300"
        >
          Initialize 60-Second Custom Sandbox with Your Roster Data
        </a>
      </div>
    </div>
  );
}
