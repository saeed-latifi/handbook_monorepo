export const UserRole = { Admin: "Admin", Base: "Base" } as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
