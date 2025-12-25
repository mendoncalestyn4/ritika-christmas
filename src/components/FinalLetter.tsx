import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import textConfig from "../textConfig";

interface FinalLetterProps {
  onRestart: () => void;
}

export default function FinalLetter({ onRestart }: FinalLetterProps) {
  const [showSealing, setShowSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [typedText, setTypedText] = useState("");
  const typingTimerRef = useRef<number | null>(null);

  // Auto-trigger typing on sealing
  useEffect(() => {
    if (isSealed) {
      const str = textConfig.finalLetter.typedDefault;
      let i = 0;
      typingTimerRef.current = window.setInterval(() => {
        i += 1;
        setTypedText(str.slice(0, i));
        if (i >= str.length && typingTimerRef.current) {
          window.clearInterval(typingTimerRef.current);
        }
      }, 50);
    }
    return () => {
      if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
    };
  }, [isSealed]);

  const sealLetter = () => {
    setShowSealing(true);
    setTimeout(() => {
      setIsSealed(true);
      setShowSealing(false);
    }, 1600);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden bg-transparent">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12 z-10"
      >
        <span className="block text-[#FF4D94] font-hand text-2xl rotate-[-2deg] mb-2 drop-shadow-sm">
          the grand finale...
        </span>
        <h1 className="text-4xl md:text-6xl font-display text-gray-800 tracking-tight leading-tight px-2">
          {textConfig.finalLetter.title}
        </h1>
      </motion.div>

      <div className="w-full max-w-3xl z-10">
        <AnimatePresence mode="wait">
          {!isSealed ? (
            /* READING STATE */
            <motion.div
              key="reading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="bg-[#FFFDF2] rounded-[2.5rem] p-6 md:p-12 shadow-2xl border-4 border-white relative overflow-hidden"
            >
              {/* Subtle Paper Lines */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px)', backgroundSize: '100% 2.5rem' }} />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#FF4D94] flex items-center justify-center text-white shadow-lg">
                    <span className="material-icons-round">edit_note</span>
                  </div>
                  <h3 className="text-2xl font-display text-gray-800">Final Thoughts</h3>
                </div>

                <div className="handwriting text-xl md:text-2xl leading-relaxed md:leading-loose text-gray-700 space-y-6">
                  <p className="text-[#FF4D94] font-bold text-3xl mb-4 italic">{textConfig.finalLetter.letterGreeting}</p>
                  
                  {textConfig.finalLetter.letterParagraphs.map((para: string, idx: number) => (
                    <p key={idx} className={idx % 2 === 0 ? "font-medium" : "opacity-90"}>
                      {para}
                    </p>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-6 items-center pt-8 border-t border-pink-100/50">
                  <p className="text-sm text-gray-400 italic font-medium">{textConfig.finalLetter.sealingNote}</p>
                  <div className="flex gap-4 w-full sm:w-auto">
                    <button
                      onClick={sealLetter}
                      className="flex-1 sm:flex-none px-8 py-4 bg-[#FF4D94] text-white font-bold rounded-full shadow-lg hover:bg-[#e63d83] hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      {textConfig.finalLetter.sealButton}
                    </button>
                    <button
                      onClick={onRestart}
                      className="px-6 py-4 border-2 border-[#C1E1C1] text-[#7FB07F] font-bold rounded-full hover:bg-[#C1E1C1]/10 transition-all text-sm"
                    >
                      Restart
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            /* SEALED STATE */
            <motion.div
              key="sealed"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white/80 backdrop-blur-md rounded-[3rem] p-10 md:p-16 shadow-2xl border-8 border-white flex flex-col items-center"
            >
              <div className="relative mb-8">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FFB7D5] to-[#FFFDF2] flex items-center justify-center shadow-xl animate-bounce-slow">
                  <span className="text-6xl">{textConfig.finalLetter.sealedEmoji}</span>
                </div>
                {/* Removed blinking sparkle here */}
              </div>

              <h2 className="text-3xl md:text-5xl font-display text-gray-800 mb-4 tracking-tight">
                {textConfig.finalLetter.sealedTitle}
              </h2>
              <p className="text-lg md:text-xl text-gray-500 font-medium mb-10 max-w-md italic">
                {textConfig.finalLetter.sealedSubtitle}
              </p>

              <div className="w-full bg-[#FFFDF2] rounded-3xl p-8 mb-10 shadow-inner border border-pink-50">
                <div className="text-3xl md:text-5xl font-hand text-[#FF4D94] font-bold mb-4 min-h-[60px]">
                  {typedText}
                  <span className="animate-pulse">|</span>
                </div>
                <div className="text-sm md:text-base text-gray-400 font-bold uppercase tracking-widest">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </div>
              </div>

              <button
                onClick={onRestart}
                className="px-12 py-4 bg-[#FF4D94] text-white font-bold rounded-full shadow-lg hover:scale-105 transition-all flex items-center gap-3"
              >
                {textConfig.finalLetter.experienceAgain} <span className="material-icons-round">refresh</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sealing Animation Overlay */}
      {showSealing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF5F9]/90 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="text-9xl drop-shadow-2xl">{textConfig.finalLetter.sealedOverlayEmoji}</div>
            <div className="bg-white px-8 py-3 rounded-full shadow-lg text-[#FF4D94] font-bold tracking-widest animate-pulse">
              {textConfig.finalLetter.sealingText}
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .handwriting { font-family: 'Caveat', cursive; }
        
        .animate-bounce-slow { animation: bounce 3s ease-in-out infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
      `}</style>
    </div>
  );
}