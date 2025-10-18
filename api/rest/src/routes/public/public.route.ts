import { onResponseOk } from "@repo/config-static";
import { Hono } from "hono";

export const publicRoutes = new Hono();

publicRoutes.get("/test", async (ctx) => {
	return ctx.json(onResponseOk({ data: { test: "ok" }, message: ["خوش آمدید"] }));
});
