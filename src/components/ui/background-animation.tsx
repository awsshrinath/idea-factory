
import React, { useEffect, useState } from 'react';

interface FloatingShape {
  id: string;
  type: 'large' | 'small';
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
  rotation?: number;
}

export const BackgroundAnimation: React.FC = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Generate shapes on mount
  useEffect(() => {
    const colors = [
      'rgba(99, 102, 241, 0.03)',  // Deep purple
      'rgba(245, 158, 11, 0.03)',  // Warm gold
      'rgba(6, 182, 212, 0.03)'    // Teal
    ];
    
    const smallColors = [
      'rgba(99, 102, 241, 0.02)',
      'rgba(245, 158, 11, 0.02)',
      'rgba(6, 182, 212, 0.02)'
    ];

    const newShapes: FloatingShape[] = [];

    // 3-4 large blurred circles (600-800px diameter)
    for (let i = 0; i < 4; i++) {
      newShapes.push({
        id: `large-${i}`,
        type: 'large',
        size: Math.random() * 200 + 600, // 600-800px
        x: Math.random() * 120 - 10, // -10% to 110% (allows overflow)
        y: Math.random() * 120 - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 20 + 40, // 40-60 seconds
        delay: Math.random() * 20, // 0-20 seconds
      });
    }

    // 8-12 smaller shapes (80-150px)
    for (let i = 0; i < 10; i++) {
      newShapes.push({
        id: `small-${i}`,
        type: 'small',
        size: Math.random() * 70 + 80, // 80-150px
        x: Math.random() * 110 - 5, // -5% to 105%
        y: Math.random() * 110 - 5,
        color: smallColors[Math.floor(Math.random() * smallColors.length)],
        duration: Math.random() * 20 + 20, // 20-40 seconds
        delay: Math.random() * 20, // 0-20 seconds
        rotation: Math.random() * 360,
      });
    }

    setShapes(newShapes);
  }, []);

  // Generate CSS keyframes dynamically
  const generateCSS = () => {
    let css = '';

    // Large circle floating animation
    css += `
      @keyframes float-large {
        0% { transform: translate3d(-10vw, -10vh, 0); }
        25% { transform: translate3d(10vw, 10vh, 0); }
        50% { transform: translate3d(5vw, -5vh, 0); }
        75% { transform: translate3d(-5vw, 15vh, 0); }
        100% { transform: translate3d(-10vw, -10vh, 0); }
      }
    `;

    // Small shape floating with rotation
    css += `
      @keyframes float-small {
        0% { transform: translate3d(-8vw, -8vh, 0) rotate(0deg); }
        33% { transform: translate3d(8vw, 8vh, 0) rotate(120deg); }
        66% { transform: translate3d(-4vw, 12vh, 0) rotate(240deg); }
        100% { transform: translate3d(-8vw, -8vh, 0) rotate(360deg); }
      }
    `;

    return css;
  };

  if (isReducedMotion) {
    return null; // Respect accessibility preferences
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: generateCSS() }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className="absolute rounded-full will-change-transform"
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              background: `radial-gradient(circle, ${shape.color}, transparent 70%)`,
              filter: shape.type === 'large' ? 'blur(60px)' : 'blur(20px)',
              transform: shape.rotation ? `rotate(${shape.rotation}deg)` : undefined,
              animation: `float-${shape.type} ${shape.duration}s infinite ease-in-out ${shape.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};
