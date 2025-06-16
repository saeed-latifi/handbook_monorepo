import { serve } from "@hono/node-server";
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
	return c.json({ myData: "13" });
});

serve({ fetch: app.fetch, port: 3010 }, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`);
});
