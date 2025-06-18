
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GeometricShape {
  id: string;
  type: 'circle' | 'polygon' | 'dot';
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
  rotation?: number;
}

export const PremiumBackground: React.FC = () => {
  const [shapes, setShapes] = useState<GeometricShape[]>([]);
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
    const colors = ['#6366f1', '#f59e0b', '#06b6d4'];
    const newShapes: GeometricShape[] = [];

    // Large circular gradients (3-4 pieces)
    for (let i = 0; i < 4; i++) {
      newShapes.push({
        id: `large-circle-${i}`,
        type: 'circle',
        size: Math.random() * 400 + 800, // 800-1200px
        x: Math.random() * 120 - 10, // -10% to 110%
        y: Math.random() * 120 - 10,
        duration: Math.random() * 30 + 45, // 45-75 seconds
        delay: Math.random() * 20,
        opacity: Math.random() * 0.02 + 0.02, // 2-4%
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // Medium geometric shapes (8-12 pieces)
    for (let i = 0; i < 10; i++) {
      newShapes.push({
        id: `medium-shape-${i}`,
        type: Math.random() > 0.5 ? 'circle' : 'polygon',
        size: Math.random() * 200 + 100, // 100-300px
        x: Math.random() * 120 - 10,
        y: Math.random() * 120 - 10,
        duration: Math.random() * 20 + 30, // 30-50 seconds
        delay: Math.random() * 15,
        opacity: Math.random() * 0.02 + 0.02, // 2-4%
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      });
    }

    // Small floating dots (20-30 pieces)
    for (let i = 0; i < 25; i++) {
      newShapes.push({
        id: `dot-${i}`,
        type: 'dot',
        size: Math.random() * 6 + 2, // 2-8px
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 15 + 20, // 20-35 seconds
        delay: Math.random() * 10,
        opacity: Math.random() * 0.015 + 0.02, // 2-3.5%
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setShapes(newShapes);
  }, []);

  if (isReducedMotion) {
    return null; // Respect accessibility preferences
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape) => (
        <div
          key={shape.id}
          className={cn(
            "absolute will-change-transform",
            shape.type === 'circle' && "rounded-full",
            shape.type === 'polygon' && "rounded-lg",
            shape.type === 'dot' && "rounded-full"
          )}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            background: shape.type === 'circle' || shape.type === 'dot' 
              ? `radial-gradient(circle, ${shape.color}${Math.floor(shape.opacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`
              : `linear-gradient(45deg, ${shape.color}${Math.floor(shape.opacity * 255).toString(16).padStart(2, '0')}, transparent)`,
            filter: shape.size > 500 ? 'blur(40px)' : shape.size > 100 ? 'blur(20px)' : 'blur(1px)',
            transform: shape.rotation ? `rotate(${shape.rotation}deg)` : undefined,
            animation: `
              float-${shape.type} ${shape.duration}s infinite linear ${shape.delay}s,
              ${shape.type === 'dot' ? `bob-${shape.id.split('-')[1]} 4s infinite ease-in-out ${shape.delay}s` : ''}
              ${shape.rotation !== undefined ? `, rotate-gentle 60s infinite linear ${shape.delay}s` : ''}
            `.trim(),
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes float-circle {
          0% { transform: translate3d(-10vw, -10vh, 0) scale(0.8); }
          25% { transform: translate3d(10vw, 10vh, 0) scale(1.1); }
          50% { transform: translate3d(5vw, -5vh, 0) scale(0.9); }
          75% { transform: translate3d(-5vw, 15vh, 0) scale(1.05); }
          100% { transform: translate3d(-10vw, -10vh, 0) scale(0.8); }
        }
        
        @keyframes float-polygon {
          0% { transform: translate3d(-8vw, -8vh, 0) rotate(0deg); }
          33% { transform: translate3d(8vw, 8vh, 0) rotate(120deg); }
          66% { transform: translate3d(-4vw, 12vh, 0) rotate(240deg); }
          100% { transform: translate3d(-8vw, -8vh, 0) rotate(360deg); }
        }
        
        @keyframes float-dot {
          0% { transform: translate3d(-20px, -20px, 0); }
          25% { transform: translate3d(20px, -10px, 0); }
          50% { transform: translate3d(10px, 20px, 0); }
          75% { transform: translate3d(-10px, 15px, 0); }
          100% { transform: translate3d(-20px, -20px, 0); }
        }
        
        @keyframes rotate-gentle {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        ${Array.from({ length: 25 }, (_, i) => `
          @keyframes bob-${i} {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(${Math.sin(i) * 8 - 4}px); }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
};
