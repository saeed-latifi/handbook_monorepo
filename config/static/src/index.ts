// db
export const dbURL = process.env.DATABASE_URL ?? "";

// storage
export const storageEndPoint = process.env.STORAGE_END_POINT ?? "";
export const storageRegion = process.env.STORAGE_REGION ?? "";
export const storageAccessKey = process.env.STORAGE_ACCESS_KEY ?? "";
export const storageSecretKey = process.env.STORAGE_SECRET_KEY ?? "";

// tokens
export const tokenSession = process.env.TOKEN_SESSION ?? "";
export const tokenUser = process.env.TOKEN_USER ?? "";

// cookie
export const cookieKeySession = process.env.COOKIE_KEY_SESSION ?? "";
export const cookieKeyUser = process.env.COOKIE_KEY_USER ?? "";

export const cookieAgeSession = 360 * 24 * 60 * 60;
export const cookieAgeUser = 30 * 24 * 60 * 60;

export const origins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://saeedlatifi.ir"];

export const portRest = 3010;

export * from "./response.type";
