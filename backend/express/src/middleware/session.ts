import session from 'express-session';
import { createClient } from 'redis';
import { REDIS_URI } from '../config/consts';
import { RedisStore } from "connect-redis"
import { Types } from 'mongoose';

declare module 'express-session' {
  interface SessionData {
    userId: Types.ObjectId;
    name: string;
    authenticated: boolean;
  }
}

export const setupSession = () => {
  const redisClient = createClient({ url: REDIS_URI });
  redisClient.on('connect', () => console.log('Red Success'));
  redisClient.connect().catch(err => {
    console.error('Redis Connection Error:', err);
    process.exit(1);
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'app:'
  });

  return session({
    store: redisStore,
    secret: process.env.EXPRESS_SECRET || 'hippidy hop the fox on a wall',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.EXPRESS_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
  });
};
