import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { type Context } from "hono";
import { jwtSignUser, jwtVerifyUser } from "@repo/shared-jwt";
import { cookieAgeUser, cookieKeyUser } from "@repo/config-static";
import { modelUserGetById } from "@repo/shared-db";

export async function onCreateCookieUser({ ctx, user }: { ctx: Context; user: { id: number; name: string } }) {
	const tokenUser = await jwtSignUser({ name: user.name, id: user.id });
	setCookie(ctx, cookieKeyUser, tokenUser, { maxAge: cookieAgeUser, sameSite: "none", secure: true, partitioned: true });
}

export async function onUpdateCookieUser({ ctx }: { ctx: Context }) {
	const tokenUser = getCookie(ctx, cookieKeyUser);
	if (tokenUser) setCookie(ctx, cookieKeyUser, tokenUser, { maxAge: cookieAgeUser, sameSite: "none", secure: true, partitioned: true });
}

export async function onValidateCookieUser({ ctx }: { ctx: Context }) {
	const tokenUser = getCookie(ctx, cookieKeyUser);
	if (!tokenUser) return;

	const validToken = await jwtVerifyUser({ token: tokenUser });

	if (typeof validToken?.id !== "number") {
		deleteCookie(ctx, cookieKeyUser);
		return;
	}

	const user = await modelUserGetById(validToken.id);
	if (!user) {
		deleteCookie(ctx, cookieKeyUser);
		return;
	}
	onUpdateCookieUser({ ctx });
	return user;
}
