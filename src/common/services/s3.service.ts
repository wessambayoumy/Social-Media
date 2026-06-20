import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import env from "./env.service.js";
import { v4 } from "uuid";
import { BadRequestError } from "@response";
import { UploadStorageEnum } from "@enums";
import { createReadStream } from "node:fs";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
class S3Service {
  private readonly client = new S3Client({
    region: env.awsRegion,
    credentials: {
      accessKeyId: env.awsAccessKeyId,
      secretAccessKey: env.awsSecretAccessKey,
    },
  });

  setKey({
    path,
    originalname,
  }: {
    path: string;
    originalname: string;
  }): string {
    return `${env.appName}/${path}/${v4()}__${originalname}`;
  }

  async uploadOneFile({
    file,
    path,
    ContentType,
    storageType = UploadStorageEnum.memory,
  }: {
    file: Express.Multer.File;
    path: string;
    ContentType?: string | undefined;
    storageType?: UploadStorageEnum;
  }): Promise<string> {
    let command = undefined;
    if (file.size < 5 * 1024 * 1024) {
      command = new PutObjectCommand({
        Bucket: env.awsBucketName,
        ACL: ObjectCannedACL.private,
        Key: this.setKey({ path, originalname: file.originalname }),
        Body:
          storageType == UploadStorageEnum.memory
            ? file.buffer
            : createReadStream(file.path),
        ContentType: file.mimetype || ContentType,
      });
      if (!command.input.Key) throw new BadRequestError("Failed to Upload");
      await this.client.send(command);
      return command.input.Key;
    }
    command = new Upload({
      client: this.client,
      params: {
        Bucket: env.awsBucketName,
        ACL: ObjectCannedACL.private,
        Key: this.setKey({ path, originalname: file.originalname }),
        Body:
          storageType == UploadStorageEnum.memory
            ? file.buffer
            : createReadStream(file.path),
        ContentType: file.mimetype || ContentType,
      },
    });
    command.on("httpUploadProgress", (progress) => {
      console.log(progress);
      console.log(
        `Upload Progress:${((progress.loaded as number) / (progress.total as number)) * 100}`,
      );
    });
    return (await command.done()) as unknown as string;
  }

  async uploadManyFiles({
    files,
    path,
    ContentType,
    storageType = UploadStorageEnum.memory,
  }: {
    files: Express.Multer.File[];
    path: string;
    ContentType?: string;
    storageType?: UploadStorageEnum;
  }): Promise<string[]> {
    return await Promise.all(
      files.map((file) =>
        this.uploadOneFile({ file, path, ContentType, storageType }),
      ),
    );
  }

  async createPresignedUrl({
    expiresIn = env.awsPresignExpiry,
    originalname,
    path,
    ContentType,
  }: {
    expiresIn?: number;
    originalname: string;
    path: string;
    ContentType: string;
  }) {

    const command = new PutObjectCommand({
      Bucket: env.awsBucketName,
      ContentType,
      Key:this.setKey({ path, originalname }),
    });

    return {
      url: await getSignedUrl(this.client, command, { expiresIn }),
      Key: command.input.Key as string,
    };
  }

  async getFile(Key: string) {
    return await this.client.send(
      new GetObjectCommand({ Bucket: env.awsBucketName, Key }),
    );
  }

  async getPreSignedUrl({
    Key,
    download,
    fileName,
  }: {
    Key: string;
    download: string;
    fileName: string;
  }) {
    return await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: env.awsBucketName,
        Key,
        ResponseContentDisposition:
          download === "true"
            ? `attachment; filename="${fileName || Key.split("/").pop()}"`
            : undefined,
      }),
      {
        expiresIn: env.awsPresignExpiry,
      },
    );
  }

  async deleteOneFile(Key: string) {
    return await this.client.send(
      new DeleteObjectCommand({ Bucket: env.awsBucketName, Key }),
    );
  }
  async deleteManyFiles(Keys:string[]) {
    const Objects = Keys.map((Key) => ({ Key }))
    return await this.client.send(
      new DeleteObjectsCommand({
        Bucket: env.awsBucketName,
        Delete: { Objects },
      }),
    );
  }

  async deleteFolder(Prefix: string) {
    const list = await this.client.send(
      new ListObjectsV2Command({
        Bucket: env.awsBucketName,
        Prefix: `${env.appName}/${Prefix}`,
      }),
    );
    const Keys = list?.Contents?.map((obj) => {
      return obj.Key as string;
    });

    return await this.deleteManyFiles(Keys as string[]);
  }
}

export default new S3Service();
