import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'app-bg': '#11172b',
        'app-card': '#222b45',
        'app-card-hover': '#29334f',
        'app-primary': '#6573ff',
        'app-primary-light': '#7582ff',
        'app-secondary': '#6fcdb5',
        'app-text': '#f1f3f8',
        'app-text-secondary': '#c4cada',
        'app-text-muted': '#929db6',
        'app-border': '#303a55',
        'app-success': '#6fcdb5',
        'app-warning': '#e5b45e',
        'app-danger': '#e57979',
        'app-info': '#7280ff',
      },
    },
  },
  plugins: [],
} satisfies Config;
