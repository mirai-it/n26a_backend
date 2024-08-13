import { Hono } from "hono";
import { Env } from "./types";
import locate from "./locate";
import srcType from "./srcType";
import auth from "./auth";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.json({ hello: "world" });
});

app.route("/auth", auth);
app.route("/locate", locate);
app.route("/src_type", srcType);

export default app;
