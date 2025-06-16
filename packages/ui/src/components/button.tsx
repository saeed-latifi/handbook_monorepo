import { splitProps } from "solid-js";
import { cn } from "../config/cn";

// Button props

export function Button(props: any) {
	const [local, others] = splitProps(props, ["asChild", "ref", "children", "class"]);

	return (
		<button class={cn("flex items-center  justify-center gap-3  outline-none cursor-pointer p-4 rounded-sm  text-[1rem] w-full mx-auto bg-blue-700 border-green-500", local?.class)} {...others}>
			{local.children}
			<span class="flex ">w</span>
		</button>
	);
}
