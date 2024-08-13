import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { srcType } from "../db/schema";
import { Env } from "..";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(srcType).all();
  return c.json([...result]);
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

export default app;
