import { Injectable } from '@nestjs/common';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {

  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('REGION'),
      credentials: {
        accessKeyId: this.configService.get('ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = this.configService.get('BUCKET_NAME')
  }

  async generatePresignedUrlForUpload(filename: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: filename,
    });
    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.configService.get('UPLOAD_URL_EXPIRE'),
    });
    return signedUrl;
  }

  async generatePresignedUrlForDownload(fileUrl: string):Promise<string>{
    if (!fileUrl){
      return ''
    }
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileUrl
    })

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: this.configService.get('DOWNLOAD_URL_EXPIRE'),
    }) 

    return signedUrl;
  }

}