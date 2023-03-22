import { Injectable } from '@nestjs/common';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {

  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('REGION'),
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
      },
    });
  }

  async generatePresignedUrlForUpload(filename: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('BUCKET_NAME'),
      Key: filename,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.configService.get('UPLOAD_URL_EXPIRE'),
    });
    return signedUrl;
  }

}