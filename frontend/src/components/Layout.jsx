import { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import './Layout.css';

export default function Layout({ children }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const play = video.play();
    if (play?.catch) play.catch(() => {});
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause();
      setReady(true);
    }
  }, []);

  return (
    <div className="hero">
      <Navbar />
      
      <div className="hero__media" aria-hidden="true">
        <video 
          ref={videoRef} 
          className={`hero__video ${ready ? 'is-ready' : ''}`}
          src="/hero.mp4" 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="auto"
          onCanPlay={() => setReady(true)} 
        />
        <div className="hero__scrim" />
      </div>

      <div className="hero__content-layer">
        {children}
      </div>
    </div>
  );
}
