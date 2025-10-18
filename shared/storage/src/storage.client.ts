import { S3Client } from "@aws-sdk/client-s3";
import { storageEndPoint, storageAccessKey, storageRegion, storageSecretKey } from "@repo/config-static";

export const storage = new S3Client({
	endpoint: storageEndPoint,
	region: storageRegion,
	credentials: {
		accessKeyId: storageAccessKey,
		secretAccessKey: storageSecretKey,
	},
	forcePathStyle: true, // Must be enabled for RustFS compatibility
	retryMode: "standard",
	logger: console, // will log all requests/responses
});
