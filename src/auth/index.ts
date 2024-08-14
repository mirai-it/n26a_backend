import { Hono } from "hono";
import { Env } from "../types";
import loginHandler from "./login";
import signUpHandler from "./signup";
import refreshToken from "./refresh";
import { jwt } from "hono/jwt";

const app = new Hono<{ Bindings: Env }>();

// 除外
app.post("/login", loginHandler);
// 保護されたパス ここから
app.use("*", async (c, next) => {
  await jwt({ secret: c.env.AUTH_SECRET })(c, next);
});
app.post("/signUp", signUpHandler);
app.post("/refresh", refreshToken);

export default app;
