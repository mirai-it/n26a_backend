import { drizzle } from "drizzle-orm/d1";
import { Context } from "hono";
import * as s from "superstruct";
import { log } from "../db/schema";

const LogSchema = s.object({
  locateId: s.integer(),
  srcTypeId: s.integer(),
  count: s.min(s.integer(), 0),
});

const insertLog = async (c: Context) => {
  try {
    const db = drizzle(c.env.DB);
    const requestData = await c.req.json();

    const validatedData = s.create(requestData, LogSchema);

    const result = await db
      .insert(log)
      .values({
        count: validatedData.count,
        locateId: validatedData.locateId,
        srcType: validatedData.srcTypeId,
      })
      .returning({
        id: log.id,
        count: log.count,
        locateId: log.locateId,
        srcTypeId: log.srcType,
        timestamp: log.timestamp,
      });

    return c.json(
      {
        message: "Log entry created successfully",
        data: result[0],
      },
      201
    );
  } catch (error) {
    console.error("Insert log error:", error);

    if (error instanceof s.StructError) {
      return c.json(
        {
          error: "Invalid request data",
          details: error.message,
        },
        400
      );
    }

    return c.json(
      {
        error: "An error occurred while inserting the log entry",
      },
      500
    );
  }
};

export default insertLog;
