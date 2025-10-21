import { Server, type ExtendedError, Socket } from "socket.io";
import cookie from "cookie";
import { cookieKeySession, cookieKeyUser, origins } from "@repo/config-static";
import type { ISession, IUser } from "@repo/shared-types";
import { jwtVerifySession, jwtVerifyUser } from "@repo/shared-jwt";
import { modelSessionGetById, modelUserGetById } from "@repo/shared-db";
import { instrument } from "@socket.io/admin-ui";

const io = new Server(3011, {
	cors: {
		origin: origins, // ✅ specify your frontend origin
		credentials: true,
	},
});

console.log("Server is running on port 3011...");

instrument(io, {
	auth: false,
	mode: "development",
	namespaceName: "/admin",
});

const socketBase = io.of("/base");

socketBase.use(sessionMiddleware);

socketBase.on("connection", (socket) => {
	const rooms = socketBase.adapter.rooms;
	console.log(rooms);

	const startDate = Date.now();
	console.log("A Session connected at : ", startDate);

	// Listen for "chat message" from client
	socket.on("createMessage", ({ message, roomId }: { message: string; roomId: number }) => {
		console.log("Message received:", message, "in room ", roomId);
		// const roomUsers: number[] = modelRoomGetusers(roomId);

		// rooms.forEach((i) => {
		socketBase.emit("receiveMessage", message);
		// });
	});

	// Optional: Handle disconnect
	socket.on("disconnect", () => {
		const EndDate = Date.now();
		console.log("A Session disconnected at : ", EndDate, " fro : ", EndDate - startDate);
	});
});

export interface SocketWithSession extends Socket {
	session?: ISession;
	user?: IUser;
}

function userRoomId(userId: number) {
	return `:User:online:${userId}:`;
}

export async function sessionMiddleware(socket: SocketWithSession, next: (err?: ExtendedError) => void): Promise<void> {
	try {
		const cookies = cookie.parse(socket.handshake.headers.cookie ?? "");

		//session
		const sessionCookie = cookies[cookieKeySession];
		if (!sessionCookie) throw new Error("no cookie");

		const validTokenSession = await jwtVerifySession({ token: sessionCookie });
		if (typeof validTokenSession?.id !== "number") throw new Error("bad cookie");

		const session = await modelSessionGetById(validTokenSession.id);
		if (!session) throw new Error("error on find session");

		socket.session = session;

		// user;
		const userCookie = cookies[cookieKeyUser];
		if (userCookie) {
			const validTokenUser = await jwtVerifyUser({ token: userCookie });
			if (typeof validTokenUser?.id === "number") {
				const user = await modelUserGetById(validTokenUser.id);
				if (user) {
					socket.user = user;
					socket.join(userRoomId(user.id));
				}
			}
		}

		next();
	} catch (err) {
		console.error("❌ Error in session middleware:", err);
		next(new Error("Session middleware failed"));
	}
}
