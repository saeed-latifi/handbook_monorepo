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

export async function onStorageInit(bucketName: string) {
	try {
		// Check if bucket exists
		const exists = await minioClient.bucketExists(bucketName);
		console.log(`Bucket "${bucketName}" exists: ${exists}`);

		if (!exists) {
			await minioClient.makeBucket(bucketName, "us-east-1");
			console.log(`Bucket "${bucketName}" created successfully`);
		}
	} catch (error) {
		console.error("Error managing bucket:", error);
		throw error; // Re-throw to handle upstream if needed
	}
}

export async function createSubFolder({ bucketName, folders, parents = [] }: { bucketName: string; folders: string[]; parents?: string[] }): Promise<boolean> {
	try {
		// Check if bucket exists
		const bucketExists = await minioClient.bucketExists(bucketName);
		if (!bucketExists) {
			throw new Error(`Bucket ${bucketName} does not exist`);
		}

		// Create parent path if provided
		let currentPath = "";
		for (const parent of parents) {
			currentPath = currentPath ? `${currentPath}${parent}/` : `${parent}/`;

			// Check if parent folder exists
			const parentObjects = await minioClient.listObjects(bucketName, currentPath, false).toArray();
			const parentExists = parentObjects.some((obj) => obj.prefix === currentPath);

			if (!parentExists) {
				await minioClient.putObject(bucketName, currentPath, Buffer.from(""));
				console.log(`Created parent folder: ${currentPath} in bucket: ${bucketName}`);
			}
		}

		// Process each folder
		for (const folder of folders) {
			// Construct full folder path with parents
			const folderPath = currentPath ? `${currentPath}${folder}/` : `${folder}/`;

			try {
				// Check if folder exists
				const objects = await minioClient.listObjects(bucketName, folderPath, false).toArray();
				const folderExists = objects.some((obj) => obj.prefix === folderPath);

				if (!folderExists) {
					// Create folder
					await minioClient.putObject(bucketName, folderPath, Buffer.from(""));
					console.log(`Created folder: ${folderPath} in bucket: ${bucketName}`);
				} else {
					console.log(`Folder already exists: ${folderPath} in bucket: ${bucketName}`);
				}
			} catch (error) {
				console.error(`Error processing folder ${folderPath}:`, error);
				throw error;
			}
		}

		return true;
	} catch (error) {
		console.error(`Error in createMinioSubFolders for bucket ${bucketName}:`, error);
		return false;
	}
}

interface BucketItem {
	name: string;
	isFolder: boolean;
	lastModified?: Date;
	size?: number;
	metadata?: Minio.ItemBucketMetadata;
}

export async function getContentList({ bucketName, paths = [] }: { bucketName: string; paths?: string[] }): Promise<BucketItem[]> {
	try {
		// Check if bucket exists
		const bucketExists = await minioClient.bucketExists(bucketName);
		if (!bucketExists) {
			throw new Error(`Bucket ${bucketName} does not exist`);
		}

		// Construct prefix from paths
		const prefix = paths.length > 0 ? paths.join("/") + "/" : "";

		// List objects with the given prefix
		const objectsStream = minioClient.listObjectsV2(bucketName, prefix, true);
		const items: BucketItem[] = [];

		// Process stream of objects
		for await (const obj of objectsStream) {
			const itemName = obj.name.replace(prefix, "").split("/")[0];
			if (!itemName) continue; // Skip empty names

			const isFolder = obj.name.endsWith("/");

			// Avoid duplicates
			if (!items.some((item) => item.name === itemName && item.isFolder === isFolder)) {
				items.push({
					name: itemName,
					isFolder,
					lastModified: obj.lastModified,
					size: obj.size,
					metadata: obj.metadata,
				});
			}
		}

		return items;
	} catch (error) {
		console.error(`Error listing contents for bucket ${bucketName} with prefix ${paths.join("/")}:`, error);
		throw error;
	}
}
