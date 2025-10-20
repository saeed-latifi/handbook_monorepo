import { http } from "~/http";
import type { IResponse } from "@repo/shared-types/response";
import type { IUser } from "@repo/shared-types/types";
import { useBarn } from "solid-barn";

type UserResponse = IResponse<Partial<IUser & { password: string }>>;

export function useAccount() {
	const { data, dataState, isReady, mutate } = useBarn({
		domain: "account",
		fetcher: async () => {
			try {
				const res = await http.get("/account/check");
				return res.data as UserResponse;
			} catch (_error) {
				// Return an error response if the fetch fails
				return { responseState: "ServerError" } as UserResponse;
			}
		},
	});

	function onChange(newData: Partial<IUser & { password: string }>) {
		mutate("data", newData);
	}

	async function onLogin({ password, email }: { email?: string; password?: string }) {
		try {
			const { data } = await http.post<IResponse<IUser>>("/account/login", { password, email });

			mutate(data);
		} catch (error) {
			console.error("Login failed:", error);
		}
	}

	async function onLogout() {
		try {
			const { data } = await http.get("/account/logout");
			mutate(data);
		} catch (error) {
			// Clear user data on logout regardless of server response
			mutate({ responseState: "ServerError", messages: { error: [JSON.stringify(error)] } });
		}
	}

	async function onForget(email?: string) {
		try {
			const { data } = await http.post<IResponse<IUser>>("/account/forget", { email });

			// TODO 			mutateResponse({ ...cleaned, ...response?.data });
			mutate(data);
		} catch (_error) {
			console.error("Forget password failed:", _error);
		}
	}

	return {
		data,
		dataState,
		onLogin,
		onLogout,
		onChange,
		onForget,
		isReady,
	};
}
