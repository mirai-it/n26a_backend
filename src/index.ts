import { Hono } from "hono";
import srcTypeGetAllHandler, { srcTypeGetHandler } from "./srcType/doGet";
import srcTypePostHandler from "./srcType/doPost";
import srcTypeDeleteHandler from "./srcType/doDelete";
import locate from "./locate";
import { basicAuth } from "hono/basic-auth";

export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  // const db = drizzle(c.env.DB);
  // const result = db.select().from(log).all();
  return c.json({ hello: "world" });
});

app.route("/locate", locate);

app.post(
  "/src_type",
  basicAuth({ username: "hono", password: "acoolproject" }),
  srcTypePostHandler
);
app.get("/src_type", srcTypeGetAllHandler);
app.get("/src_type/:id", srcTypeGetHandler);
app.delete(
  "/src_type/:id",
  basicAuth({ username: "hono", password: "acoolproject" }),
  srcTypeDeleteHandler
);

export default app;
