import { drizzle } from "drizzle-orm/d1";
import { srcType } from "../db/schema";
import { Context } from "hono";

const getSrcTypes = async (c: Context) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(srcType).all();
  return c.json([...result]);
};

export default getSrcTypes;
