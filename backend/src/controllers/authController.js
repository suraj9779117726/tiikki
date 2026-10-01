import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (userId) =>
  jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const toUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptSaltRounds);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({
    success: true,
    data: {
      user: toUser(user),
      token: signToken(user._id),
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new AppError('Invalid email or password', 401);
  }

  res.json({
    success: true,
    data: {
      user: toUser(user),
      token: signToken(user._id),
    },
  });
});

export const me = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: { user: toUser(req.user) },
  });
});
