import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {S3Client, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
const client = new S3Client({});

function getBucketName(): string {
  const bucket = process.env.UPLOAD_BUCKET_NAME;
  if (!bucket) throw new Error("UPLOAD_BUCKET_NAME environment variable is not defined");
  return bucket;
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE_SIZE = 10*1024*1024; // 10 MB
const MAX_VIDEO_SIZE = 100*1024*1024; // 100 MB





export function validateUpload(contentType: string, fileSize: number) {
    const isImage = ALLOWED_IMAGE_TYPES.includes(contentType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(contentType);
    if (!isImage && !isVideo) {
        throw new Error("Invalid file type: " + contentType);
    }
    if (isImage && fileSize > MAX_IMAGE_SIZE) {
        throw new Error("File size exceeds the 10 MB maximum limit for images");
    }
    if (isVideo && fileSize > MAX_VIDEO_SIZE) {
        throw new Error("File size exceeds the 100 MB maximum limit for videos");
    }
    return {isImage, isVideo};
}

export async function getPresignedUploadUrls( key: string, contentType: string, fileSize: number ) {
    validateUpload(contentType, fileSize);
    const putObjectCommand = new PutObjectCommand({
        Bucket: getBucketName(),
        Key: key,
        ContentType: contentType,
        ContentLength: fileSize,
    });


    const putObjectUrl = await getSignedUrl(
        client, putObjectCommand, { expiresIn: 300 });
    return {putObjectUrl, key: key};

}

export async function getPresignedDownloadUrl(key: string) {
    const getObjectCommand = new GetObjectCommand({
        Bucket: getBucketName(),
        Key: key,
    });
    return await getSignedUrl(client, getObjectCommand, { expiresIn: 3600 });
}

export function getPublicUrl(key: string) {
   const cdnDomain = process.env.UPLOAD_CDN_DOMAIN;
  if (cdnDomain) {
    return `https://${cdnDomain}/${key}`;
  }
  return getPresignedDownloadUrl(key);
}
