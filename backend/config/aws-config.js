const { S3Client } = require("@aws-sdk/client-s3");

// MinIO ke liye S3 connection setup
const s3 = new S3Client({
    region: "us-east-1",
    endpoint: "http://127.0.0.1:9000",
    credentials: {
        accessKeyId: "minioadmin",
        secretAccessKey: "minioadmin",
    },
    forcePathStyle: true // MinIO ke liye yeh true karna zaroori hota hai
});

// Aapke tutorial ki tarah bucket name bhi yahin define kar lete hain
const S3_BUCKET = "gitverse-storage";

// s3 aur bucket name dono ko export kar rahe hain
module.exports = { s3, S3_BUCKET };