import type { Context, Next } from "hono";
import { deleteCookie } from "hono/cookie";
import type { IMiddlewareSession } from "./middlewareSession";
import { cookieKeyUser } from "@repo/config-static";
import type { ISession, IUser } from "@repo/shared-db";
import { onValidateCookieUser } from "../cookie/cookieUser";
import { onResponseNoAccount } from "@repo/shared-types/helpers";

export interface IMiddlewareUser extends IMiddlewareSession {
	Variables: { user?: IUser; session: ISession; ip: string; isBot: boolean };
}

export async function middlewareUser(ctx: Context<IMiddlewareUser>, next: Next) {
	try {
		const user = await onValidateCookieUser({ ctx });
		if (!user) return ctx.json(onResponseNoAccount({}));

		ctx.set("user", user);
		await next();
		return;
	} catch (error) {
		deleteCookie(ctx, cookieKeyUser);
		return ctx.json(onResponseNoAccount({}));
	}
}
