/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin')

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    } else {
      return `rgb(var(${variableName}))`
    }
  }
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        widget: 'var(--widget)',
        border: 'var(--border)',
        header: 'var(--header)',
        orange: '#ee4d2d',
        gray: 'var(--gray)',
        red: 'var(--red)',
        green: 'var(--green)',
        'green-darker': '#02A189',
        'green-100': 'var(--green-100)',
        'green-200': 'var(--green-200)',

        'input-border': 'var(--input-border)',
        'input-bg': 'var(--input-bg)',
        'social-btn': 'var(--social-btn-color)',
        body: 'var(--body)',
        accent: 'var(--accent)',

        light: withOpacity('--color-light'),
        dark: withOpacity('--color-dark'),
        // accent: withOpacity('--color-accent'),
        'accent-hover': withOpacity('--color-accent-hover'),
        'accent-300': withOpacity('--color-accent-300'),
        'accent-400': withOpacity('--color-accent-400'),
        'accent-500': withOpacity('--color-accent-500'),
        'accent-600': withOpacity('--color-accent-600'),
        'accent-700': withOpacity('--color-accent-700'),

        'gray-red': 'var(--text-dark)',
        'gray-50': withOpacity('--color-gray-50'),
        'gray-100': withOpacity('--color-gray-100'),
        'gray-200': withOpacity('--color-gray-200'),
        'gray-300': withOpacity('--color-gray-300'),
        'gray-400': withOpacity('--color-gray-400'),
        'gray-500': withOpacity('--color-gray-500'),
        'gray-600': withOpacity('--color-gray-600'),
        'gray-700': withOpacity('--color-gray-700'),
        'gray-800': withOpacity('--color-gray-800'),
        'gray-900': withOpacity('--color-gray-900'),

        social: {
          facebook: '#3b5998',
          'facebook-hover': '#35508a',
          twitter: '#1da1f2',
          instagram: '#e1306c',
          youtube: '#ff0000',
          google: '#DB4437',
          'google-hover': '#cc3e30'
        }
      },
      fontFamily: {
        body: 'var(--body-font)',
        heading: 'var(--heading-font)'
      },
      screens: {
        '2xs': '375px',
        xs: '414px',
        '3xl': '1366px',
        '4xl': '1920px',
        '5xl': '2048px'
      },
      textColor: {
        body: withOpacity('--text-base'),
        heading: withOpacity('--text-heading'),
        'muted-light': withOpacity('--text-muted-light')
      },
      boxShadow: {
        base: 'rgba(0, 0, 0, 0.16) 0px 4px 16px',
        default: 'var(--shadow)'
      },
      accentColor: {
        green: withOpacity('--color-accent')
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
      }
    }
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: '1280px',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
      addComponents({
        '.header-height': {
          height: '58px'
        }
      })
      addComponents({
        '.outline-none-override': {
          outline: 'none'
        }
      })
    }),
    require('@headlessui/tailwindcss')
  ]
}
