import { sign } from "hono/jwt";
import { Context } from "hono";
import { is } from "superstruct";
import { uuid } from "./schema";
import { drizzle } from "drizzle-orm/d1";
import { admin } from "../db/schema";
import { and, eq } from "drizzle-orm";

const loginHandler = async (c: Context) => {
  const { id, password } = await c.req.json();
  const db = drizzle(c.env.DB);
  const pass = await db
    .select()
    .from(admin)
    .where(and(eq(admin.id, id), eq(admin.passwordHash, password)));
  if (pass.length > 0) {
    const token = await sign(
      {
        sub: id,
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      c.env.AUTH_SECRET
    );
    return c.json({ token });
  } else {
    return c.json({ msg: "Invalid id or password" }, 400);
  }
};

export default loginHandler;
