import s3 from "./index.mjs";
import slugify from "./../slugify.mjs";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { videoMimeTypes, imageMimeTypes } from "./mediaMimeTypes.mjs";
// Function to convert a string into a slug

const uploadFileToS3 = async (file) => {
  const resolvedFile = await file;
  let resolvedPromise = await resolvedFile?.promise;
  const { createReadStream, filename, mimetype } = resolvedPromise;
  const stream = createReadStream();

  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const slugifiedFilename = `${Date.now()}-${slugify(filename)}`;

  let params;
  if (mimetype.includes("image")) {
    params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: slugifiedFilename,
      Body: buffer,
      ContentType: mimetype,
    };
  } else if (mimetype.includes("video")) {
    params = {
      Bucket: process.env.AWS_S3_VIDEO_BUCKET_NAME,
      Key: slugifiedFilename,
      Body: buffer,
      ContentType: mimetype,
    };
  } else {
    throw new Error(`Unsupported file type: ${mimetype}`);
  }

  // Upload the file to S3
  let command = new PutObjectCommand(params);
  await s3.send(command);
  return slugifiedFilename;
};

const deleteFileFromS3 = async (key) => {
  try {
    let params;
    const mimetype = key.split(".").pop();

    console.log({ mimetype });
    if (imageMimeTypes.includes(mimetype)) {
      console.log(`image ==>`);

      params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      };
    } else if (videoMimeTypes.includes(mimetype)) {
      console.log(`vid ==>`);

      params = {
        Bucket: process.env.AWS_S3_VIDEO_BUCKET_NAME,
        Key: key,
      };
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }

    let command = new DeleteObjectCommand(params);
    await s3.send(command);
  } catch (err) {
    console.log(err);
    throw new Error(`Error while deleting old  avatar`);
  }
};

export { deleteFileFromS3 };
export default uploadFileToS3;
