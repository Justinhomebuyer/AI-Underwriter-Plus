import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#fe5994',
        accent: '#2297b0',
        dark: '#0b1018',
        'brand-foreground': '#0b1018',
        'accent-foreground': '#f7fbfd'
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 10px 35px rgba(0, 0, 0, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
