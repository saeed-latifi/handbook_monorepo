import { Server } from "socket.io";

const io = new Server(3011, { cors: { origin: "*" } });

console.log("Server is running on port 3011...");

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	// Listen for "chat message" from client
	socket.on("chat", (msg) => {
		console.log("Message received:", msg);

		// Broadcast message to all connected clients
		io.emit("chat", msg);
	});

	// Optional: Handle disconnect
	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});
