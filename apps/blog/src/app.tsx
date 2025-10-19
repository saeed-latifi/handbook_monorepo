import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import { AuthChecker } from "./layout/AuthChecker";

export default function App() {
	return (
		<Router
			root={(props) => (
				<MetaProvider>
					<Suspense>
						<AuthChecker>{props.children}</AuthChecker>
					</Suspense>
				</MetaProvider>
			)}
		>
			<FileRoutes />
		</Router>
	);
}
