/**
 * An apparition injector is a function that runs at compile-time.
 *
 * It is responsible for converting the invalid references to pseudo-code
 * into actual valid Svelte code with all the requested functionality.
 */
export type ApparitionInjector = (
  /** The node name of the target element, capitalized. */
  node: string,
  /** The expression that is passed to the apparition creator. */
  initObject: string | undefined,
  /**
	 * The fields on the result of the apparition creator that are used in code.
	 *
	 * Allows detecting used features and shaking out the rest.
	 */
	usedReturnedFields: string[]
) => {
	/**
	 * Valid code to replace the part of the `<script>` tag
	 * that was previously occupied by the call to the apparition creator.
	 *
	 * May create variables to use in the event handlers.
	 */
	replacementCode?: string;
	/**
	 * The static attributes to assign to the target element
	 * in place of the pseudo-action application.
	 */
	attributes?: Record<string, string>;
	/**
	 * The event handlers to attach to the target element
	 * in place of the pseudo-action application.
	 *
	 * The `string` value is a JS expression that will probably reference variables
	 * created in the `replacementCode`.
	 */
	eventHandlers?: Record<string, string>;
};
