import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`${className} relative flex items-center justify-center isolate`}>
      {/* Base Image: Black Icon on White Background */}
      <img 
        src="https://static.vecteezy.com/system/resources/thumbnails/073/658/782/small/graduate-silhouette-a-symbol-of-education-and-achievement-perfect-design-for-any-project-vector.jpg" 
        alt="ProfileHub Logo"
        className="absolute inset-0 w-full h-full object-contain"
      />
      {/* 
        Color Overlay:
        Using mix-blend-mode: screen on a dark blue layer over a black-on-white image:
        - Black pixels (0) combined with Blue pixels -> become Blue.
        - White pixels (1) combined with Blue pixels -> remain White.
        Result: A Dark Blue Icon on a White Background.
      */}
      <div className="absolute inset-0 bg-blue-600 mix-blend-screen" aria-hidden="true" />
    </div>
  );
};