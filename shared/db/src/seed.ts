import { UserRole } from "./enums";
import { modelUserCreate, modelUserGetList } from "./models";

export async function seedRootUser({ password }: { password: string }) {
	const { users } = await modelUserGetList({ skip: 0, take: 100 });
	if (!users[0]) return await modelUserCreate({ userData: { name: "ادمین", email: "admin@info.com", role: UserRole.Admin }, password });

	return users[0];
}
