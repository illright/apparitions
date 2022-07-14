interface AccordionProps {
  singleExpansion: boolean;
}

interface CreateAccordionReturn {
  sync: (props: AccordionProps) => Record<string, string>;
}

export function createAccordion(): CreateAccordionReturn {
  return {} as any;
}

interface AccordionSectionProps {
  open: boolean;
}

interface CreateAccordionSectionReturn {
  asHeader: (node: HTMLElement) => void;
  sync: (props: AccordionSectionProps) => [Record<string, string>, Record<string, string>];
}

export function createAccordionSection(): CreateAccordionSectionReturn {
  return {} as any;
}
