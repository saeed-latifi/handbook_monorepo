import { onResponseOk } from "@repo/shared-types/helpers";
import { Hono } from "hono";

export const publicRoutes = new Hono();

publicRoutes.get("/test", async (ctx) => {
	return ctx.json(onResponseOk({ data: { test: "ok" }, message: ["it is OK"] }));
});
