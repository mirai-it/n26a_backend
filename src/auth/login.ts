import { Context } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { admin } from "../db/schema";
import { eq } from "drizzle-orm";
import createToken from "./createToken";
import bcrypt from "bcryptjs";

const loginHandler = async (c: Context) => {
  try {
    const { id, password } = await c.req.json();

    if (!id || !password) {
      return c.json({ error: "ID and password are required" }, 400);
    }

    const db = drizzle(c.env.DB);
    const user = await db.select().from(admin).where(eq(admin.id, id)).limit(1);

    if (user.length === 0) {
      return c.json({ error: "Invalid ID or password" }, 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user[0].passwordHash
    );

    if (!isPasswordValid) {
      return c.json({ error: "Invalid ID or password" }, 401);
    }

    const token = await createToken(id, c.env.AUTH_SECRET);

    return c.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json(
      { error: "An error occurred during login. Please try again later." },
      500
    );
  }
};

export default loginHandler;
