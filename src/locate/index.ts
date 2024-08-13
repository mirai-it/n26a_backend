import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { Env } from "..";
import { locate } from "../db/schema";
import { eq } from "drizzle-orm";
import * as s from "superstruct";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(locate).all();

  return c.json([...result]);
});

app.get("/:id", async (c) => {
  const { id } = c.req.param();

  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(locate)
    .where(eq(locate.id, parseInt(id) || -1));

  if (result.length === 0) {
    return c.notFound();
  }

  return c.json(result[0]);
});

const LocateName = s.trimmed(s.size(s.nonempty(s.string()), 1, 100));

app.post("/", async (c) => {
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
});

export default app;
