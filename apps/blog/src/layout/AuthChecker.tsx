import { type JSXElement, Match, Switch } from "solid-js";
// import { LoadingSpinner } from "~/components/animations/LoadingSpinner";
// import { CardCenter } from "~/components/card/CardCenter";
// import { useInterceptor } from "~/hooks/useInterceptor";
// import { ResponseState } from "~/types/response.type";
import { Header } from "./Header";
import { WidthFixer } from "./WidthFixer";
import { CardCenter } from "@repo/shared-ui/cards/CardCenter";
import { LoadingSpinner } from "@repo/shared-ui/animations/LoadingSpinner";
import { LoginPage } from "../pages/login";
import { useAccount } from "../hooks/useAccount";

// import { Footer } from "./Footer";

export function AuthChecker(props: { children: JSXElement }) {
	// useInterceptor();

	const { dataState, isReady, data } = useAccount();

	return (
		<Switch fallback={<div class="bg-green-400 w-full p-8 flex flex-col in-checked: justify-center">initializing ...</div>}>
			<Match when={!isReady() || !dataState().initialized || dataState().isLoading || dataState().isValidating}>
				<CardCenter>
					<LoadingSpinner />
				</CardCenter>
			</Match>

			<Match when={data()?.responseState === "Success"}>
				<>
					<Header />
					<WidthFixer>{props.children}</WidthFixer>
					{/* <Footer /> */}
				</>
			</Match>

			<Match when={data()?.responseState}>
				<WidthFixer>
					<LoginPage />
				</WidthFixer>
			</Match>

			<Match when={true}>
				<div class="bg-rose-400 w-full p-8 flex flex-col in-checked: justify-center">some happened ...</div>
			</Match>
		</Switch>
	);
}
