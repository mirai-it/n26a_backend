import { Context } from "hono";
import { decode } from "hono/jwt";
import { is } from "superstruct";
import { TokenSchema } from "./schema";
import createToken from "./createToken";

const refreshToken = async (c: Context) => {
  const { oldToken } = await c.req.json();
  const { payload } = decode(oldToken);

  if (is(payload, TokenSchema) && payload.exp > Math.floor(Date.now() / 1000)) {
    const token = await createToken(payload.sub, c.env.AUTH_SECRET);
    return c.json({ token });
  } else {
    return c.json(
      {
        msg: "refresh token faild.",
      },
      400
    );
  }
};

export default refreshToken;
