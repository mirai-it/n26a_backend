import { Hono } from "hono";
import { Env } from "./types";
import locate from "./locate";
import srcType from "./srcType";
import numberOfPeople from "./numberOfPeople";
import auth from "./auth";
import { cors } from "hono/cors";
import authMiddleware from "./middleware";

const app = new Hono<{ Bindings: Env }>();

app.get("/", (c) => {
  return c.json({ hello: "world" });
});
app.route("/auth", auth); // 認証を行う場所を除外
// ------------------------------------------
app.use("*", authMiddleware);
app.use("*", cors());
app.route("/locate", locate);
app.route("/src_type", srcType);
app.route("/number_of_people", numberOfPeople);

export default app;
