import { sign } from "hono/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { v6 } from "uuid";

export default async function createToken(sub: string, key: SignatureKey) {
  const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 12; // 12時間後

  return {
    token: await sign(
      {
        sub: sub,
        role: "admin",
        exp: expirationTime,
        "s/n": v6(),
      },
      key
    ),
    exp: new Date(expirationTime * 1000).toISOString(),
  };
}
