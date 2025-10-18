import { Type } from "typebox";

export const loginValidator = {
	base: Type.Object({
		email: Type.String({ format: "email" }),
		password: Type.String(),
	}),
	forget: Type.Object({
		email: Type.String({ format: "email" }),
	}),
};
