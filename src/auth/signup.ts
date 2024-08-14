import { sign } from "hono/jwt";
import { Context } from "hono";
import { is } from "superstruct";
import { PasswordSchema } from "./schema";
import { v6 as uuidv6 } from "uuid";
import { drizzle } from "drizzle-orm/d1";

import { admin } from "../db/schema";

const signUpHandler = async (c: Context) => {
  const { password } = await c.req.json();
  if (is(password, PasswordSchema)) {
    const id = uuidv6();
    const db = drizzle(c.env.DB);
    const result = await db
      .insert(admin)
      .values({
        id: id,
        passwordHash: password,
        passwordSalt: password,
      })
      .returning({ id: admin.id })
      .catch(() => null);

    if (result === null) {
      return c.json({ msg: "Account register faild." }, 500);
    } else {
      return c.json({
        msg: "Success register",
        id: result[0].id,
      });
    }
  } else {
    return c.json(
      {
        msg: "Password policy err.",
      },
      400
    );
  }
};

export default signUpHandler;
