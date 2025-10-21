import { Button } from "@repo/shared-ui/buttons/button";
import { Title } from "@solidjs/meta";
import { io } from "socket.io-client";
import { createSignal, onMount } from "solid-js";
import useSocket from "~/hooks/useSocket";
import { socketURL } from "~/statics";

type Message = string;

export default function Home() {
	const [input, setInput] = createSignal("");
	const [messages, setMessages] = createSignal<Message[]>([]);
	const { socket, onEmit } = useSocket();
	// const socket = io(socketURL + "/base", { withCredentials: true });

	onMount(() => {
		console.log("mounted");

		socket.on("receiveMessage", (msg: Message) => {
			console.log({ msg });

			setMessages((prev) => [msg, ...prev]);
		});
	});

	function sendMessage() {
		const trimmed = input().trim();
		if (trimmed) {
			onEmit({ path: "createMessage", args: { message: trimmed, roomId: 1 } });
			setInput("");
		}
		// if (trimmed) {
		// 	// onEmit({ path: "createMessage", args: { message: trimmed, roomId: 1 } });
		// 	socket.emit("createMessage", { message: trimmed, roomId: 1 });
		// 	setInput("");
		// }
	}

	async function fetchSample() {
		const response = await fetch("http://localhost:3010/api/public/test");
		const data = await response.json();
		console.log({ data });
	}

	return (
		<main>
			<Title>blog</Title>

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
