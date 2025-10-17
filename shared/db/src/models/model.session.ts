import { eq, and, type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { sessionsTable } from "../schema/schema.session";
import { db } from "../client";

export type ISession = InferSelectModel<typeof sessionsTable>;
export type ISessionCreate = Omit<InferInsertModel<typeof sessionsTable>, "">;

export type CreateSession = Omit<typeof sessionsTable.$inferInsert, "id" | "createdAt">;
export type UpdateSession = Partial<CreateSession>;

// CREATE
export async function modelSessionCreate(sessionData: CreateSession) {
	const [newRoom] = await db.insert(sessionsTable).values(sessionData).returning();
	return newRoom;
}

// READ
export async function modelSessionGetById(sessionId: number) {
	return await db.query.sessionsTable.findFirst({ where: eq(sessionsTable.id, sessionId) });
}

export async function modelSessionGetUserActiveSessions(userId: number) {
	return await db.query.sessionsTable.findMany({ where: and(eq(sessionsTable.userId, userId), eq(sessionsTable.isActive, true)) });
}

// UPDATE
export async function modelSessionUpdate({ sessionData, sessionId }: { sessionId: number; sessionData: UpdateSession }) {
	const [newRoom] = await db.update(sessionsTable).set(sessionData).where(eq(sessionsTable.id, sessionId)).returning();
	return newRoom;
}
