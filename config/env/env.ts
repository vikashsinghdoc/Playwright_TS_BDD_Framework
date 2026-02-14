import dotenv from 'dotenv';

const env = process.env.TEST_ENV || 'dev';

dotenv.config({
  path: `config/env/.env.${env}`
});

export const ENV = {
  BASE_URL: process.env.BASE_URL!,
  DB_URL: process.env.DB_URL!
};