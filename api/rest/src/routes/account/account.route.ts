import { Hono } from "hono";
import { onResponseNoAccount, onResponseOk, onResponseServerError, onResponseValidations } from "../models/response.rest.model";
import { onCreateCookieUser, onValidateCookieUser } from "../components/cookieUser";
import { deleteCookie } from "hono/cookie";
import { validator } from "../components/validator";
import { loginValidator } from "../validators/login.validator";
import { modelUserChangePasswordByPhone, modelUserGetAuthInfoByPhone, modelUserGetById, modelUserGetInfoByPhone } from "../models/user.model";
import { passwordGenerator } from "../components/passwordGenerator";
import bcrypt from "bcryptjs";
import { CookieKeyUser } from "@config";
import { smsSenderPassword } from "../components/smsPasswordSender";

export const accountRoute = new Hono();

accountRoute.post("/login", async (ctx) => {
	try {
		const validData = validator({ data: await ctx.req.json(), schema: loginValidator.base });
		if (!validData.isValid) return onResponseValidations({ ctx, validations: validData.errors });
		const { password, phone } = validData.data;

		const res = await modelUserGetAuthInfoByPhone(phone);
		if (!res) return onResponseValidations({ ctx, validations: { phone: ["کاربر یافت نشد"] }, message: "کاربر یافت نشد" });

		const hash = res.password ?? "";

		const isValid = await bcrypt.compare(password, hash);

		if (!isValid) return onResponseValidations({ ctx, validations: { password: ["گذرواژه نا معتبر"] }, message: "گذرواژه نا معتبر" });

		const user = await modelUserGetById(res.id);
		if (!user) return onResponseServerError({ error: "مشکل در بازیابی کاربر", ctx, message: "مشکل در بازیابی کاربر" });

		await onCreateCookieUser({ ctx, user });
		return onResponseOk({ ctx, data: user, message: "خوش آمدید" });
	} catch (error) {
		return onResponseServerError({ error, ctx, message: "" });
	}
});

accountRoute.get("/check", async (ctx) => {
	try {
		const user = await onValidateCookieUser({ ctx });
		if (!user) {
			deleteCookie(ctx, CookieKeyUser);
			return onResponseNoAccount({ ctx });
		}
		return onResponseOk({ ctx, data: user });
	} catch (error) {
		return onResponseServerError({ error, ctx, message: "" });
	}
});

accountRoute.get("/logout", async (ctx) => {
	try {
		deleteCookie(ctx, CookieKeyUser);
		return onResponseNoAccount({ ctx });
	} catch (error) {
		return onResponseServerError({ error, ctx, message: "" });
	}
});

accountRoute.post("/forget", async (ctx) => {
	try {
		const validData = validator({ data: await ctx.req.json(), schema: loginValidator.forget });
		if (!validData.isValid) return onResponseValidations({ ctx, validations: validData.errors });
		const { phone } = validData.data;

		const res = await modelUserGetInfoByPhone(phone);

		if (!res) return onResponseValidations({ ctx, validations: { phone: ["کاربر یافت نشد"] }, message: "کاربر یافت نشد" });

		const rawPassword = passwordGenerator();

		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash(rawPassword, salt);

		const user = await modelUserChangePasswordByPhone({ password: hash, phone });
		if (!user) return onResponseServerError({ error: "مشکل در بازیابی کاربر", ctx, message: "مشکل در بازیابی کاربر" });

		const sms = await smsSenderPassword({ password: rawPassword, phone });
		if (!sms.R_Success) onResponseServerError({ ctx, error: "خطا در ارسال پیامک" });

		return onResponseNoAccount({ ctx, ok: "رمز جدید با موفقیت برای شما ارسال شد" });
	} catch (error) {
		return onResponseServerError({ error, ctx, message: "" });
	}
});
