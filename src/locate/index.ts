import { Hono } from "hono";
import { Env } from "../types";
import createLocate from "./create";
import getLocate from "./get";
import getLocateById from "./getById";

const app = new Hono<{ Bindings: Env }>();

app.get("/", getLocate);
app.get("/:id", getLocateById);
app.post("/", createLocate);

export default app;
