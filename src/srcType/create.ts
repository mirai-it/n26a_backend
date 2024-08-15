import { drizzle } from "drizzle-orm/d1";
import { srcType } from "../db/schema";
import { Context } from "hono";
import * as s from "superstruct";

const srcTypeName = s.trimmed(s.size(s.nonempty(s.string()), 1, 100));

const createSrcType = async (c: Context) => {
  const { name } = await c.req.json();
  try {
    s.assert(name, srcTypeName);
  } catch (error) {
    console.error(error);
    return c.json(
      {
        msg: "error",
      },
      400
    );
  }
  const db = drizzle(c.env.DB);

  const result = await db
    .insert(srcType)
    .values({
      name: name,
    })
    .onConflictDoNothing()
    .returning({
      id: srcType.id,
      name: srcType.name,
    });

  if (result.length === 0) {
    return c.json(
      {
        msg: "Source type already exists",
        name: name,
      },
      409
    );
  }

  return c.json(
    {
      msg: "Source type created successfully",
      time: new Date().toISOString(),
      ...result,
    },
    201
  );
};

export default createSrcType;
