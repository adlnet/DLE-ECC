module.exports = {
  plugins: [require('@tailwindcss/line-clamp')],
  purge: ['./src/**/*.{js,jsx,mdx,html}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'black-70': 'rgba(17, 24, 39, .7)',
        'black-10': 'rgba(17, 24, 39, .1)',
      },
      boxShadow: {
        'inner-sm': 'inset 1px 1px 3px rgba(17, 24, 39, 0.2)',
      },
    },
  },
  variants: {
    extend: {},
  },
};
