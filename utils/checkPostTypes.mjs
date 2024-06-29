export default async function checkPostTypes({ media, type }) {
  if (type === "note" && media && media.length > 0) {
    throw new Error("Media is not allowed for notes.");
  }
  if (["image", `reel`].includes(type) && media && media.length < 1) {
    throw new Error("Media is Required.");
  }
  const resolvedMedia = await Promise.all(
    media.map(async (file) => {
      return await file.promise;
    })
  );
  if (type === "image" && resolvedMedia.some((file) => !file.mimetype.startsWith("image/"))) {
    throw new Error("Only image files are allowed for image type posts.");
  }
  if (type === "reel" && resolvedMedia.some((file) => !file.mimetype.startsWith("video/"))) {
    throw new Error("Only video files are allowed for reel type posts.");
  }
}

export const validateMimeType = async (file) => {
  if (!file) {
    throw new Error("Media is Required.");
  }
  const resolvedFile = await file.promise;
  // console.log({ resolvedFile });

  if (!resolvedFile.mimetype.startsWith("image/") && !resolvedFile.mimetype.startsWith("video/")) {
    throw new Error("Only image files are allowed.");
  }
};
