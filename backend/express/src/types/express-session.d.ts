import 'express-session';

declare module 'express-session' {
  interface SessionData {
    _id?: string;
    name?: string;
    userId?: string;
  }
}