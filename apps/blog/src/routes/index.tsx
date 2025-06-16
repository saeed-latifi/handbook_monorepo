import { Title } from "@solidjs/meta";
import { Button } from "@repo/ui/button";

export default function Home() {
	return (
		<main>
			<Title>blog</Title>
			<h1 class="text-hue">Hello blog!</h1>
			<Button class="border bg-emerald-300">It is shared button</Button>
		</main>
	);
}
