import type { EventDispatcher, SvelteActionOutput } from './types';
import { keyboardEventIsPress } from './utils/keyboard';

export interface ButtonOptions<EventMap extends ButtonEvents> {
	dispatch: EventDispatcher<EventMap>;
	disabled?: boolean;
	type?: string;
	href?: string;
	target?: string;
	rel?: string;
}

export interface ButtonEvents {
	press: undefined;
}

export interface AttributesForButton {
	type: string;
	disabled?: boolean;
}

export interface AttributesForOther {
	role: 'button';
	tabIndex?: number;
	href?: string;
	target?: string;
	type?: string;
	disabled?: boolean;
	rel?: string;
	'aria-disabled'?: boolean;
}

export type SetAttributes = AttributesForButton | AttributesForOther;

function getAttributesForNode<EventMap extends ButtonEvents>(nodeName: string, options: ButtonOptions<EventMap>): SetAttributes {
	if (nodeName === 'button') {
		return {
			type: options.type ?? 'button',
			disabled: options.disabled
		};
	} else {
		const baseAttributes: AttributesForOther = {
			role: 'button',
			tabIndex: options.disabled ? undefined : 0
		};

		if (nodeName === 'a') {
			baseAttributes.href = options.disabled ? undefined : options.href;
			baseAttributes.target = options.target;
			baseAttributes.rel = options.rel;
		}

		if (nodeName === 'input') {
			baseAttributes.type = options.type ?? 'button';
			baseAttributes.disabled = options.disabled;
		}

		if (options.disabled && nodeName !== 'input') {
			baseAttributes['aria-disabled'] = options.disabled;
		}

		return baseAttributes;
	}
}

function button<EventMap extends ButtonEvents>(
	node: HTMLElement,
	options: ButtonOptions<EventMap>
): SvelteActionOutput<ButtonOptions<EventMap>> {
	const nodeName = node.tagName.toLowerCase();
	const attributes = getAttributesForNode(nodeName, options);

	for (const attrName of Object.getOwnPropertyNames(attributes)) {
		node.setAttribute(attrName, attributes[attrName]);
	}

	node.addEventListener('click', () => !options.disabled && options.dispatch('press'));
	node.addEventListener('keydown', (event: KeyboardEvent) => {
		if (keyboardEventIsPress(event)) {
			options.dispatch('press');
		}
	});

	return {};
}

export default button;
