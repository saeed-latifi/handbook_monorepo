import { type JSX, splitProps } from "solid-js";
import { cm } from "../config/cn";

export function Form(props: JSX.FormHTMLAttributes<HTMLFormElement>) {
	const [local, others] = splitProps(props, ["class"]);

	return (
		<div class="flex flex-col w-full flex-1 items-center ">
			<form {...others} class={cm("flex flex-col gap-4 w-full", local.class)} />
		</div>
	);
}
