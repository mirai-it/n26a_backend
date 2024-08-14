import { Hono } from "hono";
import { Env } from "../types";
import createSrcType from "./create";
import deleteSrcType from "./delete";
import getSrcTypes from "./get";
import getSrcTypeById from "./getById";

const app = new Hono<{ Bindings: Env }>();

app.get("/", getSrcTypes);
app.post("/", createSrcType);
app.get("/:id", getSrcTypeById);
app.delete("/:id", deleteSrcType);

export default app;
