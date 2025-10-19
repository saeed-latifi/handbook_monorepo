import { Hono } from "hono";
import { deleteCookie } from "hono/cookie";
import bcrypt from "bcryptjs";
import { cookieKeyUser } from "@repo/config-static";
import { passwordGenerator } from "@repo/shared-utils";
import { modelUserChangePasswordByMail, modelUserGetAuthInfoByMail, modelUserGetById } from "@repo/shared-db";
import { loginValidator, validator } from "@repo/shared-validator";
import { onCreateCookieUser, onValidateCookieUser } from "../../cookie/cookieUser";
import { sendForgetPasswordMail } from "@repo/shared-mail";
import { onResponseNoAccount, onResponseOk, onResponseServerError, onResponseValidations } from "@repo/shared-types/helpers";

export const accountRoutes = new Hono();

accountRoutes.post("/login", async (ctx) => {
	try {
		const validData = validator({ data: await ctx.req.json(), schema: loginValidator.base });
		if (!validData.isValid) return ctx.json(onResponseValidations({ validations: validData.errors }));
		const { password, email } = validData.data;

		const res = await modelUserGetAuthInfoByMail(email);
		if (!res) return ctx.json(onResponseValidations({ validations: { email: ["کاربر یافت نشد"] }, message: ["کاربر یافت نشد"] }));

		const hash = res.password ?? "";

		const isValid = await bcrypt.compare(password, hash);

		if (!isValid) return ctx.json(onResponseValidations({ validations: { password: ["گذرواژه نا معتبر"] }, message: ["گذرواژه نا معتبر"] }));

		const user = await modelUserGetById(res.id);
		if (!user) return ctx.json(onResponseServerError({ error: "مشکل در بازیابی کاربر", message: ["مشکل در بازیابی کاربر"] }));

		await onCreateCookieUser({ ctx, user });
		return ctx.json(onResponseOk({ data: user, message: ["خوش آمدید"] }));
	} catch (error) {
		return ctx.json(onResponseServerError({ error }));
	}
});

accountRoutes.get("/check", async (ctx) => {
	try {
		const user = await onValidateCookieUser({ ctx });
		if (!user) return ctx.json(onResponseNoAccount({}));

		return ctx.json(onResponseOk({ data: user }));
	} catch (error) {
		return ctx.json(onResponseServerError({ error }));
	}
});

accountRoutes.get("/logout", async (ctx) => {
	try {
		deleteCookie(ctx, cookieKeyUser);
		return ctx.json(onResponseNoAccount({}));
	} catch (error) {
		return ctx.json(onResponseServerError({ error }));
	}
});

accountRoutes.post("/forget", async (ctx) => {
	try {
		const validData = validator({ data: await ctx.req.json(), schema: loginValidator.forget });
		if (!validData.isValid) return ctx.json(onResponseValidations({ validations: validData.errors }));
		const { email } = validData.data;

		const info = await modelUserGetAuthInfoByMail(email);

		if (!info) return ctx.json(onResponseValidations({ validations: { email: ["کاربر یافت نشد"] }, message: ["کاربر یافت نشد"] }));

		const rawPassword = passwordGenerator();

		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(rawPassword, salt);

		const user = await modelUserChangePasswordByMail({ password: hash, email });
		if (!user) return ctx.json(onResponseServerError({ error: "مشکل در بازیابی کاربر", message: ["مشکل در بازیابی کاربر"] }));

		const res = await sendForgetPasswordMail({ email });
		if (!res) onResponseServerError({ error: "خطا در ارسال ایمیل" });

		return ctx.json(onResponseNoAccount({ messages: ["رمز جدید با موفقیت برای شما ارسال شد"] }));
	} catch (error) {
		return ctx.json(onResponseServerError({ error }));
	}
});
