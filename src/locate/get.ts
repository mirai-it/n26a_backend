import { drizzle } from "drizzle-orm/d1";
import { locate } from "../db/schema";

const getLocate = async (c) => {
  const db = drizzle(c.env.DB);
  const result = await db.select().from(locate).all();

  return c.json([...result]);
};

export default getLocate;
