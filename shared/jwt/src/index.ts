import { jwtVerify, SignJWT } from "jose";
import { tokenSession, tokenUser } from "@repo/config-static";

const alg = "HS256";

// session
export async function jwtSignSession({ id, ip }: { ip: string; id: number }) {
	const jwt = await new SignJWT({ id, ip }).setProtectedHeader({ alg }).sign(new TextEncoder().encode(tokenSession));
	return jwt;
}

export async function jwtVerifySession({ token }: { token: string }) {
	const validToken = await jwtVerify(token, new TextEncoder().encode(tokenSession));
	return validToken.payload;
}

// user
export async function jwtSignUser({ id, name }: { name: string; id: number }) {
	const jwt = await new SignJWT({ id, name }).setProtectedHeader({ alg }).sign(new TextEncoder().encode(tokenUser));
	return jwt;
}

export async function jwtVerifyUser({ token }: { token: string }) {
	const validToken = await jwtVerify(token, new TextEncoder().encode(tokenUser));
	return validToken.payload;
}
