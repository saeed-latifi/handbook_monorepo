export const ResponseStates = {
	Success: "Success",
	NoAccount: "NoAccount",
	NoAccess: "NoAccess",
	NotFound: "NotFound",
	ServerError: "ServerError",
	Validations: "Validations",
} as const;

export type ResponseStates = (typeof ResponseStates)[keyof typeof ResponseStates];

export type IValidations<T> = { [K in keyof T]?: string[] };

export interface IResponse<T = undefined, X = undefined> {
	responseState?: ResponseStates;
	data?: T;
	metadata?: X;
	length?: number;

	messages?: Partial<Record<"success" | "error" | "warning" | "noAccess" | "notFound" | "noAccount", string[]>>;
	validations?: IValidations<T>;
	redirectPath?: string;
}
