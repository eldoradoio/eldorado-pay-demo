const { colors: defaultColors } = require('tailwindcss/defaultTheme')

const colors = {
  ...defaultColors,
  ...{
    "eldo": {
      '100': '#ffd97f',
      '500': '#ffb300',
      '600': '#ffba19'

    },
  },
}

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    "colors": colors,
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
