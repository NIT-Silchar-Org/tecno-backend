import { S3Client } from "@aws-sdk/client-s3";

let s3: S3Client;
function initializeAWS() {
  s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    region: "ap-south-1",
  });
}

export { s3, initializeAWS };
