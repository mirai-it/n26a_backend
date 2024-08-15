import { Hono } from "hono";
import { Env } from "../types";
import createLocate from "./create";
import getLocate from "./get";
import getLocateById from "./getById";
import updateLocate from "./updateById";

const app = new Hono<{ Bindings: Env }>();

app.get("/", getLocate);
app.get("/:id", getLocateById);
app.post("/", createLocate);
app.put("/:id", updateLocate);

export default app;
