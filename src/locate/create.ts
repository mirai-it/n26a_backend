import { drizzle } from "drizzle-orm/d1";
import * as s from "superstruct";
import { Context } from "hono";
import { locate } from "../db/schema";
import { LocateNameSchema } from "./schema";

const createLocate = async (c: Context) => {
  const { name } = await c.req.json();
  try {
    s.assert(name, LocateNameSchema);
  } catch (error) {
    return c.json(
      {
        msg: "error",
      },
      400
    );
  }
  const db = drizzle(c.env.DB);

  const result = await db
    .insert(locate)
    .values({
      name: name,
    })
    .returning({
      id: locate.id,
      name: locate.name,
    })
    .onConflictDoNothing();
  if (result.length === 0) {
    return c.json(
      {
        msg: "Locate name already exists",
        name: name,
      },
      409
    );
  }

  return c.json({
    msg: "Locate name created successfully",
    time: new Date().toISOString(),
    ...result,
  });
};

export default createLocate;
