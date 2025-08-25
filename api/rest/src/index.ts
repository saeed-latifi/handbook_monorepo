import { serve } from "@hono/node-server";
import type { INewUser } from "@repo/shared-db/users";
import { getContentList, onStorageInit } from "@repo/shared-storage";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();
onStorageInit("red");
test();

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

app.get("/", async (c) => {
	await test();
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

async function test() {
	const data = await getContentList({ bucketName: "red" });
	// const w = await createSubFolder({ bucketName: "red", folders: ["ee", "ff"], parents: ["a", "b", "c"] });
	console.log({ data });
}
