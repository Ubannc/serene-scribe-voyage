
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function AnimatedBackground() {
  const bgRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Initialize GSAP animations
    if (bgRef.current && blob1Ref.current && blob2Ref.current && dustRef.current) {
      // Animate the first blob
      gsap.to(blob1Ref.current, {
        x: "10%",
        y: "5%",
        rotation: 15,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Animate the second blob
      gsap.to(blob2Ref.current, {
        x: "-8%",
        y: "-5%",
        rotation: -10,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5
      });
      
      // Animate the dust particles
      gsap.to(dustRef.current, {
        backgroundPosition: '100px 100px',
        duration: 30,
        repeat: -1,
        ease: "linear"
      });
    }
    
    return () => {
      // Clean up animations
      gsap.killTweensOf([blob1Ref.current, blob2Ref.current, dustRef.current]);
    };
  }, []);
  
  return (
    <div ref={bgRef} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Blue background mesh */}
      <div className="absolute inset-0 bg-mesh-gradient"></div>
      
      {/* First morphing blob */}
      <div 
        ref={blob1Ref}
        className="absolute opacity-50 blur-3xl"
        style={{
          width: '60%',
          height: '60%',
          top: '10%',
          left: '10%',
          background: 'radial-gradient(circle, rgba(64,103,255,0.3) 0%, rgba(118,74,222,0.2) 50%, rgba(64,183,255,0.1) 100%)',
          borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
        }}
      ></div>
      
      {/* Second morphing blob */}
      <div 
        ref={blob2Ref}
        className="absolute opacity-40 blur-3xl"
        style={{
          width: '70%',
          height: '70%',
          bottom: '0%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(64,183,255,0.2) 0%, rgba(118,74,222,0.15) 50%, rgba(64,103,255,0.25) 100%)',
          borderRadius: '40% 60% 30% 70% / 60% 40% 70% 30%',
        }}
      ></div>
      
      {/* Enhanced dust particles */}
      <div 
        ref={dustRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px, 20px 20px, 15px 15px',
          backgroundPosition: '0 0, 10px 10px, 20px 20px',
        }}
      ></div>
    </div>
  );
}
