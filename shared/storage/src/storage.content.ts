import { PutObjectCommand } from "@aws-sdk/client-s3";
import { storage } from "./storage.client";

export interface StorageObjectCreateParams {
	bucket: string;
	path: string[];
	fileName: string;
	data: Uint8Array;
	contentType?: string;
	metadata?: Record<string, string>;
}

export async function storageContentCreate({ bucket, path, fileName, data, contentType, metadata }: StorageObjectCreateParams) {
	const key = path.join("/") + fileName;

	return await storage.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: data,
			ContentType: contentType,
			Metadata: metadata,
		})
	);
}
