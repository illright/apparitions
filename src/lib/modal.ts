interface CreateModalReturn {
  asOverlay: (node: HTMLElement) => void;
  modalProps: Record<string, string>;
}

export function createModal(): CreateModalReturn {
  return {} as any;
}
