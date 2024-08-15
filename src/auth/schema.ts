import * as s from "superstruct";
import { version as uuidVersion } from "uuid";
import { validate as uuidValidate } from "uuid";

export const uuid = () =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  s.define<string>("uuidv6", (v) => uuidValidate(v) && uuidVersion(v) === 6);

// JWT token payload
export const TokenSchema = s.object({
  sub: s.string(),
  role: s.string(),
  exp: s.min(s.number(), 0),
  "s/n": uuid(),
});
export type TokenSchema = s.Infer<typeof TokenSchema>;
// -----

export const IdSchema = s.size(s.string(), 0, 64);
export const PasswordSchema = s.size(s.string(), 20, 255);
export const LoginPosts = s.object({
  IdSchema,
  PasswordSchema,
});
