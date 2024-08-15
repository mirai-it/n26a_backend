import { Context } from "hono";
import { decode } from "hono/jwt";
import { is } from "superstruct";
import { TokenSchema } from "./schema";
import createToken from "./createToken";

const refreshToken = async (c: Context) => {
  try {
    const { oldToken } = await c.req.json();
    const { payload } = decode(oldToken);

    if (!is(payload, TokenSchema)) {
      return c.json({ error: "Invalid token format" }, 400);
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp <= currentTimestamp) {
      return c.json({ error: "Token has expired" }, 401);
    }

    const newToken = await createToken(payload.sub, c.env.AUTH_SECRET);
    return c.json({ token: newToken });
  } catch (error) {
    console.error("Token refresh error:", error);
    return c.json({ error: "Failed to refresh token" }, 500);
  }
};

export default refreshToken;
