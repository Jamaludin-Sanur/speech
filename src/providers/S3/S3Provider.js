import {
    S3Client,
    HeadBucketCommand,
    ListObjectsCommand,
    CreateBucketCommand,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand
} from "@aws-sdk/client-s3";

export class S3Provider {

    client = undefined;
    defaultBucketName = undefined;

    constructor({ accessKey, secretKey, bucketName }) {
        this.defaultBucketName = bucketName;
        this.client = new S3Client({
            region: 'ap-southeast-2',
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secretKey
            }
        });
    }

    isBucketExist = async ({ bucketName }) => {
        try {
            await this.client.send(new HeadBucketCommand({
                Bucket: bucketName || this.defaultBucketName,
            }));
            return true;
        } catch (error) {
            if (error["$metadata"].httpStatusCode === 404) {
                return false;
            }
            throw error;
        }
    };

    createBucket = async ({ bucketName }) => {
        try {
            if (this.isBucketExist({ bucketName })) return;
            const data = await this.client.send(new CreateBucketCommand({
                Bucket: bucketName || this.defaultBucketName,
            }));
            return data;
        } catch (err) {
            throw err;
        }
    };

    getObject = async ({ bucketName, key } = {}) => {
        try {
            // Get the object from the Amazon S3 bucket. It is returned as a ReadableStream.
            const data = await this.client.send(new GetObjectCommand({
                Bucket: bucketName || this.defaultBucketName,
                Key: key,
            }));
            return data.Body.transformToByteArray();
        } catch (err) {
            throw err;
        }
    };

    listObject = async ({ bucketName } = {}) => {
        try {
            const data = await this.client.send(new ListObjectsCommand({
                Bucket: bucketName || this.defaultBucketName,
            }));
            return data;
        } catch (err) {
            throw err;
        }
    };

    uploadObject = async ({ bucketName, filePath, file }) => {
        try {
            const data = await this.client.send(new PutObjectCommand({
                Bucket: bucketName || this.defaultBucketName,
                Key: filePath,
                Body: file
            }));
            return data;
        } catch (err) {
            throw err;
        }
    };

    deleteObject = async ({ bucketName, key } = {}) => {
        try {
            const data = await this.client.send(new DeleteObjectCommand({
                Bucket: bucketName || this.defaultBucketName,
                Key: key
            }));
            return data;
        } catch (err) {
            throw err;
        }
    };
}