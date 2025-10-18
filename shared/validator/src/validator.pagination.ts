import Type from "typebox";
import { validator } from "./validator";

export const SortBy = { student: "student", support: "support" } as const;
export type SortBy = (typeof SortBy)[keyof typeof SortBy];

const paginationSchema = Type.Object({
	take: Type.Integer(),
	skip: Type.Integer(),
	sortBy: Type.Optional(Type.Enum(SortBy)),
});

export { paginationSchema };

export function paginationParser({ skip, sortBy, take }: { take?: string; skip?: string; sortBy?: string }) {
	const args = validator({
		data: { take: parseInt(take ?? ""), skip: parseInt(skip ?? ""), sortBy },
		schema: paginationSchema,
	});

	return args;
}
