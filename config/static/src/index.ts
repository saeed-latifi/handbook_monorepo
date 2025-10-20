//app state "prod" | "dev"
export const appState = process.env.APP_STATE ?? "";

// db
export const dbURL = process.env.DATABASE_URL ?? "";

// storage
export const storageEndPoint = process.env.STORAGE_END_POINT ?? "";
export const storageRegion = process.env.STORAGE_REGION ?? "";
export const storageAccessKey = process.env.STORAGE_ACCESS_KEY ?? "";
export const storageSecretKey = process.env.STORAGE_SECRET_KEY ?? "";

// public storage
export const storageUrl = process.env.PUBLIC_STORAGE;

// tokens
export const tokenSession = process.env.TOKEN_SESSION ?? "";
export const tokenUser = process.env.TOKEN_USER ?? "";

// cookie
export const cookieKeySession = process.env.COOKIE_KEY_SESSION ?? "";
export const cookieKeyUser = process.env.COOKIE_KEY_USER ?? "";

export const cookieAgeSession = 360 * 24 * 60 * 60;
export const cookieAgeUser = 30 * 24 * 60 * 60;

// origins
export const origins = ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://saeedlatifi.ir"];

// ports
export const portRest = 3010;
export const portSocket = 3011;

// validations
export const userPasswordLength = 8;
export const phoneNumberLength = 11;

// mail
export const emailFrom = process.env.EMAIL_FROM;
export const emailUser = process.env.EMAIL_USER;
export const emailPassword = process.env.EMAIL_PASSWORD;
export const emailHost = process.env.EMAIL_HOST;
export const emailName = process.env.EMAIL_NAME;
