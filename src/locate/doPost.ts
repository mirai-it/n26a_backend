import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import * as s from "superstruct";
import { locate } from "../db/schema";

const LocateName = s.trimmed(s.size(s.nonempty(s.string()), 1, 100));

const LocateNamePostHandler = async (c: Context) => {
  // Todo キャッシュコントロールを追加する
  const { name } = await c.req.json();
  try {
    s.assert(name, LocateName);
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

export default LocateNamePostHandler;
