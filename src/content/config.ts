import { defineCollection, reference, z } from "astro:content";

const authors = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    name: z.string(),
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    email: z.string(),
  }),
});

const blog = defineCollection({
  // Type-check frontmatter using a schema
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.object({
      src: z.string(),
      alt: z.string(),
    }),
    canonicalUrl: z.string().optional(),
    author: reference("authors"),
  }),
});

export const collections = { blog };
