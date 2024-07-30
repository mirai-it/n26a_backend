import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { locate } from "../db/schema";

const locateNameGetHandler = async (c: Context) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(locate).all();
  console.log(result);

  return c.json([...result]);
};

export default locateNameGetHandler;
