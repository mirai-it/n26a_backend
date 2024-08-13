import { Hono } from "hono";
import { Env } from "../types";

const app = new Hono<{ Bindings: Env }>();

export default app;
