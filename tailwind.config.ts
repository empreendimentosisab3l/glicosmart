import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem', // rounded-2xl by default for many things
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      colors: {
        primary: '#10b981', // Emerald 500
        'primary-dark': '#059669', // Emerald 600
        'primary-light': '#d1fae5', // Emerald 100
        background: '#f8fafc', // Slate 50
        surface: '#ffffff',
        accent: '#fb923c', // Orange 400
        text: '#334155', // Slate 700
        'text-light': '#64748b', // Slate 500
        gi: {
          low: '#10b981', // Emerald 500
          medium: '#eab308', // Yellow 500
          high: '#ef4444', // Red 500
        },
      },
    },
  },
  plugins: [],
}

export default config
