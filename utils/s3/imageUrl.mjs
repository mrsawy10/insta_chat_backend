import s3 from "./index.mjs";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export default async function getPostsMedia({ posts }) {
  try {
    let postsWithMedia = await Promise.all(
      posts.map(async (post) => {
        let media = post?.postMedia.map((e) => e?.media);
        if (media?.length < 1) return post;

        let mediaWithUrl = await Promise.all(
          media.map(async (m) => {
            // console.log({ m });
            let command = new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: m?.path,
            });
            const url = await getSignedUrl(s3, command, { expiresIn: 3600 * 24 });
            return { ...m, path: url };
          })
        );

        let postWithMedia = {
          ...post,
          postMedia: post.postMedia.map((pm, index) => ({
            ...pm,
            media: mediaWithUrl[index],
          })),
        };

        return postWithMedia;
      })
    );

    return postsWithMedia;
  } catch (error) {
    console.log(error);
  }
}
