import { DeleteObjectCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { storage } from "./storage.client";

interface args {
	bucketName: string;
	key: string;
}

export async function StorageFolderCreate({ bucketName, key }: args) {
	try {
		return await storage.send(new PutObjectCommand({ Bucket: bucketName, Key: key }));
	} catch (error) {
		console.error("❌ Error creating S3 folder:", error);
	}
}

export async function StorageFolderDelete({ bucketName, key }: args) {
	try {
		const listResponse = await storage.send(
			new ListObjectsV2Command({
				Bucket: bucketName,
				Prefix: key,
			}),
		);

		if (!listResponse.Contents || listResponse.Contents.length === 0) {
			console.log(`ℹ️ No objects found under ${key}`);
			return;
		}

		const paths = listResponse.Contents.reverse().map((obj) => ({ Key: obj.Key ?? "" }));

		for await (const item of paths) {
			console.log({ item });
			const del = await storage.send(new DeleteObjectCommand({ Bucket: bucketName, Key: item.Key, BypassGovernanceRetention: true }));
			console.log({ del });
		}

		return key;
	} catch (error) {
		console.error("❌ Error deleting S3 folder:", error);
	}
}
