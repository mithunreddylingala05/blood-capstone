/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#e11d48', dark: '#be123c', light: '#ffe4e6' },
        accent: '#f43f5e',
        success: { DEFAULT: '#10b981', light: '#d1fae5' },
        info: { DEFAULT: '#3b82f6', light: '#dbeafe' },
        warn: { DEFAULT: '#f59e0b', light: '#fef3c7' },
        dark: { DEFAULT: '#0f172a', lighter: '#1e293b', lightest: '#334155' },
        glass: 'rgba(255, 255, 255, 0.75)'
      },
      fontFamily: { sans: ["'Plus Jakarta Sans'", "sans-serif"] },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.05)',
        'soft': '0 10px 40px -10px rgba(0,0,0,0.08)',
        'primary': '0 10px 25px -5px rgba(225, 29, 72, 0.4)'
      },
    },
  },
  plugins: [],
}
