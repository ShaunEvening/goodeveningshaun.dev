import { type CollectionEntry, getCollection } from "astro:content";

export type Blog = CollectionEntry<"blog">;

export const getBlogs = async (): Promise<Blog[]> =>
  await getCollection("blog", ({ data }) => {
    return import.meta.env.PROD ? data.isDraft !== true : true;
  });
