
import React, { useEffect, useState } from 'react';

interface CreativeElement {
  id: string;
  layer: 'ambiance' | 'media' | 'particle';
  type: 'organic' | 'rectangle' | 'circle';
  size: number;
  x: number;
  y: number;
  color: string;
  duration: number;
  delay: number;
  opacity: number;
  rotation?: number;
  morphing?: boolean;
}

export const MultimediaPremiumBackground: React.FC = () => {
  const [elements, setElements] = useState<CreativeElement[]>([]);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setIsReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Generate creative elements on mount
  useEffect(() => {
    const newElements: CreativeElement[] = [];

    // Layer 1 - Creative Ambiance (4-5 large organic shapes)
    const ambianceColors = [
      'rgba(88, 28, 135, 0.08)',   // Deep purple
      'rgba(147, 51, 234, 0.06)',  // Rich purple
      'rgba(236, 72, 153, 0.05)',  // Deep pink
      'rgba(79, 70, 229, 0.07)',   // Purple-blue
    ];

    for (let i = 0; i < 5; i++) {
      newElements.push({
        id: `ambiance-${i}`,
        layer: 'ambiance',
        type: 'organic',
        size: Math.random() * 400 + 1400, // 1400-1800px
        x: Math.random() * 120 - 10, // -10% to 110%
        y: Math.random() * 120 - 10,
        color: ambianceColors[Math.floor(Math.random() * ambianceColors.length)],
        duration: Math.random() * 30 + 60, // 60-90 seconds
        delay: Math.random() * 30,
        opacity: Math.random() * 0.03 + 0.05, // 5-8%
        morphing: true,
      });
    }

    // Layer 2 - Media Elements (6-8 floating abstract shapes)
    const mediaColors = [
      'rgba(79, 70, 229, 0.06)',   // Indigo
      'rgba(236, 72, 153, 0.04)',  // Pink
      'rgba(245, 158, 11, 0.05)',  // Amber
      'rgba(147, 51, 234, 0.05)',  // Purple
    ];

    for (let i = 0; i < 8; i++) {
      newElements.push({
        id: `media-${i}`,
        layer: 'media',
        type: Math.random() > 0.5 ? 'rectangle' : 'organic',
        size: Math.random() * 200 + 400, // 400-600px
        x: Math.random() * 110 - 5,
        y: Math.random() * 110 - 5,
        color: mediaColors[Math.floor(Math.random() * mediaColors.length)],
        duration: Math.random() * 25 + 35, // 35-60 seconds
        delay: Math.random() * 20,
        opacity: Math.random() * 0.02 + 0.04, // 4-6%
        rotation: Math.random() * 360,
      });
    }

    // Layer 3 - Particle System (20-25 small floating elements)
    const particleColors = [
      'rgba(88, 28, 135, 0.07)',
      'rgba(147, 51, 234, 0.05)',
      'rgba(236, 72, 153, 0.06)',
      'rgba(245, 158, 11, 0.04)',
    ];

    for (let i = 0; i < 24; i++) {
      newElements.push({
        id: `particle-${i}`,
        layer: 'particle',
        type: 'circle',
        size: Math.random() * 90 + 30, // 30-120px
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        duration: Math.random() * 20 + 25, // 25-45 seconds
        delay: Math.random() * 15,
        opacity: Math.random() * 0.04 + 0.03, // 3-7%
      });
    }

    setElements(newElements);
  }, []);

  // Generate sophisticated CSS animations
  const generateCSS = () => {
    let css = `
      @keyframes creative-ambiance {
        0% { 
          transform: translate3d(-15vw, -15vh, 0) scale(0.8); 
          border-radius: 60% 40% 40% 60%;
        }
        25% { 
          transform: translate3d(10vw, 15vh, 0) scale(1.1); 
          border-radius: 40% 60% 60% 40%;
        }
        50% { 
          transform: translate3d(20vw, -10vh, 0) scale(0.9); 
          border-radius: 70% 30% 50% 50%;
        }
        75% { 
          transform: translate3d(-8vw, 20vh, 0) scale(1.05); 
          border-radius: 30% 70% 40% 60%;
        }
        100% { 
          transform: translate3d(-15vw, -15vh, 0) scale(0.8); 
          border-radius: 60% 40% 40% 60%;
        }
      }
      
      @keyframes media-float {
        0% { 
          transform: translate3d(-12vw, -12vh, 0) rotate(0deg); 
          opacity: 0.4;
        }
        33% { 
          transform: translate3d(12vw, 8vh, 0) rotate(120deg); 
          opacity: 0.6;
        }
        66% { 
          transform: translate3d(-6vw, 18vh, 0) rotate(240deg); 
          opacity: 0.5;
        }
        100% { 
          transform: translate3d(-12vw, -12vh, 0) rotate(360deg); 
          opacity: 0.4;
        }
      }
      
      @keyframes particle-drift {
        0% { 
          transform: translate3d(-30px, -30px, 0); 
          opacity: 0.3;
        }
        25% { 
          transform: translate3d(40px, -20px, 0); 
          opacity: 0.7;
        }
        50% { 
          transform: translate3d(20px, 30px, 0); 
          opacity: 0.5;
        }
        75% { 
          transform: translate3d(-20px, 25px, 0); 
          opacity: 0.6;
        }
        100% { 
          transform: translate3d(-30px, -30px, 0); 
          opacity: 0.3;
        }
      }
      
      @keyframes creative-breathing {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
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
      
      {/* Premium Creative Background Base */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a24 50%, #2a2a3a 100%)',
          }}
        />
        
        {/* Animated Creative Elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            className="absolute will-change-transform"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.x}%`,
              top: `${element.y}%`,
              background: element.layer === 'ambiance' 
                ? `radial-gradient(ellipse at center, ${element.color}, transparent 70%)`
                : element.layer === 'media'
                ? `linear-gradient(45deg, ${element.color}, transparent 60%)`
                : `radial-gradient(circle, ${element.color}, transparent 50%)`,
              filter: element.layer === 'ambiance' 
                ? 'blur(120px)' 
                : element.layer === 'media'
                ? 'blur(40px)'
                : 'blur(15px)',
              borderRadius: element.type === 'organic' 
                ? '60% 40% 40% 60%' 
                : element.type === 'rectangle'
                ? '20px'
                : '50%',
              transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
              animation: `
                ${element.layer === 'ambiance' ? 'creative-ambiance' : 
                  element.layer === 'media' ? 'media-float' : 'particle-drift'} 
                ${element.duration}s infinite cubic-bezier(0.25, 0.46, 0.45, 0.94) ${element.delay}s,
                creative-breathing ${element.duration * 1.5}s infinite ease-in-out ${element.delay * 0.5}s
              `.trim(),
            }}
          />
        ))}
      </div>
    </>
  );
};
