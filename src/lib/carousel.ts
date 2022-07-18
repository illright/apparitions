import type { Writable } from 'svelte/store';

interface SlideStore extends Writable<number> {
  length: number;
  next(): void;
  prev(): void;
}

interface CarouselProps {
  region: boolean;
  tabbed: boolean;
  autoRotate?: number;
}

interface CreateCarouselReturn {
  asCarousel: (node: HTMLElement) => void;
  sync: (
    props: CarouselProps
  ) => [Record<string, string | undefined>, Record<string, string | undefined>];
  currentSlide: SlideStore;
}

export function createCarousel(): CreateCarouselReturn {
  return {} as any;
}

interface CreateSlideReturn {
  slideProps: Record<string, string | undefined>;
}

export function createSlide(): CreateSlideReturn {
  return {} as any;
}
