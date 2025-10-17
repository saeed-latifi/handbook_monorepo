import { eq, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { userExtraInfoTable, userSensitiveInfoTable, usersTable } from "../schema";
import { db } from "../client";

export type IUser = InferSelectModel<typeof usersTable>;
export type IUserCreate = Omit<InferInsertModel<typeof usersTable> & { password: string }, "createdAt" | "isActive" | "info" | "avatar">;

// Types
export type UserExtraInfo = typeof userExtraInfoTable.$inferInsert;
export type UserSensitiveInfo = typeof userSensitiveInfoTable.$inferInsert;
export type CreateUser = Omit<typeof usersTable.$inferInsert, "id" | "createdAt">;
export type UpdateUser = Partial<CreateUser>;

// CREATE
export async function modelUserCreate({ password, userData }: { userData: CreateUser; password: string }) {
	const result = await db.transaction(async (tx) => {
		// First, create the user
		const [newUser] = await tx.insert(usersTable).values(userData).returning();

		if (!newUser) throw new Error("Failed to create user"); // This will rollback the transaction

		const [extra, sensitive] = await Promise.all([
			await tx.insert(userExtraInfoTable).values({ userId: newUser.id }).returning(),
			await tx.insert(userSensitiveInfoTable).values({ userId: newUser.id, password }).returning(),
		]);

		if (!extra[0] || !sensitive[0]) throw new Error("Failed to create user");

		return newUser;
	});

	return result;
}

// READ
export async function modelUserGetList({ skip, take }: { take: number; skip: number }) {
	const count = await db.$count(usersTable);

	const users = await db.select().from(usersTable).orderBy(usersTable.id).limit(take).offset(skip);
	return { users, count };
}

export async function modelUserGetById(id: number) {
	const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
	return user;
}

export async function modelUserGetExtraInfo(userId: number) {
	const [info] = await db.select().from(userExtraInfoTable).where(eq(userExtraInfoTable.userId, userId));
	return info;
}

export async function modelUserGetSensitiveInfo(userId: number) {
	const [info] = await db.select().from(userSensitiveInfoTable).where(eq(userSensitiveInfoTable.userId, userId));
	return info;
}

// UPDATE
export async function modelUserUpdate(id: number, userData: UpdateUser) {
	console.log({ userData });

	const [updatedUser] = await db.update(usersTable).set(userData).where(eq(usersTable.id, id)).returning();
	return updatedUser;
}

export async function modelUserUpdateExtraInfo(userId: number, extraInfo: Partial<Omit<UserExtraInfo, "userId">>) {
	const [updatedInfo] = await db.update(userExtraInfoTable).set(extraInfo).where(eq(userExtraInfoTable.userId, userId)).returning();
	return updatedInfo;
}

export async function modelUserUpdateSensitiveInfo(userId: number, sensitiveInfo: Partial<Omit<UserSensitiveInfo, "userId">>) {
	const [updatedInfo] = await db.update(userSensitiveInfoTable).set(sensitiveInfo).where(eq(userSensitiveInfoTable.userId, userId)).returning();
	return updatedInfo;
}

export async function modelUserGetAuthInfoByMail(email: string) {
	const result = await db
		.select({
			id: usersTable.id,
			password: userSensitiveInfoTable.password,
		})
		.from(usersTable)
		.innerJoin(userSensitiveInfoTable, eq(usersTable.id, userSensitiveInfoTable.userId))
		.where(eq(usersTable.email, email))
		.execute();

	return result[0];
}

export async function modelUserGetByMail(email: string) {
	const result = await db.select().from(usersTable).where(eq(usersTable.email, email)).execute();
	return result[0];
}

export async function modelUserChangePasswordByMail({ password, email }: { email: string; password: string }) {
	const result = await db
		.update(userSensitiveInfoTable)
		.set({ password })
		.where(eq(userSensitiveInfoTable.userId, db.select({ id: usersTable.id }).from(usersTable).where(eq(usersTable.email, email))))
		.returning();

	return result[0]?.userId;
}
