import session from 'express-session';
import { createClient } from 'redis';
import { REDIS_URI } from '../config/consts';
import { RedisStore } from "connect-redis"

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    authenticated?: boolean;
  }
}

export const setupSession = () => {
  const redisClient = createClient({ url: REDIS_URI });
  redisClient.on('error', (err) => {
    console.error('Redis Err:', err);
    process.exit(1);
  });
  redisClient.on('connect', () => console.log('Red Success'));

  redisClient.connect()

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
