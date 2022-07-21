import type { Writable } from 'svelte/store';

interface MenuBarProps {
  label: string;
  vertical?: boolean;
}

interface CreateMenuBarReturn {
  asMenuBar: (node: HTMLElement) => void;
  sync: (props: MenuBarProps) => Record<string, string | undefined>;
}

export function createMenuBar(): CreateMenuBarReturn {
  return {} as any;
}

interface CreateMenuReturn {
  menuProps: Record<string, string | undefined>;
}

export function createMenu(): CreateMenuReturn {
  return {} as any;
}

interface MenuItemProps {
  disabled?: boolean;
}

interface CreateMenuItemReturn {
  asMenuItem: (node: HTMLElement) => void;
  sync: (props: MenuItemProps) => Record<string, string | undefined>;
}

export function createMenuItem(): CreateMenuItemReturn {
  return {} as any;
}

interface MenuItemCheckboxProps extends MenuItemProps {
  checked?: boolean;
}

interface CreateMenuItemCheckboxReturn {
  asMenuItemCheckbox: (node: HTMLElement) => void;
  sync: (props: MenuItemCheckboxProps) => Record<string, string | undefined>;
  checkedStore: Writable<boolean>;
}

export function createMenuItemCheckbox(): CreateMenuItemCheckboxReturn {
  return {} as any;
}

interface MenuItemRadioProps extends MenuItemProps {
  checked?: boolean;
}

interface CreateMenuItemRadioReturn {
  asMenuItemRadio: (node: HTMLElement) => void;
  sync: (props: MenuItemRadioProps) => Record<string, string | undefined>;
  checkedStore: Writable<boolean>;
}

export function createMenuItemRadio(): CreateMenuItemRadioReturn {
  return {} as any;
}

interface MenuItemSeparatorProps {
  vertical?: boolean;
}

interface CreateMenuItemSeparatorReturn {
  sync: (props: MenuItemSeparatorProps) => Record<string, string | undefined>;
}

export function createMenuItemSeparator(): CreateMenuItemSeparatorReturn {
  return {} as any;
}
