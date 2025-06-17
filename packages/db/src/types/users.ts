import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type { usersTable } from "../schema/users.ts";

export type IUser = InferSelectModel<typeof usersTable>;
export type INewUser = InferInsertModel<typeof usersTable>;

export interface IUserU extends InferSelectModel<typeof usersTable> {}
