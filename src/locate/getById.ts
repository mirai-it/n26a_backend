import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { locate } from "../db/schema";

const getLocateById = async (c: Context) => {
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
};

export default getLocateById;
