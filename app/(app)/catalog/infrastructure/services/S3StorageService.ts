// Infrastructure Layer - S3 Storage Service
// Implements IStorageService using AWS S3 + CloudFront

import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { IStorageService } from '../../domain/services/IStorageService'

export class S3StorageService implements IStorageService {
    private readonly s3Client: S3Client
    private readonly bucketName: string
    private readonly cloudFrontUrl: string
    private readonly folder = 'item-images'

    constructor() {
        this.bucketName = process.env.S3_BUCKET_NAME!
        this.cloudFrontUrl = process.env.CLOUDFRONT_URL!

        this.s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        })
    }

    async uploadImage(file: File, identifier: string): Promise<string> {
        const fileExt = file.name.split('.').pop()
        const fileName = `${this.folder}/${identifier}-${Date.now()}.${fileExt}`

        const arrayBuffer = await file.arrayBuffer()
        const body = Buffer.from(arrayBuffer)

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: body,
                ContentType: file.type,
                CacheControl: 'public, max-age=31536000, immutable',
            })
        )

        return `https://${this.cloudFrontUrl}/${fileName}`
    }

    async deleteImage(url: string): Promise<void> {
        const key = this.extractKeyFromUrl(url)
        if (!key) return

        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            })
        )
    }

    private extractKeyFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url)
            return urlObj.pathname.slice(1) // Remove leading "/"
        } catch {
            return null
        }
    }
}
