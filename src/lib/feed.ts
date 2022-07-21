interface FeedProps {
  length: number | undefined;
  // TODO: implement virtualization
}

interface CreateFeedReturn {
  asFeed: (node: HTMLElement) => void;
  sync: (props: FeedProps) => Record<string, string | undefined>;
}

export function createFeed(): CreateFeedReturn {
  return {} as any;
}

interface ArticleProps {
  positionInFeed: number;
}

interface CreateArticleReturn {
  sync: (props: ArticleProps) => Record<string, string | undefined>;
  label: (index?: number) => { id: string };
  description: (index?: number) => { id: string };
}

export function createArticle(): CreateArticleReturn {
  return {} as any;
}
