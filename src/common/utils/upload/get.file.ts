import { RequestHandler } from "express";
import { s3Service } from "@services";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

export const fetchAndDownloadFile: RequestHandler = async (req, res) => {
  const { download, fileName } = req.query as {
    download: string;
    fileName: string;
  };
  const { path } = req.params as { path: string[] };
  const Key = path.join("/");
  const { Body, ContentType } = await s3Service.getFile(Key);
  res.setHeader("Content-Type", ContentType || "application/octet-stream");
  res.set("Cross-Origin-Resource-Policy", "cross-origin");
  if (download === "true") {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileName || Key.split("/").pop()}"`,
    );
  }
  return await promisify(pipeline)(Body as NodeJS.ReadableStream, res);
};

export const fetchAndDownloadPreSigned: RequestHandler = async (req, res) => {
  const { download, fileName } = req.query as {
    download: string;
    fileName: string;
  };
  const { path } = req.params as { path: string[] };
  const Key = path.join("/");
  const url = await s3Service.getPreSignedUrl({
    Key,
    download,
    fileName,
  });

  return res.json({ url });
};
