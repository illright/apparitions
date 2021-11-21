export function keyboardEventIsPress(event: KeyboardEvent): boolean {
	const { key, code, target } = event;
	const element = target as HTMLElement;
	const { tagName, isContentEditable } = element;
	const role = element.getAttribute('role');

	return (
		(key === 'Enter' || key === ' ' || key === 'Spacebar' || code === 'Space') &&
		tagName !== 'INPUT' &&
		tagName !== 'TEXTAREA' &&
		isContentEditable !== true &&
		// A link with a valid href should be handled natively,
		// unless it also has role='button' and was triggered using Space.
		(!(tagName === 'A' && element.hasAttribute('href')) ||
			(role === 'button' && key !== 'Enter')) &&
		// An element with role='link' should only trigger with Enter key
		!(role === 'link' && key !== 'Enter')
	);
}
