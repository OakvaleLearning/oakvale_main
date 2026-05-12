/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: '#0A3D2B',
        'forest-mid': '#145C3F',
        gold: '#C8881A',
        'gold-light': '#E8A832',
        cream: '#F7F3EC',
        'cream-warm': '#EDE7DB',
        stone: '#D4CFCA',
        mint: '#A8D5B5',
        'mint-light': '#D6EDE0',
        slate: '#4A5568',
        charcoal: '#1C1C1C',
        'mid-grey': '#5A5A5A',
        'light-grey': '#E8E4DE',
        sage: '#4EA97A',
      },
      fontFamily: {
        mark: "'Cormorant Garamond', serif",
        serif: "'Cormorant Garamond', serif",
        body: "'EB Garamond', serif",
        lora: "'EB Garamond', serif"
      },
      fontSize: {
        'xs-responsive': 'clamp(0.65rem, 1.5vw, 0.75rem)',
        'sm-responsive': 'clamp(0.75rem, 2vw, 0.88rem)',
        'base-responsive': 'clamp(0.85rem, 2.5vw, 1rem)',
        'md-responsive': 'clamp(0.95rem, 2.8vw, 1.2rem)',
        'lg-responsive': 'clamp(1.1rem, 3vw, 1.4rem)',
        'xl-responsive': 'clamp(1.25rem, 3.5vw, 1.5rem)',
        '2xl-responsive': 'clamp(1.5rem, 4vw, 2rem)',
        '3xl-responsive': 'clamp(1.8rem, 4.5vw, 2.5rem)',
        '4xl-responsive': 'clamp(2rem, 5vw, 3rem)',
        '5xl-responsive': 'clamp(2.5rem, 6vw, 3.5rem)',
        '6xl-responsive': 'clamp(2.8rem, 7vw, 4.2rem)',
      },
    }
  },
  plugins: [],
}