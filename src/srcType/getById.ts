import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { srcType } from "../db/schema";

const getSrcTypeById = async (c: Context) => {
  const id = parseInt(c.req.param("id"), 10);
  const db = drizzle(c.env.DB);
  const result = await db.select().from(srcType).where(eq(srcType.id, id));
  if (result.length === 0) {
    return c.notFound();
  }
  return c.json(result[0]);
};

export default getSrcTypeById;
