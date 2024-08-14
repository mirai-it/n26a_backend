import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import * as s from "superstruct";
import { log } from "../db/schema";

const LogScheme = s.object({
  locateId: s.integer(),
  srcTypeId: s.integer(),
  count: s.min(s.integer(), 0),
});

const insertLog = async (c: Context) => {
  const db = drizzle(c.env.DB);
  const { locateId, srcTypeId, count } = await c.req.json();
  const req = { locateId, srcTypeId, count };
  console.log(req);
  if (s.is(req, LogScheme)) {
    const result = await db
      .insert(log)
      .values({
        count: req.count,
        locateId: req.locateId,
        srcType: req.srcTypeId,
      })
      .returning({
        id: log.id,
        count: log.count,
        locateId: log.locateId,
        srcTypeId: log.srcType,
      })
      .catch(() => null);
    if (result === null) {
      return c.json(
        {
          msg: "Database Update Error",
        },
        500
      );
    } else {
      return c.json(result[0], 201);
    }
  } else {
    return c.json(
      {
        msg: "Ivalid request",
      },
      400
    );
  }
};

export default insertLog;
