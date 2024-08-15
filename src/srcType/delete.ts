import { drizzle } from "drizzle-orm/d1";
import { srcType } from "../db/schema";
import { eq } from "drizzle-orm";
import { Context } from "hono";

const validateId = (id: string): number | null => {
  const numericId = parseInt(id);
  return Number.isInteger(numericId) ? numericId : null;
};

const deleteSrcType = async (c: Context) => {
  const id = validateId(c.req.param("id"));

  // IDの検証
  if (id === null) {
    return c.json(
      {
        error: "Invalid ID",
        message: "The provided ID must be a integer.",
      },
      400
    );
  }

  const db = drizzle(c.env.DB);
  const onErr = await db
    .delete(srcType)
    .where(eq(srcType.id, id))
    .then(() => false)
    .catch(() => true);

  if (onErr) {
    return c.json(
      {
        message: "Source type deleted faild",
        timestamp: new Date().toISOString(),
      },
      500
    );
  }
  return c.json(
    {
      message: "Source type deleted successfully",
      timestamp: new Date().toISOString(),
    },
    200
  );
};

export default deleteSrcType;
