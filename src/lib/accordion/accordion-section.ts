import { getContext } from 'svelte';
import { get, writable } from 'svelte/store';

import { PropDiff } from '$lib/_prop-diff';

import { contextKey } from './context';
import type {
  AccordionContext,
  AccordionSectionProps,
  CreateAccordionSectionReturn,
} from './types';

export function createAccordionSection(): CreateAccordionSectionReturn {
  const ctx = getContext<AccordionContext>(contextKey);
  const [id, defaultOpenState] = ctx.register();

  const openStore = writable(defaultOpenState);
  const propDiff = new PropDiff<AccordionSectionProps>({ open: defaultOpenState });

  function react(props: AccordionSectionProps) {
    propDiff.compare(props, {
      open(newOpen) {
        const permission = ctx.requestChange(id, newOpen);
        if (permission) {
          openStore.set(newOpen);
        }
      }
    });

    return [
      {
        id: `${id}-header`,
        role: 'button',
        tabindex: '0',
        'aria-expanded': String(get(openStore)),
        'aria-controls': `${id}-panel`,
        // TODO: figure out a way to add `aria-disabled` when `ctx.requestChange` returns false
      },
      {
        id: `${id}-panel`,
        role: ctx.registeredPanels < 6 ? 'region' : undefined,
        'aria-labelledby': `${id}-header`,
      },
    ] as const;
  }

  function asHeader(node: HTMLElement) {
    const onClick = () => {
      const newOpen = !get(openStore);
      const permission = ctx.requestChange(id, newOpen);
      if (permission) {
        openStore.set(newOpen);
        node.setAttribute('aria-expanded', String(newOpen));
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        onClick();
      }
    };

    node.addEventListener('click', onClick);
    node.addEventListener('keyup', onKeyUp);

    ctx.associateNode(id, node);
    ctx.onForcedChange(id, (newOpen) => {
      openStore.set(newOpen);
      node.setAttribute('aria-expanded', String(newOpen));
    });

    return {
      destroy() {
        ctx.forget(id);
        node.removeEventListener('click', onClick);
        node.removeEventListener('keyup', onKeyUp);
      }
    }
  }

  return { openStore, react, asHeader };
}
