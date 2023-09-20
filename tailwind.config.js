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
    extend: {},
    /*colors: {
      "primaria": "#6B21A8",
      "secundaria": "#3AA819",
      "terciaria": "#F5D649",
      "white": "#FFF",
      "gray-100": "#f3f4f6",
      "gray-200": "#e2e8f0"
    }*/
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

