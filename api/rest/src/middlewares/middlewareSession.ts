import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { modelSessionGetById, type ISession } from "@repo/shared-db";
import { jwtVerifySession } from "@repo/shared-jwt";
import { cookieKeySession } from "@repo/config-static";
import { onBadPublicToken, onCreatePublicToken, onUpdatePublicToken } from "../cookie/cookieSession";
import { serverErrorLogger } from "@repo/shared-logger";
import { onResponseServerError } from "@repo/shared-types/helpers";

export interface IMiddlewareSession {
	Variables: { session: ISession; ip: string; isBot: boolean; fixed?: boolean };
}

export async function middlewareSession(ctx: Context<IMiddlewareSession>, next: Next) {
	try {
		const ip = ctx.req.header("x-forwarded-for") || ctx.req.header("x-real-ip") || "unknown";
		ctx.set("ip", ip);
		console.log({ ip });

		const userAgent = ctx.req.header("User-Agent")?.toLowerCase();
		const isBot = userAgent?.includes("googlebot");
		ctx.set("isBot", !!isBot);

		const sessionCookie = getCookie(ctx, cookieKeySession);

		if (!sessionCookie) {
			ctx.set("fixed", true);

			const session = await onCreatePublicToken(ctx);
			if (!session) throw new Error("error on create new session");

			ctx.set("session", session);
			await next();
			return;
		}

		const validToken = await jwtVerifySession({ token: sessionCookie });

		if (typeof validToken?.id !== "number") {
			ctx.set("fixed", true);

			const session = await onBadPublicToken(ctx);
			if (!session) throw new Error("error on create new session");

			ctx.set("session", session);
			await next();
			return;
		}

		const session = await modelSessionGetById(validToken.id);
		if (!session) throw new Error("error on find session");

		onUpdatePublicToken({ ctx, token: sessionCookie });

		ctx.set("session", session);
		await next();
		return;
	} catch (error) {
		console.log("on bad token");
		ctx.set("fixed", true);

		const session = await onBadPublicToken(ctx);
		if (!session) {
			serverErrorLogger({ error, domain: "session", title: "bad session" });
			return ctx.json(onResponseServerError({ message: ["خطا در بازیابی جلسه کاربری"], error }));
		}

		ctx.set("session", session);
		await next();
		return;
	}
}
