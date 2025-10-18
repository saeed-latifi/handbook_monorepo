import {
	CreateBucketCommand,
	HeadBucketCommand,
	ListBucketsCommand,
	DeleteBucketCommand,
	type HeadBucketCommandOutput,
	ListObjectsV2Command,
	GetBucketPolicyStatusCommand,
	PutBucketPolicyCommand,
} from "@aws-sdk/client-s3";
import { storage } from "./storage.client";

export async function storageBucketCreate(name: string, isPublic?: boolean) {
	try {
		return await storage.send(new HeadBucketCommand({ Bucket: name }));
	} catch (error: any) {
		if (error.name === "NotFound") {
			try {
				const bucket = await storage.send(new CreateBucketCommand({ Bucket: name, ACL: "public-read", ObjectLockEnabledForBucket: false }));

				await storage.send(
					new PutBucketPolicyCommand({
						Bucket: name,
						Policy: isPublic
							? JSON.stringify({
									Version: "2012-10-17",
									Statement: [
										{
											Effect: "Allow",
											Principal: { AWS: ["*"] },
											Action: ["s3:GetObject"],
											Resource: [`arn:aws:s3:::${name}/*`],
										},
									],
								})
							: undefined,
					}),
				);

				return bucket as HeadBucketCommandOutput;
			} catch (createError) {
				console.error({ createError });
			}
		} else {
			console.error(error);
		}
	}
}
export async function storageBucketList() {
	try {
		return (await storage.send(new ListBucketsCommand({}))).Buckets;
	} catch (error) {
		console.error("An unexpected error occurred:", error);
	}
}

export async function storageBucketDelete(name: string) {
	try {
		return (await storage.send(new DeleteBucketCommand({ Bucket: name }))).$metadata;
	} catch (error) {
		console.error(error);
	}
}

export async function StorageBucketDetail(bucketName: string, prefix?: string) {
	try {
		const info = await storage.send(new ListObjectsV2Command({ Bucket: bucketName, Prefix: prefix, Delimiter: "/" }));
		const policy = (await storage.send(new GetBucketPolicyStatusCommand({ Bucket: bucketName }))).PolicyStatus;

		return { ...info, policy };
	} catch (error) {
		console.error(`Error listing contents for bucket ${bucketName}:`, error);
	}
}
