// import { cookieAgeSession, cookieAgeUser, cookieKeySession, cookieKeyUser } from "@repo/config-static";
// import { jwtSignSession, jwtSignUser } from "@repo/shared-jwt";
// import { setCookie } from "hono/cookie";
import { onResponseOk } from "@repo/shared-types/helpers";
import { Hono } from "hono";

export const publicRoutes = new Hono();

publicRoutes.get("/test", async (ctx) => {
	// const jwt = await jwtSignSession({ id: 88, ip: "22" });
	// const tokenUser = await jwtSignUser({ name: "oooo", id: 852 });

	// setCookie(ctx, cookieKeySession, jwt, { maxAge: cookieAgeSession });
	// setCookie(ctx, cookieKeyUser, tokenUser, { maxAge: cookieAgeUser });

	return ctx.json(onResponseOk({ data: { test: "ok" }, message: ["it is OK"] }));
});
