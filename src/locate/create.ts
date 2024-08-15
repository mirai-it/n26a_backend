import { drizzle } from "drizzle-orm/d1";
import * as s from "superstruct";
import { Context } from "hono";
import { locate } from "../db/schema";
import { LocateNameSchema } from "./schema";

const createLocate = async (c: Context) => {
  try {
    const { name } = await c.req.json();
    s.assert(name, LocateNameSchema);

    const db = drizzle(c.env.DB);

    const result = await db
      .insert(locate)
      .values({ name })
      .returning({
        id: locate.id,
        name: locate.name,
      })
      .onConflictDoNothing();

    if (result.length === 0) {
      return c.json(
        {
          error: "Locate name already exists",
          name,
        },
        409
      );
    }

    return c.json(
      {
        message: "Locate name created successfully",
        timestamp: new Date().toISOString(),
        data: result[0],
      },
      201
    );
  } catch (error) {
    if (error instanceof s.StructError) {
      return c.json(
        {
          error: "Invalid locate name",
          details: error.message,
        },
        400
      );
    }

    console.error("Create locate error:", error);
    return c.json(
      {
        error: "An error occurred while creating the locate",
      },
      500
    );
  }
};

export default createLocate;
