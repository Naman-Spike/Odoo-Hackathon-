export const config = {
  PORT: Number(process.env.PORT) || 5000,
  JWT_SECRET: process.env.JWT_SECRET || 'dayflow-secret-key-change-in-production',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN || '7d') as string,
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
};
