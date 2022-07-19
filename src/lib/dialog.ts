interface DialogProps {
  alert?: boolean;
}

interface CreateDialogReturn {
  asDialog: (node: HTMLElement) => void;
  sync: (props: DialogProps) => Record<string, string>;
  label: (index?: number) => { id: string; }
  description: (index?: number) => { id: string; }
}

export function createDialog(): CreateDialogReturn {
  return {} as any;
}
