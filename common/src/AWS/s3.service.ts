import { Injectable } from '@nestjs/common';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';

@Injectable()
export class S3Service {

  private s3: S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
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
    const signedUrl = await getSignedUrl(this.s3, command, {
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

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: this.configService.get('DOWNLOAD_URL_EXPIRE'),
    }) 

    return signedUrl;
  }

  uploadFile(filePath: string, objectKey: string){  
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: createReadStream(filePath)
    };
    

    return this.s3.putObject(params);
  }
}