import MagicString from 'magic-string';
import { parse, walk } from 'svelte/compiler';
import type { Ast } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

import * as apparitionInjectors from './apparition-injectors/index.js';
import { apparitionToCreatorName } from './apparition-to-creator-name.js';
import type { ApparitionInjector } from './apparition-injectors/index.js';

const packageName = 'apparitions';

interface Apparition {
	attributes: Record<string, string>;
	eventHandlers: Record<string, string>;
}

function stringifyAttributes(attributes: Record<string, string>) {
	return Object.entries(attributes)
		.map(([name, value]) => `${name}=${JSON.stringify(value)}`)
		.join(' ');
}

function stringifyEventHandlers(eventHandlers: Record<string, string>) {
	return Object.entries(eventHandlers)
		.map(([name, value]) => `on:${name}={${value}}`)
		.join(' ');
}

function injectApparitions(ast: Ast, s: MagicString) {
	const registeredCreators = new Map<
		string,
		{
			injector: ApparitionInjector;
			creationLocation?: { start: number; end: number };
			parameters: Partial<Parameters<ApparitionInjector>>;
		}
	>();

	/**
	 * Walk the AST of the `<script>` and `<script context="module">`, searching
	 * for imports from the pseudo-library.
	 *
	 * Removes these imports from the source code and extracts the relevant variable names.
	 */
	const findAndRemovePseudoImports: Parameters<typeof walk>[1] = {
		enter(node) {
			// Imports can only exist on the top level, and before that come nodes of types Script (tag) and Program (all code).
			if (!['Script', 'Program', 'ImportDeclaration'].includes(node.type)) {
				this.skip();
			} else if (node.type === 'ImportDeclaration' && node.source.value === packageName) {
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportNamespaceSpecifier') {
						for (const [injectorName, injector] of Object.entries(apparitionInjectors)) {
							registeredCreators.set(`${specifier.local.name}.${injectorName}`, {
								injector,
								parameters: [undefined, undefined, undefined]
							});
						}
					} else if (specifier.type === 'ImportSpecifier') {
						const importedName = specifier.imported.name as string;
						const variableName = specifier.local.name;

						if (importedName in apparitionInjectors) {
							registeredCreators.set(variableName, {
								injector: (apparitionInjectors as Record<string, ApparitionInjector>)[importedName],
								parameters: [undefined, undefined, undefined]
							});
						}
					}
				}

				s.remove(node.start, node.end);
				this.skip();
			}
		}
	};

	const findCallsToApparitionCreators: Parameters<typeof walk>[1] = {
		enter(node, parent) {
			if (
				node.type === 'CallExpression' &&
				node.callee.type === 'Identifier' &&
				registeredCreators.has(node.callee.name)
			) {
				const apparition = registeredCreators.get(node.callee.name)!;
				apparition.creationLocation = { start: node.start, end: node.end };

				const initArgument = node.arguments[0];
				if (initArgument !== undefined) {
					apparition.parameters[1] = s.original.slice(initArgument.start, initArgument.end);
				}

				if (parent.type === 'VariableDeclarator') {
					if (parent.id.type === 'ObjectPattern') {
						const destructuredFields = parent.id.properties;
						apparition.parameters[2] = destructuredFields.map((field) => field.value.name);
					} else {
						console.warn('Cannot tree-shake features because the result is not destructured.');
					}
				} else {
					console.warn(
						'Cannot tree-shake features because the call is not directly in a variable declaration.'
					);
				}

				this.skip();
			}
		}
	};

	const findAndReplaceApparitions: Parameters<typeof walk>[1] = {
		enter(node, parent) {
			if (node.type === 'Action') {
				const creatorName = apparitionToCreatorName.get(node.name);
				if (creatorName === undefined) {
					this.skip();
					return;
				}

				const creator = registeredCreators.get(creatorName);
				if (creator === undefined || !(creator.parameters[2] ?? []).includes(node.name)) {
					this.skip();
					return;
				}

				if (creator.creationLocation === undefined) {
					console.warn(`Apparition ${node.name} was not created.`);
					this.skip();
					return;
				}

				if (parent.type !== 'Element') {
					console.warn('Apparitions can only be applied to HTML elements.');
					this.skip();
					return;
				}

				creator.parameters[0] = parent.name.toUpperCase();
				if (creator.parameters[2] !== undefined) {
					const { attributes, eventHandlers, replacementCode } = creator.injector(
						...(creator.parameters as Parameters<ApparitionInjector>)
					);

					if (replacementCode !== undefined) {
						s.overwrite(
							creator.creationLocation.start,
							creator.creationLocation.end,
							replacementCode
						);
					}

					const attributesSerialized = attributes !== undefined ? stringifyAttributes(attributes) : undefined;
					const eventHandlersSerialized = eventHandlers !== undefined ? stringifyEventHandlers(eventHandlers) : undefined;
					s.overwrite(
						node.start,
						node.end,
						[attributesSerialized, eventHandlersSerialized].filter(Boolean).join(' ')
					);
				}
			}
		}
	};

	walk(ast.module, findAndRemovePseudoImports);
	walk(ast.instance, findAndRemovePseudoImports);

	walk(ast.instance, findCallsToApparitionCreators);

	walk(ast.html, findAndReplaceApparitions);
}

export const preprocessor: PreprocessorGroup = {
	markup: ({ content, filename }) => {
		const ast = parse(content, { filename });
		const s = new MagicString(content);

		injectApparitions(ast, s);

		// if (/routes/.test(filename ?? '')) {
		// 	console.log(s.toString());
		// }

		return { code: s.toString(), map: s.generateMap().toString() };
	}
};
