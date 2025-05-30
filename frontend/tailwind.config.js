export default {
  darkMode: "class", // MUST be 'class' to toggle manually
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure Tailwind scans your files
  ],

  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
