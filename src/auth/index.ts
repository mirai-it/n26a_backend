import { Hono, Next } from "hono";
import { jwt } from "hono/jwt";
import { Env } from "../types";
import { cors } from "hono/cors";
import loginHandler from "./login";
import signUpHandler from "./signup";

const app = new Hono<{ Bindings: Env }>();

app.post("/login", loginHandler);
app.use("*", async (c, next: Next) =>
  jwt({ secret: c.env.AUTH_SECRET })(c, next)
);
app.use("*", cors());
app.post("/signUp", signUpHandler);

export default app;
