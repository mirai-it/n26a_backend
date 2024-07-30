import { Hono } from "hono";
import locateNameGetHandler from "./locate/doGet";
import LocateNamePostHandler from "./locate/doPost";
import srcTypeGetAllHandler, { srcTypeGetHandler } from "./srcType/doGet";
import srcTypePostHandler from "./srcType/doPost";
import srcTypeDeleteHandler from "./srcType/doDelete";

export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  // const db = drizzle(c.env.DB);
  // const result = db.select().from(log).all();
  return c.json({ hello: "world" });
});

app.post("/locate", LocateNamePostHandler);
app.get("/locate", locateNameGetHandler);

app.post("/src_type", srcTypePostHandler);
app.get("/src_type", srcTypeGetAllHandler);
app.get("/src_type/:id", srcTypeGetHandler);
app.delete("/src_type/:id", srcTypeDeleteHandler);

export default app;
