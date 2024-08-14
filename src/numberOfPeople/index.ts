import { Hono } from "hono";
import { Env } from "../types";
import { drizzle } from "drizzle-orm/d1";
import { log } from "../db/schema";
import insertLog from "./insert";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(log).all();
  return c.json([...result]);
});

app.post("/", insertLog);

export default app;
