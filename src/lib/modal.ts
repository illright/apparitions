interface ModalProps {
  open: boolean;
  focusOnOpen?: HTMLElement;
  returnFocusTo?: HTMLElement;
}

interface CreateModalReturn {
  asOverlay: (node: HTMLElement) => void;
  sync: (props: ModalProps) => Record<string, string>;
}

export function createModal(): CreateModalReturn {
  return {} as any;
}
