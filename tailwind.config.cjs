const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  safelist: [
    {pattern: /translate-x/}
  ],
  theme: {
    extend: {
      colors: {
        'xp-yellow': '#ece9d8',
        'xp-yellow-light': '#e9e8e1',
      },
      keyframes: {
        'slide': {
          '0%': {transform: 'translateX(-100%)'},
          '100%': {transform: 'translateX(0)'}
        },
        'up': {
          '0%': {transform: 'translateY(10rem)'},
          '100%': {transform: 'translateY(0)'}
        },
        'blink': {
          '50%': {opacity: '0.5'},
        },
        'fadein': {
          '0%': {opacity: 0},
          '100%': {opacity: 1}
        }
      },
      animation: {
        'slide': 'slide 1s ease-out',
        'up': 'up 0.5s ease-out',
        'blink': 'blink 0.2s 2 linear',
        'cursor': 'blink 0.8s linear infinite',
        'fadein': 'fadein 5s'
      },
      fontFamily: {
        'sans': 'Arial, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        'MSSS': ['MSSS', 'monospace'],
        'Levi': ['Levi', 'monospace'],
        'Trebuchet':['Trebuchet', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("tailwindcss-scoped-groups")({
      groups: ["item", "sub", "sub1", "sub2", "sub3"],
    }),
  ],
};

module.exports = config;
