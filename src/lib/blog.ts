import { getCollection, type CollectionEntry } from 'astro:content';

export function formatDate(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export async function getPublishedPosts() {
  const posts = await getCollection('blog');
  return posts
    .filter((post) => post.data.draft !== true)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function groupPostsByCategory(posts: CollectionEntry<'blog'>[]) {
  const groups = new Map<string, CollectionEntry<'blog'>[]>();

  for (const post of posts) {
    const category = post.data.category ?? 'Uncategorized';
    const existing = groups.get(category) ?? [];
    existing.push(post);
    groups.set(category, existing);
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

export function postHref(post: CollectionEntry<'blog'>) {
  return `/blog/${post.id}`;
}

export function getSeriesKey(post: CollectionEntry<'blog'>): string | undefined {
  if (post.data.series) return post.data.series;
  const folder = post.id.split('/')[0];
  const seriesFolders = [
    'building-shadonet',
    'phd-journal',
    'research-notes',
    'paper-notes',
    'research-questions',
    'monthly-research-logs',
  ];
  if (seriesFolders.includes(folder)) {
    const categoryMap: Record<string, string> = {
      'building-shadonet': 'Building ShadoNet',
      'phd-journal': 'PhD Journal',
      'research-notes': 'Research Notes',
      'paper-notes': 'Paper Notes',
      'research-questions': 'Research Questions',
      'monthly-research-logs': 'Monthly Research Logs',
    };
    return categoryMap[folder] ?? folder;
  }
  return undefined;
}

export function getSeriesPosts(
  posts: CollectionEntry<'blog'>[],
  series: string,
): CollectionEntry<'blog'>[] {
  return posts
    .filter((post) => getSeriesKey(post) === series)
    .sort((a, b) => {
      if (a.data.seriesOrder !== undefined && b.data.seriesOrder !== undefined) {
        return a.data.seriesOrder - b.data.seriesOrder;
      }
      return a.data.date.valueOf() - b.data.date.valueOf();
    });
}

export function getSeriesNavigation(
  posts: CollectionEntry<'blog'>[],
  current: CollectionEntry<'blog'>,
): { prev?: CollectionEntry<'blog'>; next?: CollectionEntry<'blog'>; series?: string } {
  const series = getSeriesKey(current);
  if (!series) return {};

  const seriesPosts = getSeriesPosts(posts, series);
  const index = seriesPosts.findIndex((post) => post.id === current.id);
  if (index === -1) return { series };

  return {
    series,
    prev: index > 0 ? seriesPosts[index - 1] : undefined,
    next: index < seriesPosts.length - 1 ? seriesPosts[index + 1] : undefined,
  };
}

export function getRelatedPosts(
  posts: CollectionEntry<'blog'>[],
  current: CollectionEntry<'blog'>,
  limit = 3,
): CollectionEntry<'blog'>[] {
  if (current.data.related?.length) {
    const related = current.data.related
      .map((id) => posts.find((post) => post.id === id))
      .filter((post): post is CollectionEntry<'blog'> => Boolean(post));
    if (related.length > 0) return related.slice(0, limit);
  }

  const currentTags = new Set(current.data.tags ?? []);
  const currentCategory = current.data.category;

  const scored = posts
    .filter((post) => post.id !== current.id)
    .map((post) => {
      let score = 0;
      if (post.data.category === currentCategory) score += 3;
      for (const tag of post.data.tags ?? []) {
        if (currentTags.has(tag)) score += 2;
      }
      const folder = post.id.split('/')[0];
      const currentFolder = current.id.split('/')[0];
      if (folder === currentFolder) score += 1;
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.valueOf() - a.post.data.date.valueOf());

  return scored.slice(0, limit).map(({ post }) => post);
}

export const seriesOrderMap: Record<string, number> = {
  'building-shadonet/week-1-choosing-the-supervision-signal': 1,
  'building-shadonet/week-2-center-annotations-vs-segmentation-masks': 2,
  'building-shadonet/week-3-the-first-failed-experiments': 3,
  'building-shadonet/week-4-rethinking-the-loss-function': 4,
  'building-shadonet/week-5-why-morphology-became-the-central-idea': 5,
  'building-shadonet/week-6-lessons-from-debugging': 6,
  'building-shadonet/week-7-preparing-the-paper': 7,
};
