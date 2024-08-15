/* eslint-disable @typescript-eslint/no-unused-vars */
import { drizzle, DrizzleD1Database } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import * as s from "superstruct";
import { locate } from "../db/schema";
import { LocateNameSchema } from "./schema";

const updateLocate = async (c: Context) => {
  const { id } = c.req.param();
  const { name } = await c.req.json();
  const db = drizzle(c.env.DB);

  const numericId = validateId(id);
  if (!numericId) {
    return c.json({ msg: "Invalid ID format" }, 400);
  }

  if (!validateName(name)) {
    return c.json(
      {
        error:
          "Error: locate name length must be between 1 and 100 characters.",
      },
      400
    );
  }

  try {
    const result = await updateLocateInDb(db, numericId, name);
    if (!result) {
      return c.json({ msg: "Locate not found" }, 404);
    }

    return c.json({
      msg: "Locate name updated successfully",
      time: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error("Database error:", error);
    return c.json({ msg: "Internal server error" }, 500);
  }
};

const validateId = (id: string): number | null => {
  const numericId = parseInt(id);
  return Number.isInteger(numericId) ? numericId : null;
};

const validateName = (name: string): boolean => {
  try {
    s.assert(name, LocateNameSchema);
    return true;
  } catch (error) {
    return false;
  }
};

const updateLocateInDb = async (
  db: DrizzleD1Database,
  id: number,
  name: string
) => {
  const result = await db
    .update(locate)
    .set({ name })
    .where(eq(locate.id, id))
    .returning();

  return result.length > 0 ? result[0] : null;
};

export default updateLocate;
