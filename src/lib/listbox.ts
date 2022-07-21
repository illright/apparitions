import type { Writable } from 'svelte/store';

interface CommonListboxProps {
  horizontal?: boolean;
  selectionFollowsFocus?: boolean;
  selectionStateAttribute?: 'aria-selected' | 'aria-checked';
  // TODO: accommodate for virtualized lists with attributes like 'aria-posinset'
}

interface SingleListboxProps<ValueType> extends CommonListboxProps {
  value?: ValueType | undefined;
  multiSelect?: false;
}

interface MultiListboxProps<ValueType extends Array<any>>
  extends CommonListboxProps {
  value?: ValueType;
  multiSelect: true;
}

type ListboxProps<ValueType> = ValueType extends Array<any>
  ? MultiListboxProps<ValueType>
  : SingleListboxProps<ValueType>;

interface CreateListboxReturn<ValueType> {
  asListbox: (node: HTMLElement) => void;
  sync: (props: ListboxProps<ValueType>) => Record<string, string | undefined>;
  valueStore: Writable<ValueType>;
}

export function createListbox<ValueType>(): CreateListboxReturn<ValueType> {
  return {} as any;
}

interface OptionProps {
  value: string;
}

interface CreateOptionReturn {
  asOption: (node: HTMLElement) => void;
  sync: (props: OptionProps) => Record<string, string | undefined>;
  selected: Writable<boolean>;
}

export function createOption(): CreateOptionReturn {
  return {} as any;
}

interface CreateOptionGroupReturn {
  optionGroupProps: Record<string, string | undefined>;
  label: (index?: number) => { id: string };
}

export function createOptionGroup(): CreateOptionGroupReturn {
  return { label: () => ({}) } as any;
}
