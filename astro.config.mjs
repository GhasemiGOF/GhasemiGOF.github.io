import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://ghasemigof.github.io',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkGfm],
    shikiConfig: {
      theme: 'github-light',
    },
  },
  redirects: {
    '/blog/building-shadonet/week-1-choosing-the-supervision-signal': '/projects/shadonet',
    '/blog/building-shadonet/week-2-center-annotations-vs-segmentation-masks': '/projects/shadonet',
    '/blog/building-shadonet/week-3-the-first-failed-experiments': '/projects/shadonet',
    '/blog/building-shadonet/week-4-rethinking-the-loss-function': '/projects/shadonet',
    '/blog/building-shadonet/week-5-why-morphology-became-the-central-idea': '/projects/shadonet',
    '/blog/building-shadonet/week-6-lessons-from-debugging': '/projects/shadonet',
    '/blog/building-shadonet/week-7-preparing-the-paper': '/projects/shadonet',
  },
});
