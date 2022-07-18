import type { Writable } from 'svelte/store';

interface ComboboxProps {
  value: string;
  required?: boolean;
  editable?: boolean;
}

interface CreateComboboxReturn {
  asCombobox: (node: HTMLElement) => void;
  sync: (props: ComboboxProps) => Record<string, string | undefined>;
  valueStore: Writable<string>;
}

export function createCombobox(): CreateComboboxReturn {
  return {} as any;
}
