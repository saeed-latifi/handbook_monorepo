import { pgTable, timestamp, boolean, foreignKey, integer, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { usersTable } from "./schema.users";

// Chat Room Table
export const sessionsTable = pgTable(
	"sessions",
	{
		id: integer().primaryKey().generatedAlwaysAsIdentity(),

		userId: integer(),
		endpoint: varchar(),
		p256dh: varchar(),
		auth: varchar(),
		createdAt: timestamp().notNull().defaultNow(),
		isActive: boolean().notNull().default(true),
		ip: varchar().notNull(),
	},

	(table) => [
		foreignKey({ columns: [table.userId], foreignColumns: [usersTable.id] })
			.onDelete("cascade")
			.onUpdate("cascade"),
	],
);

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
	user: one(usersTable, {
		fields: [sessionsTable.userId],
		references: [usersTable.id],
		relationName: "user_sessions",
	}),
}));
