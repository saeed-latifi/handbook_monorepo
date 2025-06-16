import { Title } from "@solidjs/meta";
import { Button } from "@repo/ui/button";

import { createResource, createSignal, onMount } from "solid-js";
import { io, Socket } from "socket.io-client";

type Message = string;

export default function Home() {
	const [input, setInput] = createSignal("");
	const [messages, setMessages] = createSignal<Message[]>([]);

	const socket: Socket = io("http://localhost:3011");
	onMount(() => {
		socket.on("chat", (msg: Message) => {
			setMessages((prev) => [...prev, msg]);
		});
	});

	function sendMessage() {
		const trimmed = input().trim();
		if (trimmed) {
			socket.emit("chat", trimmed);
			setInput("");
		}
	}

	async function fetchSample() {
		const response = await fetch("http://localhost:3010");
		const data = await response.json();
		console.log({ data });
	}

	return (
		<main>
			<Title>shop</Title>

			<h1 class="text-hue">Hello shop!</h1>
			<Button onClick={fetchSample} class="border bg-amber-300">
				fetch by action sample
			</Button>

			<Button onClick={sendMessage} class="border bg-amber-300">
				socket emit
			</Button>

			<input type="text" placeholder="Type a message..." value={input()} onInput={(e) => setInput(e.currentTarget.value)} autofocus style={{ width: "250px", padding: "5px" }} />
			<ul style={{ "list-style": "none", padding: 0 }}>
				{messages().map((msg, i) => (
					<li style={{ margin: "5px 0" }}>{msg}</li>
				))}
			</ul>
		</main>
	);
}
