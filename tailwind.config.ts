import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1B5E38',
          hover: '#164d2e',
          light: '#E8F5EE',
          50: '#f0faf4',
          100: '#dcf2e6',
          200: '#bbe5cd',
          300: '#8dd1ab',
          400: '#57b57f',
          500: '#349960',
          600: '#257a4a',
          700: '#1B5E38',
          800: '#174d2f',
          900: '#143f27',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
