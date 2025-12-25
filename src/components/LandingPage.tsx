import React, { useEffect, useState } from "react";
import IntroImg1 from "../imgs/intro1.png";
import IntroImg2 from "../imgs/intro2.png";
// @ts-ignore
import textConfig from "../textConfig";

type Props = {
  onEnter?: () => void;
  herName?: string;
  yourName?: string;
  gifSrc?: string;
};

const LandingPage: React.FC<Props> = ({ onEnter, gifSrc }) => {
  const [typedText, setTypedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const gifUrl = gifSrc || IntroImg1;

  useEffect(() => {
    setIsVisible(true);
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(textConfig.landing.lastLine.slice(0, i));
      i++;
      if (i > textConfig.landing.lastLine.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    if (onEnter) onEnter();
    else {
      const el = document.getElementById("activity");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Container must be overflow-visible for decorations to show */}
      <main className="flex-grow relative w-full max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center overflow-visible">
        
        {/* Soft Pastel Ambient Blobs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>

        {/* Floating decorative elements (dots) */}
        <div className="absolute top-24 left-16 w-6 h-6 bg-amber-200 rounded-full opacity-60 animate-float shadow-sm"></div>
        <div className="absolute top-40 right-20 w-10 h-10 bg-rose-200 rounded-full opacity-50 animate-float-slow shadow-sm"></div>
        <div className="absolute bottom-40 left-12 w-5 h-5 bg-teal-200 rounded-full opacity-60 animate-float"></div>

        {/* Content Wrapper */}
        <div className={`text-center mb-12 relative z-10 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <span className="block text-rose-400 font-hand text-3xl mb-2 italic">
            {textConfig.landing.welcome}
          </span>
          <h1 className="text-5xl md:text-7xl font-display text-slate-800 tracking-tight leading-tight mb-12">
            {textConfig.landing.title}
          </h1>

          {/* Card Container */}
          <div className="relative inline-block w-full max-w-2xl mx-auto">
            
            {/* The IntroImg (intro2.png) - Positioned relative to the card */}
            <div className="absolute -bottom-8 -left-8 z-20 pointer-events-none transition-opacity duration-700">
                <img
                    src={IntroImg2}
                    alt="Decorative"
                    className="w-24 md:w-32 h-auto object-contain opacity-100 drop-shadow-2xl transform animate-float-slow"
                    style={{ filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" }}
                    onError={(e) => {
                        console.error("Image failed to load:", IntroImg2);
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>

            {/* Main Aesthetic Card */}
            <div className="relative bg-white/70 backdrop-blur-md rounded-[2.5rem] p-10 shadow-2xl shadow-rose-100/50 border border-white/80 z-10">
              
              {/* Soft MacBook-style dots */}
              <div className="absolute top-6 left-8 flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-300/70"></div>
                <div className="w-3 h-3 rounded-full bg-amber-300/70"></div>
                <div className="w-3 h-3 rounded-full bg-teal-300/70"></div>
              </div>

              {/* Intro GIF (intro1.png) */}
              <div className="absolute -top-16 -right-6 md:-right-12">
                <img
                  src={gifUrl}
                  alt="cute animation"
                  className="w-32 h-32 object-contain drop-shadow-xl animate-float"
                />
              </div>

              <div className="text-slate-600 text-lg md:text-xl leading-relaxed mb-10 mt-6">
                <p className="font-body font-medium opacity-90">{textConfig.landing.subtitle}</p>
                <p className="pt-6 font-hand text-2xl text-rose-500/90">
                  <span>{typedText}</span>
                  <span className="inline-block w-2 h-6 bg-rose-300 ml-1 animate-pulse rounded-full" />
                </p>
              </div>

              {/* Aesthetic Pill Button */}
              <button
                onClick={handleEnter}
                className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-rose-400 text-white font-semibold shadow-lg shadow-rose-200 hover:bg-rose-500 hover:shadow-rose-300 hover:-translate-y-0.5 transition-all duration-300 text-lg"
              >
                {textConfig.landing.button}
                <span className="material-icons-round group-hover:translate-x-1 transition-transform">
                  east
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Subtle Footer */}
      <footer className="w-full py-6 text-center text-sm text-slate-400 font-body tracking-wide opacity-80">
        {textConfig.landing.footer}
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
        
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-8px) rotate(-8deg); }
        }

        /* Subtle background pattern to enhance cozy vibes */
        body {
          background-color: #fdfaf9;
          background-image: radial-gradient(#ffe4e6 0.5px, transparent 0.5px), radial-gradient(#ffe4e6 0.5px, #fdfaf9 0.5px);
          background-size: 24px 24px;
          background-position: 0 0, 12px 12px;
        }
      `}</style>
    </>
  );
};

export default LandingPage;