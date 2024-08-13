import * as s from "superstruct";
export const LocateNameSchema = s.trimmed(
  s.size(s.nonempty(s.string()), 1, 100)
);
