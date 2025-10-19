import { cookieAgeSession, cookieKeySession, cookieKeyUser } from "@repo/config-static";
import { modelSessionCreate } from "@repo/shared-db";
import { jwtSignSession } from "@repo/shared-jwt";
import type { Context } from "hono";
import { deleteCookie, setCookie } from "hono/cookie";

export async function onBadPublicToken(ctx: Context) {
	deleteCookie(ctx, cookieKeyUser);
	deleteCookie(ctx, cookieKeySession);
	return onCreatePublicToken(ctx);
}

export async function onCreatePublicToken(ctx: Context) {
	deleteCookie(ctx, cookieKeyUser);

	// TODO
	const ip = ctx.req.header("x-forwarded-for") || ctx.req.header("x-real-ip") || "in develop";
	if (!ip) return;

	const session = await modelSessionCreate({ ip });

	if (!session) return;

	const jwt = await jwtSignSession({ id: session.id, ip });
	setCookie(ctx, cookieKeySession, jwt, { maxAge: cookieAgeSession });

	console.log("session created!");
	return session;
}

export async function onUpdatePublicToken({ ctx, token }: { ctx: Context; token: string }) {
	console.log("session updated!");
	setCookie(ctx, cookieKeySession, token, { maxAge: cookieAgeSession });
}
