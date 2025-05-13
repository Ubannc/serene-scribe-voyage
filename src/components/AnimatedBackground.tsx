
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function AnimatedBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize GSAP animations
    if (blob1Ref.current && blob2Ref.current) {
      // Animate the first blob
      gsap.to(blob1Ref.current, {
        x: "5%",
        y: "3%",
        scale: 1.05,
        duration: 25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Animate the second blob
      gsap.to(blob2Ref.current, {
        x: "-4%",
        y: "-3%",
        scale: 0.95,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5
      });
    }
    
    return () => {
      // Clean up animations
      gsap.killTweensOf([blob1Ref.current, blob2Ref.current]);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Subtle blobs */}
      <div 
        ref={blob1Ref}
        className="absolute opacity-20 blur-3xl"
        style={{
          width: '70%',
          height: '70%',
          top: '10%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(180,180,230,0.3) 0%, rgba(200,200,245,0.2) 50%, rgba(220,220,255,0.1) 100%)',
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        }}
      ></div>
      
      <div 
        ref={blob2Ref}
        className="absolute opacity-20 blur-3xl"
        style={{
          width: '80%',
          height: '80%',
          bottom: '0%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(220,220,255,0.2) 0%, rgba(200,200,245,0.15) 50%, rgba(180,180,230,0.1) 100%)',
          borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%',
        }}
      ></div>
    </div>
  );
}
