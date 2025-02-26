/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './.next/**/*.{js,ts,jsx,tsx,mdx}', 
    '/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

