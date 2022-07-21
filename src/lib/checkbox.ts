import type { Writable } from 'svelte/store';

interface CheckboxProps {
  checked: boolean | undefined;
  disabled: boolean;
}

interface CreateCheckboxReturn {
  asCheckbox: (node: HTMLElement) => void;
  sync: (props: CheckboxProps) => Record<string, string | undefined>;
  checkedStore: Writable<boolean>;
}

export function createCheckbox(): CreateCheckboxReturn {
  return {} as any;
}

interface CreateCheckboxGroupReturn {
  checkboxGroupProps: Record<string, string | undefined>;
  label: (index?: number) => { id: string };
  description: (index?: number) => { id: string };
}

export function createCheckboxGroup(): CreateCheckboxGroupReturn {
  return {} as any;
}
