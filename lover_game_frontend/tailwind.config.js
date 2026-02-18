/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        romantic: {
          pink: '#FFB6C1',
          rose: '#FF69B4',
          gold: '#FFD700',
          champagne: '#F7E7CE',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        quicksand: ['Quicksand', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out infinite',
        'twinkle': 'twinkle 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'heartbreak-left': 'heartBreakLeft 1.5s ease-out forwards',
        'heartbreak-right': 'heartBreakRight 1.5s ease-out forwards',
        'tear-drop': 'tearDrop 2s ease-in infinite',
        'confetti-fall': 'confettiFall 3s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        heartBreakLeft: {
          '0%': { 
            transform: 'translate(0, 0) rotate(0deg)',
            opacity: 1 
          },
          '50%': { 
            transform: 'translate(-60px, 20px) rotate(-30deg)',
            opacity: 0.7 
          },
          '100%': { 
            transform: 'translate(-100px, 80px) rotate(-45deg)',
            opacity: 0 
          },
        },
        heartBreakRight: {
          '0%': { 
            transform: 'translate(0, 0) rotate(0deg)',
            opacity: 1 
          },
          '50%': { 
            transform: 'translate(60px, 20px) rotate(30deg)',
            opacity: 0.7 
          },
          '100%': { 
            transform: 'translate(100px, 80px) rotate(45deg)',
            opacity: 0 
          },
        },
        tearDrop: {
          '0%': { 
            transform: 'translateY(0)',
            opacity: 0 
          },
          '10%': { 
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(100px)',
            opacity: 0 
          },
        },
        confettiFall: {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(720deg)',
            opacity: 0 
          },
        },
      },
    },
  },
  plugins: [],
}
