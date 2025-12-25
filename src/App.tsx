import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import textConfig from './textConfig';
import LandingPage from './components/LandingPage';
import ActivityPage from './components/ActivityPage';
import ChillZone from './components/ChillZone';
import CardsSection from './components/CardsSection';
import FinalLetter from './components/FinalLetter';
import CherryBlossoms from './components/SnowFall'; // Your snowfall component
import AeroplanePng from './imgs/aeroplane.png';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Show intro for 4.5 seconds to allow the aeroplane and text to animate fully
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);
  
  const goToPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pages = [
    <LandingPage onEnter={() => goToPage(1)} />,
    <ActivityPage onNext={() => goToPage(2)} />,
    <ChillZone onNext={() => goToPage(3)} />,
    <CardsSection onNext={() => goToPage(4)} />,
    <FinalLetter onRestart={() => { 
      setShowIntro(true); 
      setTimeout(() => setShowIntro(false), 4500); 
      setCurrentPage(0); 
    }} />
  ];

  return (
    <div className="app">
      {/* 1. Cinematic Christmas Intro */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            className="aeroplane-intro-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.2, ease: "easeInOut" } }}
          >
            {/* SVG Filter for Fluffy Clouds (The "Gooey" Effect) */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <filter id="cloud-goo">
                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
              </filter>
            </svg>

            {/* Organic Clouds */}
            <div className="clouds-container">
              {[1, 2, 3].map((num) => (
                <div key={num} className={`cloud-group cloud-${num}`}>
                  <div className="cloud-blob circle-main" />
                  <div className="cloud-blob circle-left" />
                  <div className="cloud-blob circle-right" />
                </div>
              ))}
            </div>

            {/* Falling Snow */}
            <div className="snow-container">
               {[...Array(30)].map((_, i) => <div key={i} className="snowflake" />)}
            </div>

            {/* Centered Content: Aeroplane -> Text -> Typing */}
            <div className="intro-main-content">
              <img 
                src={AeroplanePng}
                alt="aeroplane" 
                className="aeroplane-img"
              />

              <motion.div 
                className="christmas-text-below"
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.8, type: "spring" }}
              >
                {textConfig.app.introText}
              </motion.div>

              <div className="typing-wrapper">
                <span className="typing-animation">Loading your winter gift...</span>
              </div>
            </div>

            {/* Snowy Ground at the bottom */}
            <div className="snowy-floor" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Application Pages */}
      {!showIntro && (
        <>
          <div
            className="fixed inset-0"
            style={{ zIndex: 0, background: 'var(--app-bg)' }}
          />
          <CherryBlossoms />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.4, ease: [0.4, 0.0, 0.2, 1] }}
              className="page-container"
            >
              {pages[currentPage]}
            </motion.div>
          </AnimatePresence>
        </>
      )}

      <style>{`
        /* Intro Overlay - Blue Hour Aesthetic */
        .aeroplane-intro-overlay {
          position: fixed;
          inset: 0;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 70%, #334155 100%);
          overflow: hidden;
        }

        .intro-main-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 100;
          margin-top: -60px;
        }

        /* --- CLOUD STYLING (Fluffy/Organic) --- */
        .cloud-group {
          position: absolute;
          filter: url('#cloud-goo'); /* Merges the circles into one fluffy mass */
          opacity: 0.4;
        }
        .cloud-blob {
          background: white;
          border-radius: 50%;
          position: absolute;
        }
        .circle-main { width: 120px; height: 120px; top: 0; left: 0; }
        .circle-left { width: 90px; height: 90px; top: 20px; left: -40px; }
        .circle-right { width: 80px; height: 80px; top: 30px; left: 70px; }

        .cloud-1 { top: 15%; left: 10%; transform: scale(0.8); animation: drift 20s infinite alternate; }
        .cloud-2 { top: 25%; right: 15%; transform: scale(1.2); animation: drift 25s infinite alternate-reverse; }
        .cloud-3 { top: 10%; right: 40%; opacity: 0.2; transform: scale(0.6); }

        /* --- TEXT STYLING --- */
        .christmas-text-below {
          font-family: 'Mountains of Christmas', cursive, sans-serif;
          font-size: 3.8rem;
          color: #ffffff;
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.5), 2px 4px 10px rgba(0,0,0,0.4);
          margin-top: 25px;
          text-align: center;
        }

        .typing-wrapper {
          margin-top: 15px;
          font-family: 'Fredoka', sans-serif;
          font-size: 18px;
          color: #cbd5e1;
        }

        .typing-animation {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid #ef4444;
          animation: typing 2.5s steps(30, end) forwards, blink 0.8s step-end infinite;
          width: 0;
        }

        /* --- AEROPLANE & GROUND --- */
        .aeroplane-img {
          width: 220px;
          z-index: 110;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4));
          animation: flyAcross 4.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .snowy-floor {
          position: absolute;
          bottom: -100px;
          width: 140%;
          height: 250px;
          background: radial-gradient(circle, #ffffff 0%, #e2e8f0 100%);
          border-radius: 50% 50% 0 0;
          z-index: 50;
          filter: blur(2px);
        }

        /* --- ANIMATIONS --- */
        @keyframes flyAcross {
          0% { transform: translateX(-120vw) translateY(30px) rotate(-5deg); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translateX(0vw) translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateX(120vw) translateY(-30px) rotate(5deg); opacity: 0; }
        }

        @keyframes drift {
          from { transform: translateX(-30px); }
          to { transform: translateX(30px); }
        }

        @keyframes typing { from { width: 0; } to { width: 100%; } }
        @keyframes blink { 50% { border-color: transparent; } }

        /* --- SNOW --- */
        .snowflake {
          position: absolute;
          top: -10px;
          width: 6px;
          height: 6px;
          background: white;
          border-radius: 50%;
          opacity: 0.7;
          animation: fall linear infinite;
        }
        @keyframes fall { to { transform: translateY(105vh); } }

        ${[...Array(30)].map((_, i) => `
          .snowflake:nth-child(${i+1}) {
            left: ${Math.random() * 100}vw;
            animation-duration: ${Math.random() * 3 + 2}s;
            animation-delay: ${Math.random() * 2}s;
          }
        `).join('')}

        /* Responsive Adjustments */
        @media (max-width: 640px) {
          .christmas-text-below { font-size: 2.5rem; }
          .aeroplane-img { width: 170px; }
          .typing-wrapper { font-size: 14px; }
        }
      `}</style>
    </div>
  );
}

export default App;