import dotenv from 'dotenv';

dotenv.config();

const required = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins: process.env.CLIENT_ORIGIN.split(',').map((origin) =>
    origin.trim(),
  ),
  bcryptSaltRounds:
    Number.isInteger(saltRounds) && saltRounds > 0 ? saltRounds : 10,
};
