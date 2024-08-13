import { Hono } from "hono";
import locate from "./locate";
import srcType from "./srcType";

export type Env = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.json({ hello: "world" });
});

app.route("/locate", locate);
app.route("/src_type", srcType);

export default app;
