import { Context, Next } from "hono";

export default async function jsonMiddleware(c: Context, next: Next) {
  if (["POST", "PUT", "PATCH"].includes(c.req.method)) {
    try {
      await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON in request body" }, 400);
    }
  }
  await next();
}
