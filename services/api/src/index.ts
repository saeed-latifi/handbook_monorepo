import { serve } from "@hono/node-server";
import type { INewUser, IUser, IUserU } from "@repo/db/users";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
	"/*",
	cors({
		origin: "*", // Allow all origins (for development)
		// For production, specify allowed origins:
		// origin: ['https://yourdomain.com', 'http://localhost:3000'],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type"],
		maxAge: 86400,
	}),
);

app.get("/", (c) => {
	return c.json(newUser());
});

serve({ fetch: app.fetch, port: 3010 }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`);
});

function newUser() {
	const newUser: INewUser = { age: 32, email: "qweqwe", name: "234rwefsd" };
	console.log(newUser);
	return newUser;
}
