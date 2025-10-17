import { serve } from "@hono/node-server";
import http from "node:http";
import { Hono } from "hono";
import { middlewareUser, type IMiddlewareUser } from "./middlewares/middlewareUser";
import { cors } from "hono/cors";
import { accountRoute } from "./routes/account.route";
import { seedRootUser } from "./db/seed";
import { userRoute } from "./routes/user/user.route";
import { middlewareSession } from "./middlewares/middlewareSession";
import { publicRoutes } from "./routes/public.route";
import { StorageRoute } from "./routes/storage/storage.route";
import { origins, portRest } from "@repo/config-static";

async function main() {
	const root = await seedRootUser();
	if (!root) throw new Error("no root user!");

	const app = new Hono<IMiddlewareUser>().basePath("/api");
	app.use(
		"/*",
		cors({
			origin: origins,
			credentials: true,
		}),
	);

	app.route("/public", publicRoutes());

	app.use(middlewareSession);
	app.route("/account", accountRoute);

	app.use(middlewareUser);
	app.route("/user", userRoute);
	app.route("/storage", StorageRoute);

	serve({ fetch: app.fetch, port: portRest }, (info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	});
}

main();
