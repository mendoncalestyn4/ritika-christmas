/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#D95D39", // Rust Orange from reference
        "primary-hover": "#B84A2A",
        "background-light": "#FDF6E3", // Cream/Canvas
        "background-dark": "#2C241B", // Dark Espresso
        "retro-green": "#8DA399", // Sage
        "retro-yellow": "#F4D35E", // Mustard
        "retro-pink": "#EE964B", // Muted Peach
        "note-yellow": "#FFF9C4",
        "note-blue": "#E1F5FE",
        "note-pink": "#F8BBD0",
        "note-green": "#DCEDC8",
      },
      fontFamily: {
        display: ["'Shrikhand'", "serif"], // Bold Retro
        body: ["'Nunito'", "sans-serif"], // Soft Rounded
        hand: ["'Caveat'", "cursive"], // Handwriting
      },
      backgroundImage: {
        'noise': "url('https://www.transparenttextures.com/patterns/stardust.png')", 
      },
      boxShadow: {
        'retro': '4px 4px 0px 0px rgba(0,0,0,0.15)',
        'retro-hover': '2px 2px 0px 0px rgba(0,0,0,0.15)',
        'retro-bold': '6px 6px 0px 0px #D95D39',
      },
      animation: {
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
