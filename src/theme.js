import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e0f2f1',
      100: '#b2dfdb',
      200: '#80cbc4',
      300: '#4db6ac',
      400: '#26a69a',
      500: '#009688', // Teal principal
      600: '#00897b',
      700: '#00796b',
      800: '#00695c',
      900: '#004d40',
    },
    gray: {
      50: '#f7fafc',
      100: '#edf2f7',
      200: '#e2e8f0',
      300: '#cbd5e0',
      400: '#a0aec0',
      500: '#718096',
      600: '#4a5568',
      700: '#2d3748',
      800: '#1a202c',
      900: '#171923',
    },
  },
  fonts: {
    heading: `'Roboto', sans-serif`,
    body: `'Roboto', sans-serif`,
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '64px',
  },
  styles: {
    global: {
      'html, body': {
        color: 'gray.800',
        bg: 'gray.50',
        lineHeight: 'tall',
      },
      a: {
        color: 'brand.500',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
});

export default theme;
