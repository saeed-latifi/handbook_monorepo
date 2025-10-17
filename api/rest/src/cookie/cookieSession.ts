import { cookieAgeSession, cookieKeySession, cookieKeyUser } from "@repo/config-static";
import { modelSessionCreate } from "@repo/shared-db";
import { jwtSignSession } from "@repo/shared-jwt";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export async function onBadPublicToken(ctx: Context) {
	deleteCookie(ctx, cookieKeySession);
	deleteCookie(ctx, cookieKeyUser);
	return onCreatePublicToken(ctx);
}

export async function onCreatePublicToken(ctx: Context) {
	const ip = ctx.req.header("x-forwarded-for") || ctx.req.header("x-real-ip") || "unknown";

	deleteCookie(ctx, cookieKeyUser);

	const session = await modelSessionCreate({ ip });
	if (!session) return;

	const jwt = await jwtSignSession({ id: session.id, ip });

	console.log("create session!");
	setCookie(ctx, cookieKeySession, jwt, { maxAge: cookieAgeSession });
	return session;
}

export async function onUpdatePublicToken(ctx: Context) {
	console.log("update session!");
	const tokenPublic = getCookie(ctx, cookieKeySession);
	if (tokenPublic) setCookie(ctx, cookieKeySession, tokenPublic, { maxAge: cookieAgeSession });
}
