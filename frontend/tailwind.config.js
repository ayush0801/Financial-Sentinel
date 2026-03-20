/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sentinel: {
          green: "#16A34A",
          amber: "#D97706",
          red: "#DC2626",
          dark: "#1A2E1A",
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      }
    }
  },
  plugins: []
}
