import { Injectable, Logger } from '@nestjs/common';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Progress, Upload } from "@aws-sdk/lib-storage";
import { S3, PutObjectCommand, GetObjectCommand, PutObjectRequest, } from "@aws-sdk/client-s3";
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import stream from 'stream';
import { Observable } from 'rxjs';
import { HashAlgorithmEnum, HashDto } from '../dto/delivery/dto/delivery-item.dto';

@Injectable()
export class S3Service {

  private readonly logger = new Logger(S3Service.name);

  private s3: S3;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3 = new S3({
      region: this.configService.get('AWS_REGION'),
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

  async generatePresignedUrlForDownload(fileUrl: string): Promise<string> {

    if (!fileUrl) {
      return ''
    }
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: fileUrl
    })

    if (fileUrl.includes("cache-public")) {
      return `https://${this.bucketName}.s3.amazonaws.com/${fileUrl}`
    }

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: this.configService.get('DOWNLOAD_URL_EXPIRE'),
    })

    return signedUrl;
  }

  uploadFile(filePath: string, objectKey: string) {
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: createReadStream(filePath)
    };

    return this.s3.putObject(params);
  }

  uploadFileFromStream(stream: stream.Readable, objectKey: string, hash?: HashDto): Observable<number> {
    const hexToBase64 = (hex: string): string => {
      return Buffer.from(hex, 'hex').toString('base64');
    }

    const getChecksum = (hash: HashDto) => {
      if (hash) {
        switch (hash.algorithm) {
          case HashAlgorithmEnum.SHA256Hex:
            return { ChecksumSHA256: hexToBase64(hash.hash) }
          case HashAlgorithmEnum.SHA256Base64:
            return { ChecksumSHA256: hash.hash }
          default:
            return {}
        }
      }
    }

    const params: PutObjectRequest = {
      Bucket: this.bucketName,
      Key: objectKey,
      Body: stream,
      ...getChecksum(hash)
    };
    const fileUpload = new Upload({
      client: this.s3,
      params: params,
    })

    return new Observable(observer => {
      fileUpload.on("httpUploadProgress", (progress: Progress) => {
        observer.next(progress.loaded);
      });
      fileUpload.done()
        .then(() => observer.complete())
        .catch(err => observer.error(err));
    })
  }

  async deleteFile(objectKey: string) {
    this.logger.log(`Delete file ${objectKey} from s3`);
    const params = {
      Bucket: this.bucketName,
      Key: objectKey,
    };
    try {
      const res = await this.s3.deleteObject(params);
      this.logger.verbose(`Delete file ${objectKey} from s3 res: ${JSON.stringify(res)}`)
      return
    } catch (error) {
      this.logger.error(`Error deleting file ${objectKey} from s3, ${error}`);
      throw error
    }
  }
}