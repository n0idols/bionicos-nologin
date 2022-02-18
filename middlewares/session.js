import { withIronSession, ironSession } from "next-iron-session";

const sessionConfig = {
  password: process.env.NEXT_PUBLIC_COOKIE_PASSWORD,
  cookieName: "next-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production" ? true : false,
  },
};

export const sessionMiddleware = ironSession(sessionConfig);

export function withSession(handler) {
  return withIronSession(handler, sessionConfig);
}
