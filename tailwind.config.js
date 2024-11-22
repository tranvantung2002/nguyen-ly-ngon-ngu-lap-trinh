/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  // mode: 'jit',
  content: ['./src/**/*.{js,ts,jsx,tsx}', './src/**/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      spacing: {
        '5.5': '22px',
        '4.5': '19px',
      },
      minWidth: {
        '1/3': '33.33%',
      },
      colors: {
        trueGray: colors.neutral,
        black: '#0F284D',
      },
      backgroundImage: {},
      boxShadow: {
        style1: '0px 2px 4px 0px rgba(0, 0, 0, 0.15)',
      },
      fontSize: {
        content: '1rem',
        content1: '1.15rem',
        'sub-content': '0.813rem',
        title: '1.625rem',
        'sub-title': '1.25rem',
        'big-title': '2.625rem',
      },
    },
    fontFamily: {
      sans: ['Be Vietnam Pro', ...defaultTheme.fontFamily.sans],
      stock: [defaultTheme.fontFamily.sans],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('autoprefixer')],
};
