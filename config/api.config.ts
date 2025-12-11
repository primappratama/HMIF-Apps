// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      VERIFY: '/auth/verify',
    },
    USERS: {
      PROFILE: '/users/profile',
      UPDATE: '/users/update',
    },
    ACTIVITIES: {
      LIST: '/activities',
      DETAIL: '/activities/:id',
    },
    FINANCE: {
      LIST: '/finance',
      SUMMARY: '/finance/summary',
    },
    HISTORY: {
      LEADERS: '/history/leaders',
      LDK: '/history/ldk',
    },
  },
};