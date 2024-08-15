import { Context } from "hono";
import { is } from "superstruct";
import { PasswordSchema } from "./schema";
import { v6 as uuidv6 } from "uuid";
import { drizzle } from "drizzle-orm/d1";
import { admin } from "../db/schema";
import bcrypt from "bcryptjs";

const signUpHandler = async (c: Context) => {
  try {
    const { password } = await c.req.json();

    if (!is(password, PasswordSchema)) {
      return c.json(
        {
          error:
            "Invalid password format. Please ensure it meets the required criteria.",
        },
        400
      );
    }

    const id = uuidv6();
    const salt = await bcrypt.genSalt(7);
    const passwordHash = await bcrypt.hash(password, salt);

    const db = drizzle(c.env.DB);
    const result = await db
      .insert(admin)
      .values({
        id,
        passwordHash,
        passwordSalt: salt,
      })
      .returning({ id: admin.id });

    return c.json(
      {
        message: "Account successfully registered",
        id: result[0].id,
      },
      201
    );
  } catch (error) {
    console.error("Account registration error:", error);
    return c.json(
      {
        error: "Failed to register account. Please try again later.",
      },
      500
    );
  }
};

export default signUpHandler;
