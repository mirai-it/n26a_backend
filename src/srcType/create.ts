import { drizzle } from "drizzle-orm/d1";
import { srcType } from "../db/schema";
import { Context } from "hono";
import * as s from "superstruct";

const srcTypeName = s.trimmed(s.size(s.nonempty(s.string()), 1, 100));

const createSrcType = async (c: Context) => {
  try {
    const { name } = await c.req.json();
    s.assert(name, srcTypeName);

    const db = drizzle(c.env.DB);

    const result = await db
      .insert(srcType)
      .values({ name })
      .onConflictDoNothing()
      .returning({
        id: srcType.id,
        name: srcType.name,
      });

    if (result.length === 0) {
      return c.json(
        {
          error: "Conflict Source Type name",
          name,
        },
        409
      );
    }

    return c.json(
      {
        message: "Source type created successfully",
        timestamp: new Date().toISOString(),
        ...result[0],
      },
      201
    );
  } catch (error) {
    console.error("Error occurred while creating source type:", error);

    if (error instanceof s.StructError) {
      return c.json(
        {
          error: "Input Validation Error",
          message:
            "The source type name must be a non-empty string between 1 and 100 characters.",
          details: error.failures().map((failure) => ({
            path: failure.path.join("."),
            message: failure.message,
          })),
        },
        400
      );
    }

    return c.json(
      {
        error: "Server Error",
        message: "An unexpected error occurred while creating the source type.",
      },
      500
    );
  }
};

export default createSrcType;
