import { storageEndPoint, storageAccessKey, storagePort, storageSecretKey } from "@repo/config-static";
import * as Minio from "minio";

console.log({ storageEndPoint, storagePort, storageAccessKey, storageSecretKey });
const minioClient = new Minio.Client({
	endPoint: storageEndPoint ?? "",
	port: parseInt(storagePort ?? ""),
	accessKey: storageAccessKey ?? "",
	secretKey: storageSecretKey ?? "",
	useSSL: false,
});

export async function onStorageInit() {
	const exists = await minioClient.bucketExists("test");
	console.log({ exists });
}
