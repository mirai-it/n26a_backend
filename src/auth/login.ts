import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { admin } from "../db/schema";
import { and, eq } from "drizzle-orm";
import createToken from "./createToken";

const loginHandler = async (c: Context) => {
  const { id, password } = await c.req.json();
  const db = drizzle(c.env.DB);
  const pass = await db
    .select()
    .from(admin)
    .where(and(eq(admin.id, id), eq(admin.passwordHash, password)));
  if (pass.length > 0) {
    const token = await createToken(id, c.env.AUTH_SECRET);
    return c.json({ token });
  } else {
    return c.json({ msg: "Invalid id or password" }, 400);
  }
};

export default loginHandler;
