import type { Writable } from "svelte/store";

export interface AccordionProps {
  allowMultipleExpandedPanels?: boolean;
  forbidNoExpandedPanels?: boolean;
}

export interface CreateAccordionReturn {
  asAccordion: (node: HTMLElement) => void;
  react: (props: AccordionProps) => void;
}

export interface AccordionSectionProps {
  open?: boolean;
}

export interface CreateAccordionSectionReturn {
  asHeader: (node: HTMLElement) => void;
  react: (
    props: AccordionSectionProps
  ) => readonly [Record<string, string>, Record<string, string | undefined>];
  openStore: Writable<boolean>;
}

export interface AccordionContext {
  register: () => readonly [string, boolean];
  associateNode: (id: string, node: HTMLElement) => void;
  registeredPanels: number;
  requestChange: (id: string, newValue: boolean) => boolean;
  onForcedChange: (id: string, callback: (newOpen: boolean) => void) => void;
  forget: (id: string) => void;
}
