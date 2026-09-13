export interface BookTopicLink {
  slug: string;
  title: string;
  reason: string;
}

interface TopicInput {
  slug: string;
  title: string;
  domain?: string;
  domains?: readonly string[];
  books?: readonly {
    title: string;
    slug?: string;
    status: string;
    reading: string;
    reason: string;
  }[];
}

export function buildBookTopicIndex(
  topics: readonly TopicInput[],
  knownBookSlugs: ReadonlySet<string>,
): Map<string, BookTopicLink[]>;

export function bookPageHash(sourceHash: string, relatedTopics: readonly BookTopicLink[]): string;
