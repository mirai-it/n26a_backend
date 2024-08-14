import { MiddlewareHandler } from "hono";
import { jwt } from "hono/jwt";

const authMiddleware: MiddlewareHandler = async (c, next) => {
  if (c.req.method !== "GET") {
    // 認証ロジックをここに実装
    return await jwt({ secret: c.env.AUTH_SECRET })(c, next);
  }
  await next();
};

export default authMiddleware;
