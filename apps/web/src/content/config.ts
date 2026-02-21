import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    github: z.string().optional(),
    liveUrl: z.string().optional(),
    paperUrl: z.string().optional(),
    image: z.string().optional(),
    metric: z.string().optional(),
    metricLabel: z.string().optional(),
    category: z.enum(['research', 'ml-ai', 'full-stack', 'devops', 'open-source']),
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    order: z.number(),
  }),
});

export const collections = { projects, experience };
