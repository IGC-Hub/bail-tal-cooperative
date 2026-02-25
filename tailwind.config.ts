import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'tal-blue': {
          DEFAULT: '#003D5C',
          dark: '#002840',
          light: '#0066A1',
          accent: '#005580',
        },
        'tal-yellow': {
          DEFAULT: '#FFF4D1',
          dark: '#FFE699',
        },
      },
    },
  },
  plugins: [],
};

export default config;
