import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { middlewareUser, type IMiddlewareUser } from "./middlewares/middlewareUser";
import { cors } from "hono/cors";
// import { seedRootUser } from "./db/seed";
// import { userRoute } from "./routes/user/user.route";
import { middlewareSession } from "./middlewares/middlewareSession";
// import { publicRoutes } from "./routes/public.route";
// import { StorageRoute } from "./routes/storage/storage.route";
import { origins, portRest } from "@repo/config-static";
import { accountRoutes } from "./routes/account/account.route";
import { seedRootUser } from "@repo/shared-db";
import bcrypt from "bcryptjs";
import { publicRoutes } from "./routes/public/public.route";

async function main() {
	{
		const salt = await bcrypt.genSalt();
		const hash = await bcrypt.hash("1234", salt);

		const root = await seedRootUser({ password: hash });
		if (!root) throw new Error("no root user!");
	}

	const app = new Hono<IMiddlewareUser>().basePath("/api");
	app.use(
		"/*",
		cors({
			origin: origins,
			credentials: true,
		}),
	);

	app.route("/public", publicRoutes);

	app.use(middlewareSession);
	app.route("/account", accountRoutes);

	app.use(middlewareUser);
	// app.route("/user", userRoute);
	// app.route("/storage", StorageRoute);

	serve({ fetch: app.fetch, port: portRest }, (info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	});
}

main();
