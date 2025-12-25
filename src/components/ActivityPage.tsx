import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import textConfig from "../textConfig";
import LetterImg from "../imgs/letter.png";

interface ActivityPageProps {
  onNext?: () => void;
}

export default function ActivityPage({ onNext }: ActivityPageProps) {
  const [phase, setPhase] = useState<'game' | 'envelope' | 'letter'>('game');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [showContinue, setShowContinue] = useState(false);
  const [confetti, setConfetti] = useState<{ id: number; x: number; y: number; char: string }[]>([]);

  // Pre-filled board with candies, middle (index 4) is the cookie target
  const initialBoard = textConfig.activity.initialBoard;
  
  const greeting = textConfig.letter.letterGreeting;
  const bodyContent = textConfig.letter.letterMessage;
  const signature = textConfig.letter.letterSignature;

  // Split letter body into paragraphs and avoid duplicating the greeting
  const paragraphs = bodyContent
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (paragraphs.length > 0 && paragraphs[0] === greeting) paragraphs.shift();

  const triggerConfetti = () => {
    const newConfetti = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      char: textConfig.activity.confettiChars[Math.floor(Math.random() * textConfig.activity.confettiChars.length)]
    }));
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 2000);
  };

  const handleMiddleClick = () => {
    triggerConfetti();
    setTimeout(() => setPhase('envelope'), 800);
  };

  const handleEnvelopeClick = () => {
    if (!isEnvelopeOpen) {
      setIsEnvelopeOpen(true);
      setTimeout(() => {
        setPhase('letter');
        setTimeout(() => startTypingSignature(), 600);
      }, 800);
    }
  };

  const startTypingSignature = () => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedSignature(signature.slice(0, i));
      i++;
      if (i > signature.length) {
        clearInterval(interval);
        setTimeout(() => setShowContinue(true), 500);
      }
    }, 50);
  };

  return (
    <div className="w-full min-h-[100dvh] flex flex-col items-center justify-center p-4 md:p-6 bg-transparent overflow-hidden font-sans">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 shrink-0 z-10"
      >
        <span className="block text-[#FF4D94] font-hand text-xl md:text-2xl mb-1 italic">
          {phase === 'game' ? textConfig.activity.headerSmall : textConfig.letter.headerSubtitle}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight px-4">
          {phase === 'game' ? textConfig.activity.headerTitle : textConfig.letter.headerTitle}
        </h1>
      </motion.div>

      <div className="w-full max-w-2xl flex flex-col items-center justify-center relative perspective-1000">
        
        {/* Confetti Particles */}
        <div className="absolute inset-0 pointer-events-none z-50">
          {confetti.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.5, rotate: 360 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 text-2xl"
            >
              {p.char}
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          
          {/* PHASE 1: GAME */}
          {phase === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex flex-col items-center"
            >
              <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-[2.5rem] shadow-2xl border-4 border-white">
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {initialBoard.map((item, index) => (
                    <div key={index} className="w-20 h-20 md:w-28 md:h-28 relative">
                      {index === 4 ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleMiddleClick}
                          className="w-full h-full bg-[#FFF5F9] border-4 border-[#FFB7D5] border-dashed rounded-3xl flex items-center justify-center text-4xl animate-pulse cursor-pointer group"
                        >
                          <span className="opacity-40 group-hover:opacity-100 transition-all">{textConfig.activity.cookieEmoji}</span>
                        </motion.button>
                      ) : (
                        <div className="w-full h-full bg-[#FFFDF2] rounded-3xl flex items-center justify-center text-3xl md:text-4xl shadow-sm border-2 border-pink-50/50">
                          {item}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-8 text-[#FF4D94] font-bold tracking-widest uppercase text-xs bg-white/60 px-6 py-2 rounded-full">
                {textConfig.activity.placeInstruction}
              </p>
            </motion.div>
          )}

          {/* PHASE 2: CLEAN ENVELOPE */}
          {phase === 'envelope' && (
            <motion.div 
              key="envelope"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="relative w-full flex flex-col items-center cursor-pointer"
              onClick={handleEnvelopeClick}
            >
              <div className="relative w-72 h-48 md:w-[480px] md:h-72 transition-all duration-500 hover:scale-[1.02]">
                {/* Envelope Base */}
                <div className="absolute inset-0 bg-[#FFD1E3] rounded-3xl border-[6px] border-white shadow-2xl overflow-hidden z-10" />

                {/* Flap */}
                <div 
                  className={`absolute top-0 left-0 w-full h-1/2 bg-[#FFB7D5] transition-all duration-1000 origin-top z-20 ${isEnvelopeOpen ? 'rotate-x-180 opacity-0' : 'rotate-x-0'}`}
                  style={{ 
                    clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                    WebkitBackfaceVisibility: 'hidden',
                    borderBottom: '2px solid rgba(255,255,255,0.4)'
                  }} 
                />

                {/* Heart Seal */}
                {!isEnvelopeOpen && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-[#FF4D94] w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-xl border-[5px] border-white animate-bounce-slow">
                    <span className="text-white text-3xl md:text-5xl">{textConfig.activity.heartSeal}</span>
                  </div>
                )}
              </div>
              <p className="mt-10 text-gray-500 font-bold text-sm md:text-lg tracking-wide italic animate-pulse">
                {textConfig.letter.envelopeClickHint}
              </p>
            </motion.div>
          )}

          {/* PHASE 3: LETTER */}
          {phase === 'letter' && (
            <motion.div
              key="letter"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full bg-[#FFFDF2] rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-12 shadow-2xl border-[8px] border-white flex flex-col max-h-[75vh]"
            >
              <motion.img 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1, rotate: 12 }}
                src={LetterImg}
                className="absolute top-4 right-4 md:top-8 md:right-8 w-24 md:w-40 drop-shadow-2xl z-20 pointer-events-none"
              />
              <div className="flex justify-start mb-6 shrink-0">
                 <div className="bg-[#FF4D94] px-4 md:px-6 py-2 rounded-full flex items-center gap-2 shadow-md">
                  <span className="text-white text-sm">{textConfig.finalLetter.sealedEmoji}</span>
                    <span className="text-white text-[10px] md:text-xs font-black tracking-widest uppercase">{textConfig.activity.badgeLabel}</span>
                </div>
              </div>
              <div className="handwriting overflow-y-auto pr-4 custom-scrollbar z-10 flex-grow">
                <h2 className="text-3xl md:text-4xl text-[#FF4D94] font-bold mb-6 italic">{greeting}</h2>
                <div className="text-xl md:text-3xl text-gray-700 leading-relaxed text-left space-y-4">
                  {paragraphs.map((para, i) => (
                    <p key={i} className={i === 0 ? "" : "opacity-95"}>
                      {para}
                    </p>
                  ))}
                </div>
                <div className="flex flex-col items-end mt-10 pt-6 border-t border-pink-100/50">
                  <p className="text-[#FF4D94] text-3xl md:text-5xl font-bold italic tracking-wide">
                    {typedSignature}
                    {typedSignature.length < signature.length && <span className="animate-pulse">|</span>}
                  </p>
                </div>
              </div>
              {showContinue && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 shrink-0">
                    <button onClick={() => onNext?.()} className="w-full py-4 bg-[#FF4D94] text-white text-lg font-bold rounded-full shadow-lg hover:scale-[1.02] transition-all">
                    {textConfig.activity.continueButton}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
        .handwriting { font-family: 'Caveat', cursive; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-x-180 { transform: rotateX(180deg); }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -55%) scale(1.05); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #FFB7D5 rgba(0,0,0,0.03); }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFB7D5; border-radius: 10px; }
      `}</style>
    </div>
  );
}