import { sleep } from "@repo/shared-utils";
import { io, Socket } from "socket.io-client";
import { socketURL } from "~/statics";

function unSafeSocketManager() {
	return SocketManager.getInstance();
}

// AuthManager.tsx
class SocketManager {
	private static instance: SocketManager;
	private readonly socket: Socket = io(socketURL + "/base", { withCredentials: true });

	private constructor() {}

	public static getInstance(): Socket {
		if (!SocketManager.instance) {
			console.log("created!");
			SocketManager.instance = new SocketManager();
		}

		return SocketManager.instance.socket;
	}
}

export default function useSocket() {
	const socket = unSafeSocketManager();

	function onEmit<T, G>({ path, args }: { path: string; args?: G }): Promise<T> {
		return new Promise((resolve, _reject) => {
			socket.emit(path, args, (res: T) => {
				resolve(res);
			});
		});
	}

	async function onResetSocketConnection() {
		socket.disconnect();
		await sleep(200);
		socket.connect();
	}

	return { socket: socket as Socket, onEmit, onResetSocketConnection };
}
