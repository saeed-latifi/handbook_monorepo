import { ResponseStates, type IResponse, type IValidations } from "./response";

export function onResponseOk<T, X>({ data, metadata, message, length }: { data: T; message?: string[]; metadata?: X; length?: number }) {
	const response: IResponse<T, X> = {
		responseState: ResponseStates.Success,
		data,
		metadata,
		length,
		messages: { success: message },
	};
	return response;
}

export function onResponseNoAccount<X>({ messages, metadata }: { messages?: string[]; metadata?: X }) {
	const response: IResponse<undefined, X> = {
		responseState: ResponseStates.NoAccount,
		messages: { noAccount: ["لطفا ابتدا وارد شوید"], success: messages },
		metadata,
	};
	return response;
}

export function onResponseNoAccess({ messages, redirectPath, warnings }: { messages?: string[]; redirectPath?: string; warnings?: string[] }) {
	const response: IResponse = {
		responseState: ResponseStates.NoAccess,
		messages: { noAccess: messages, warning: warnings },
		redirectPath,
	};
	return response;
}

export function onResponseNotFound({ messages }: { messages?: string[] }) {
	const response: IResponse = {
		responseState: ResponseStates.NotFound,
		messages: { notFound: messages },
	};
	return response;
}

export function onResponseServerError({ error, message }: { message?: string[]; error?: unknown }) {
	// TODO log error
	console.log(error);

	const response: IResponse = {
		responseState: ResponseStates.ServerError,
		messages: { error: message },
	};
	return response;
}

export function onResponseValidations<T>({ validations, message }: { validations: IValidations<T>; message?: string[] }) {
	const response: IResponse<T> = {
		responseState: ResponseStates.Validations,
		validations,
		messages: { warning: message },
	};
	return response;
}
