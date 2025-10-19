import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, varchar, uuid, timestamp, foreignKey, pgEnum } from "drizzle-orm/pg-core";
import { sessionsTable } from "./schema.session";
import { UserRole } from "../enums";

export const userRoleEnum = pgEnum("user_role", [UserRole.Admin, UserRole.Base]);

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),

	email: varchar({ length: 255 }).notNull().unique(),

	avatar: uuid(),
	info: uuid(), // noSQL id
	createdAt: timestamp().notNull().defaultNow(),
	isActive: boolean().notNull().default(true),
	role: userRoleEnum().notNull().default(UserRole.Base),
});

export const userExtraInfoTable = pgTable(
	"UserExtraInfo",
	{
		userId: integer().primaryKey(),
		description: varchar({ length: 255 }),
	},
	(table) => [
		foreignKey({ columns: [table.userId], foreignColumns: [usersTable.id], name: "extra_user_fk" })
			.onDelete("cascade")
			.onUpdate("cascade"),
	],
);

export const userSensitiveInfoTable = pgTable(
	"UserSensitiveInfo",
	{
		userId: integer().primaryKey(),
		password: varchar({ length: 60 }).notNull(),
	},
	(table) => [
		foreignKey({ columns: [table.userId], foreignColumns: [usersTable.id], name: "sensitive_user_fk" })
			.onDelete("cascade")
			.onUpdate("cascade"),
	],
);

export const userRelations = relations(usersTable, ({ one, many }) => ({
	sensitiveInfo: one(userSensitiveInfoTable, {
		fields: [usersTable.id],
		references: [userSensitiveInfoTable.userId],
		relationName: "sensitive_info",
	}),

	extraInfo: one(userExtraInfoTable, {
		fields: [usersTable.id],
		references: [userExtraInfoTable.userId],
		relationName: "extra_info",
	}),

	sessions: many(sessionsTable, {
		relationName: "user_sessions",
	}),
}));

export const sensitiveRelations = relations(userSensitiveInfoTable, ({ one }) => ({
	sensitiveInfo: one(usersTable, {
		fields: [userSensitiveInfoTable.userId],
		references: [usersTable.id],
		relationName: "sensitive_info",
	}),
}));

export const extraRelations = relations(userExtraInfoTable, ({ one }) => ({
	sensitiveInfo: one(usersTable, {
		fields: [userExtraInfoTable.userId],
		references: [usersTable.id],
		relationName: "extra_info",
	}),
}));
