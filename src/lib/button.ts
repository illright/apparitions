import { createEventDispatcher } from 'svelte';

export interface ButtonApparitionCreatorProps {
	disabled?: boolean;
}

class ButtonApparition {
	private node: HTMLElement | undefined;
	private callbackPress: () => void;
	private props: ButtonApparitionCreatorProps | undefined;

	constructor({ onPress }: { onPress: () => void }) {
		this.callbackPress = onPress;

		this.onMouseDown = this.onMouseDown.bind(this);

		this.sync = this.sync.bind(this);
	}

	attach(node: HTMLElement) {
		this.node = node;
		node.addEventListener('mousedown', this.onMouseDown);
	}

	detach() {
		if (this.node === undefined) {
			return;
		}

		this.node.removeEventListener('mousedown', this.onMouseDown);
		this.node = undefined;
	}

	onMouseDown() {
		if (!(this.props?.disabled ?? false)) {
			this.callbackPress();
		}
	}

	sync({ disabled = false }: ButtonApparitionCreatorProps) {
		this.props = { disabled };

		return {
			'aria-disabled': disabled ? 'true' as const : undefined,
		}
	}
}

export interface ButtonEvents {
	press: void;
}

export function createButton() {
	const dispatch = createEventDispatcher<ButtonEvents>();
	const button = new ButtonApparition({
		onPress: () => dispatch('press')
	});

	function asButton(node: HTMLElement) {
		button.attach(node);
		return {
			destroy: () => button.detach(),
		}
	}

	return { asButton, sync: button.sync };
}
