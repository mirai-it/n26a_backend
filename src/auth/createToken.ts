import { sign } from "hono/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { v6 } from "uuid";

export default async function createToken(sub: string, key: SignatureKey) {
  return await sign(
    {
      sub: sub,
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
      "s/n": v6(),
    },
    key
  );
}
