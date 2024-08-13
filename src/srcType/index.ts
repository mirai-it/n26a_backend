import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { srcType } from "../db/schema";
import * as s from "superstruct";
import { Env } from "..";

const app = new Hono<{ Bindings: Env }>();

const srcTypeName = s.trimmed(s.size(s.nonempty(s.string()), 1, 100));

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(srcType).all();
  return c.json([...result]);
});

app.post("/", async (c) => {
  const { name } = await c.req.json();
  try {
    s.assert(name, srcTypeName);
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
});

app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const db = drizzle(c.env.DB);
  const result = await db.select().from(srcType).where(eq(srcType.id, id));
  if (result.length === 0) {
    return c.notFound();
  }
  return c.json(result[0]);
});

app.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  console.log(id);
  const db = drizzle(c.env.DB);
  await db.delete(srcType).where(eq(srcType.id, id));

  return c.json(
    {
      result: "OK",
      time: new Date().toISOString(),
    },
    200
  );
});

export default app;
