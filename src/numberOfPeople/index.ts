import { Hono } from "hono";
import { Env } from "../types";
import { drizzle } from "drizzle-orm/d1";
import { locate, log, srcType } from "../db/schema";
import insertLog from "./insert";
import { eq } from "drizzle-orm";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db
    .select()
    .from(log)
    .innerJoin(locate, eq(log.locateId, locate.id))
    .innerJoin(srcType, eq(log.srcType, srcType.id))
    .all();

  c.header(
    "Cache-Control",
    "public, max-age=30, stale-while-revalidate=3600 ,stale-if-error=82800"
  );
  return c.json([...result]);
});

app.post("/", insertLog);

export default app;
