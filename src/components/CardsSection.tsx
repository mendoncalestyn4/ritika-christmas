import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import textConfig from '../textConfig';
import pic1 from '../imgs/pic1.jpg';
import pic2 from '../imgs/pic2.jpg';
import pic3 from '../imgs/pic3.jpg';

interface CardsSectionProps {
  onNext: () => void;
}

const CardsSection: React.FC<CardsSectionProps> = ({ onNext }) => {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  const cardData = [
    { 
      front: textConfig.cards.card1Front, 
      backTitle: textConfig.cards.card1BackTitle, 
      backText: textConfig.cards.card1BackText, 
      img: pic1, 
      color: 'bg-[#FFD1E3]', // note-pink
      rotate: '-rotate-3',
      emoji: textConfig.cards.card1BackEmoji
    },
    { 
      front: textConfig.cards.card2Front, 
      backTitle: textConfig.cards.card2BackTitle, 
      backText: textConfig.cards.card2BackText, 
      img: pic2, 
      color: 'bg-[#FFF9C4]', // note-yellow
      rotate: 'rotate-2',
      emoji: '❤️'
    },
    { 
      front: textConfig.cards.card3Front, 
      backTitle: textConfig.cards.card3BackTitle, 
      backText: textConfig.cards.card3BackText, 
      img: pic3, 
      color: 'bg-[#E3F2FD]', // note-blue
      rotate: '-rotate-2',
      stamp: textConfig.cards.card3BackStamp
    },
  ];

  const flipCard = (index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex flex-col items-center justify-center py-12 px-4 overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-20 left-10 text-pink-200 text-6xl animate-float">✨</div>
        <div className="absolute bottom-40 right-10 text-blue-100 text-6xl animate-float-slow">☁️</div>
      </div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 z-10"
      >
        <span className="block text-[#FF4D94] font-hand text-2xl md:text-3xl rotate-[-2deg] mb-2">
          {textConfig.cards.subheading}
        </span>
        <h1 className="text-4xl md:text-7xl font-display text-gray-800 tracking-tight leading-tight">
          {textConfig.cards.heading}
        </h1>
        <p className="mt-4 text-gray-500 font-medium max-w-md mx-auto italic">
          {textConfig.cards.instruction}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-16 items-center justify-items-center">
        {cardData.map((card, index) => (
          <div 
            key={index}
            className={`perspective-1000 w-full max-w-[280px] h-[380px] cursor-pointer group ${card.rotate}`}
            onClick={() => flipCard(index)}
          >
            <motion.div 
              animate={{ rotateY: flippedCards.includes(index) ? 180 : 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-full h-full preserve-3d"
            >
              
              {/* FRONT SIDE (Paper Note) */}
              <div className={`absolute inset-0 backface-hidden rounded-2xl shadow-xl ${card.color} p-8 flex flex-col items-center justify-center border-4 border-white/50 overflow-hidden`}>
                {/* Washi Tape Effect */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 backdrop-blur-sm rotate-1 z-10 shadow-sm border-x-4 border-dashed border-black/5" />
                
                <h3 className="font-hand text-3xl md:text-4xl text-gray-800 leading-relaxed text-center">
                  {card.front}
                </h3>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
              </div>

              {/* BACK SIDE (Polaroid) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-2xl shadow-2xl p-4 flex flex-col items-center border-8 border-white">
                <div className="w-full h-[70%] rounded-lg overflow-hidden shadow-inner bg-gray-100 relative">
                   <img src={card.img} alt="Memory" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                </div>
                
                <div className="flex-grow flex flex-col items-center justify-center pt-4 text-center">
                  <p className="font-hand text-2xl text-gray-800 mb-1">{card.backTitle}</p>
                  <p className="text-gray-500 text-xs px-2 leading-tight">{card.backText}</p>
                  
                  {card.emoji && <span className="mt-2 text-2xl">{card.emoji}</span>}
                  {card.stamp && (
                    <div className="mt-2 border-2 border-[#FF4D94] text-[#FF4D94] px-2 py-1 rounded text-[10px] font-black uppercase rotate-[-12deg] tracking-tighter">
                      {card.stamp}
                    </div>
                  )}
                </div>
              </div>

            </motion.div>
          </div>
        ))}
      </div>

      {/* Footer / Continue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-20 z-20"
      >
        <button 
          onClick={onNext}
          className="group flex items-center gap-3 px-10 py-4 bg-[#FF4D94] text-white font-bold rounded-full shadow-[0_10px_20px_rgba(255,77,148,0.3)] hover:scale-105 hover:bg-[#e63d83] transition-all"
        >
          {textConfig.cards.continueButton}
          <span className="material-icons-round group-hover:translate-x-2 transition-transform">arrow_forward</span>
        </button>
      </motion.div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-float-slow { animation: float 7s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default CardsSection;