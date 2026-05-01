require('dotenv').config({ quiet: true });

const required = ['DB_HOST', 'DB_USER', 'DB_NAME', 'SESSION_SECRET'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const config = {
  appName: 'SkillMatch',
  env: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  port: Number(process.env.PORT || 3000),
  database: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME
  },
  sessionSecret: process.env.SESSION_SECRET
};

module.exports = config;
