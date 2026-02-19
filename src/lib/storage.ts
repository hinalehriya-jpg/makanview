import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// ─── Configuration ───

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const USE_S3 = IS_PRODUCTION && !!process.env.AWS_S3_BUCKET;

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// S3 config (only used in production)
function getS3Client() {
  return new S3Client({
    region: process.env.AWS_S3_REGION || "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || "",
    },
  });
}

function getS3Bucket() {
  return process.env.AWS_S3_BUCKET || "";
}

function getS3PublicUrl(key: string) {
  const cdn = process.env.AWS_S3_CDN_URL;
  if (cdn) {
    // CloudFront or custom domain: https://cdn.makanview.com/uploads/file.jpg
    return `${cdn.replace(/\/$/, "")}/${key}`;
  }
  const bucket = getS3Bucket();
  const region = process.env.AWS_S3_REGION || "ap-south-1";
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

// ─── Public API ───

export interface UploadResult {
  /** The public URL to access the image */
  url: string;
  /** The storage key (S3 key or local filename) */
  key: string;
}

/**
 * Sanitize file extension to prevent path traversal.
 */
function sanitizeExt(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  return ext.replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
}

/**
 * Upload a file to storage (S3 in production, disk in dev).
 */
export async function uploadFile(
  propertyId: string,
  file: File
): Promise<UploadResult> {
  const ext = sanitizeExt(file.name);
  const uniqueName = `${propertyId}-${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (USE_S3) {
    return uploadToS3(uniqueName, buffer, file.type);
  } else {
    return uploadToDisk(uniqueName, buffer);
  }
}

/**
 * Delete a file from storage by its URL.
 */
export async function deleteFile(url: string): Promise<void> {
  if (USE_S3) {
    return deleteFromS3(url);
  } else {
    return deleteFromDisk(url);
  }
}

/**
 * Check if a URL is a managed upload (vs. a demo/external image).
 */
export function isManagedUpload(url: string): boolean {
  if (url.startsWith("/uploads/")) return true;
  if (url.includes(getS3Bucket())) return true;
  const cdn = process.env.AWS_S3_CDN_URL;
  if (cdn && url.startsWith(cdn)) return true;
  return false;
}

// ─── S3 Implementation ───

async function uploadToS3(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<UploadResult> {
  const s3 = getS3Client();
  const key = `uploads/${filename}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: getS3Bucket(),
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=2592000, immutable",
    })
  );

  const url = getS3PublicUrl(key);
  return { url, key };
}

async function deleteFromS3(url: string): Promise<void> {
  try {
    const s3 = getS3Client();

    // Extract key from URL
    let key: string;
    const cdn = process.env.AWS_S3_CDN_URL;
    if (cdn && url.startsWith(cdn)) {
      key = url.replace(cdn.replace(/\/$/, "") + "/", "");
    } else {
      // https://bucket.s3.region.amazonaws.com/uploads/file.jpg → uploads/file.jpg
      const urlObj = new URL(url);
      key = urlObj.pathname.replace(/^\//, "");
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: getS3Bucket(),
        Key: key,
      })
    );
  } catch (err) {
    console.error("[Storage] Failed to delete from S3:", err);
  }
}

// ─── Local Disk Implementation ───

async function uploadToDisk(
  filename: string,
  buffer: Buffer
): Promise<UploadResult> {
  await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });

  const filePath = path.join(LOCAL_UPLOAD_DIR, filename);
  await fs.writeFile(filePath, buffer);

  return { url: `/uploads/${filename}`, key: filename };
}

async function deleteFromDisk(url: string): Promise<void> {
  try {
    if (!url.startsWith("/uploads/")) return;
    const filePath = path.join(process.cwd(), "public", url);
    await fs.unlink(filePath).catch(() => {});
  } catch (err) {
    console.error("[Storage] Failed to delete from disk:", err);
  }
}








