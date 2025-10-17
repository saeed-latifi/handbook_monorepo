export function serverErrorLogger({ error, title, domain }: { error: any; title: string; domain: string }) {
	console.log({ error, title, domain });
}
