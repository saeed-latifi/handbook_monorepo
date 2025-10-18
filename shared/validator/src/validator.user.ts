import { UserRole } from "@repo/config-static";
import Type from "typebox";

// Base User Schema
const UserSchema = Type.Object({
	id: Type.Integer(),
	name: Type.String({ minLength: 2, maxLength: 20, format: "persian" }),
	email: Type.String({ format: "email" }),
	avatar: Type.Optional(Type.String()),
	role: Type.Optional(Type.Enum(UserRole)),
});

const CreateUserSchema = Type.Omit(UserSchema, ["id", "createdAt"]);

export const userValidator = {
	create: Type.Intersect([CreateUserSchema, Type.Object({ password: Type.String({ minLength: 6 }) })]),
};
