import type { Writable } from "svelte/store";

interface ToggleButtonProps {
  disabled?: boolean;
  selected?: boolean;
}

interface CreateToggleButtonReturn {
  asToggleButton: (node: HTMLElement) => void;
  sync: (props: ToggleButtonProps) => Record<string, string | undefined>;
  pressed: Writable<boolean>;
  selectedStore: Writable<boolean>;
}

export function createToggleButton(): CreateToggleButtonReturn {
  return {} as any;
}
