
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import gsap from 'gsap';

export function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState(0);
  const { language, isRTL } = useLanguage();
  const counterRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Increment visit count when component mounts
    const incrementVisits = async () => {
      // Check if this is a new session
      const hasVisited = sessionStorage.getItem('has_visited');
      
      if (!hasVisited) {
        try {
          // Increment the counter in Supabase
          const { data } = await supabase.rpc('increment_visitor_count');
          if (data) {
            setVisitorCount(data);
            // Animate the counter
            if (counterRef.current) {
              gsap.from(counterRef.current, {
                scale: 1.5,
                duration: 0.5,
                ease: "elastic.out(1.2, 0.5)"
              });
            }
          }
          
          // Mark this session as counted
          sessionStorage.setItem('has_visited', 'true');
        } catch (error) {
          console.error('Error incrementing visitor count:', error);
        }
      }
    };
    
    // Get initial count
    const fetchVisitorCount = async () => {
      try {
        const { data } = await supabase.rpc('get_visitor_count');
        if (data !== null) {
          setVisitorCount(data);
        }
      } catch (error) {
        console.error('Error fetching visitor count:', error);
      }
    };
    
    fetchVisitorCount();
    incrementVisits();
    
    // Set up subscription for real-time updates
    const channel = supabase
      .channel('public:visitor_count')
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'visitor_count' 
        },
        (payload) => {
          if (payload.new && payload.new.count) {
            setVisitorCount(payload.new.count);
            // Animate the counter
            if (counterRef.current) {
              gsap.from(counterRef.current, {
                scale: 1.5,
                duration: 0.5,
                ease: "elastic.out(1.2, 0.5)"
              });
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  return (
    <div className={`text-center glass-dark px-3 py-1 rounded-full text-xs ${isRTL ? 'font-amiri' : ''} flex items-center gap-1`}>
      {language === 'en' ? 'Visitors: ' : 'الزوار: '}
      <span ref={counterRef} className="font-bold">{visitorCount.toLocaleString()}</span>
    </div>
  );
}
