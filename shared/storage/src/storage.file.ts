import { GetObjectCommand, PutObjectAclCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { storage } from "./storage.client";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

type downloadProps = {
	bucketName: string;
	key: string;
};

export async function StorageFileMakePrivate({ bucketName, key }: downloadProps) {
	const command = new PutObjectAclCommand({ Bucket: bucketName, Key: key });
	const signedUrl = await storage.send(command);
	return signedUrl;
}

export async function StorageFileDownloadLink({ bucketName, key }: downloadProps) {
	const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
	const signedUrl = await getSignedUrl(storage, command, { expiresIn: 120 });
	return signedUrl;
}

type uploadProps = {
	parents?: string[] | undefined;
	contentType?: string | undefined;
	metadata?: { [x: string]: string } | undefined;
	bucketName: string;
	fileName: string;
};

export async function StorageFileUploadLink({ bucketName, fileName, contentType, metadata, parents }: uploadProps) {
	const pathSegments = [...(parents ?? []), fileName];
	const fileKey = pathSegments.join("/");

	const command = new PutObjectCommand({ Bucket: bucketName, Key: fileKey, ContentType: contentType, Metadata: metadata });

	const url = await getSignedUrl(storage, command, { expiresIn: 360 });
	return url;
}
