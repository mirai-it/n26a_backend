import { srcType } from "../db/schema";
import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import { eq } from "drizzle-orm";

const srcTypeDeleteHandler = async (c: Context) => {
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
};

export default srcTypeDeleteHandler;
