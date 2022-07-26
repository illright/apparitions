import { setContext } from 'svelte';

import { PropDiff } from '$lib/_prop-diff';

import { contextKey } from './context';
import type {
  AccordionContext,
  AccordionProps,
  CreateAccordionReturn,
} from './types';

interface RegisteredPanel {
  open: boolean;
  change: ((newOpen: boolean) => void) | undefined;
  node: HTMLElement | undefined;
}

export function createAccordion(): CreateAccordionReturn {
  const registeredPanels = new Map<string, RegisteredPanel>();
  const ctx: AccordionContext = {
    registeredPanels: 0,
    register() {
      this.registeredPanels++;
      const id = `panel-${this.registeredPanels}`;
      const defaultOpen =
        (propDiff.props.forbidNoExpandedPanels &&
          this.registeredPanels === 1) ??
        false;
      registeredPanels.set(id, {
        open: defaultOpen,
        change: undefined,
        node: undefined,
      });
      return [
        id,
        defaultOpen,
      ] as const;
    },
    associateNode(id: string, node: HTMLElement) {
      const panel = registeredPanels.get(id);
      if (panel !== undefined) {
        panel.node = node;
      }
    },
    onForcedChange(id: string, callback: (newOpen: boolean) => void) {
      const panel = registeredPanels.get(id);
      if (panel !== undefined) {
        panel.change = callback;
      }
    },
    requestChange(requestedId: string, newOpen: boolean) {
      if (newOpen === true && !propDiff.props.allowMultipleExpandedPanels) {
        for (const panel of registeredPanels.values()) {
          if (panel.open) {
            panel.open = false
            panel.change?.(false);
          }
        }
      } else if (newOpen === false && propDiff.props.forbidNoExpandedPanels) {
        let allowedToClose = false;
        for (const [id, panel] of registeredPanels) {
          if (id !== requestedId && panel.open) {
            allowedToClose = true;
          }
        }
        if (!allowedToClose) {
          return false;
        }
      }

      const panel = registeredPanels.get(requestedId);
      if (panel !== undefined) {
        panel.open = newOpen;
      }
      return true;
    },
    forget(id: string) {
      registeredPanels.delete(id);
    },
  };
  setContext<AccordionContext>(contextKey, ctx);

  const propDiff = new PropDiff<AccordionProps>({
    allowMultipleExpandedPanels: true,
    forbidNoExpandedPanels: false,
  });

  function react(props: AccordionProps) {
    propDiff.compare(props, {
      allowMultipleExpandedPanels(newValue, oldValue) {
        if (newValue === false && oldValue === true) {
          let toleranceForOpenPanels = true;
          for (const panel of registeredPanels.values()) {
            if (panel.open && !toleranceForOpenPanels) {
              panel.open = false;
              panel.change?.(panel.open);
            }
          }
        }
      },
      forbidNoExpandedPanels(newValue, oldValue) {
        if (newValue === true && oldValue === false) {
          const panel = registeredPanels.values().next().value as RegisteredPanel;
          if (panel !== undefined) {
            panel.open = true;
            panel.change?.(panel.open);
          }
        }
      }
    });
  }

  function asAccordion(node: HTMLElement) {
    const onKeyUp = (event: KeyboardEvent) => {
      const panelIds = Array.from(registeredPanels.keys());
      switch (event.key) {
        case 'ArrowUp': {
          const focusedPanelIndex = panelIds.findIndex(id => registeredPanels.get(id)?.node === document.activeElement);
          registeredPanels.get(panelIds[Math.max(focusedPanelIndex - 1, 0)])?.node?.focus();
          break;
        }
        case 'ArrowDown': {
          const focusedPanelIndex = panelIds.findIndex(id => registeredPanels.get(id)?.node === document.activeElement);
          registeredPanels.get(panelIds[Math.min(focusedPanelIndex + 1, panelIds.length - 1)])?.node?.focus();
          break;
        }
        case 'Home': {
          registeredPanels.get(panelIds[0])?.node?.focus();
          break;
        }
        case 'End': {
          registeredPanels.get(panelIds[panelIds.length - 1])?.node?.focus();
          break;
        }
      }
    };

    node.addEventListener('keyup', onKeyUp);

    return {
      destroy() {
        node.removeEventListener('keyup', onKeyUp);
      }
    }
  }

  return { asAccordion, react };
}
