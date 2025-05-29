import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
        // ...
theme: {
  extend: {
    
    keyframes: {
      'fade-in-down': {
        '0%': {
          opacity: '0',
          transform: 'translateY(-20px)',
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
      'fade-in-up': {
        '0%': {
          opacity: '0',
          transform: 'translateY(20px)',
        },
        '100%': {
          opacity: '1',
          transform: 'translateY(0)',
        },
      },
      'bounce-in': {
        '0%, 20%, 40%, 60%, 80%, 100%': {
          transform: 'translateY(0)',
        },
        '50%': {
          transform: 'translateY(-10px)',
        },
      },
    },
    animation: {
      'fade-in-down': 'fade-in-down 1s ease-out forwards',
      'fade-in-up': 'fade-in-up 1s ease-out forwards 0.5s', // Atraso para aparecer depois do título
      'bounce-in': 'bounce-in 0.8s ease-out', // Pode ser usado com Intersection Observer
    },
  },
},
// ...
      colors: {
        'judo-blue': '#1A237E', // Azul escuro para o judô
        'judo-orange': '#E44D26', // Laranja vibrante para destaque
        'judo-light-gray': '#F8F8F8',
        'judo-dark-gray': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Use uma fonte como Inter
      },
      backgroundImage: {
        'hero-pattern': "url('/images/judo-hero.jpg')", // Certifique-se de ter esta imagem em public/images
      },
    },
  },
  plugins: [],
};
export default config;