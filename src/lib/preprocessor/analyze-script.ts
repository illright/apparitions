import { walk } from 'svelte/compiler';
import type { Ast, TemplateNode } from 'svelte/types/compiler/interfaces';

import * as apparitionInjectors from '../apparition-injectors/index.js';
import type { ApparitionInjector } from '../apparition-injectors/index.js';

const packageName = 'apparitions';

/** The parameters to the apparition injector that are extracted from the `<script>` tag. */
export interface InjectorScriptParameters {
	initObject?: string;
	usedReturnedFields?: string[];
	injector: ApparitionInjector;
}

/**
 * Creates a walker of the `<script>` and `<script context="module">` to search
 * for imports from the pseudo-library.
 */
function makeImportFinder() {
	const registeredCreators = new Map<string, ApparitionInjector>();

	const findImports: Parameters<typeof walk>[1] = {
		enter(node: TemplateNode) {
			if (node.type === 'ImportDeclaration' && node.source.value === packageName) {
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportNamespaceSpecifier') {
						for (const [injectorName, injector] of Object.entries(apparitionInjectors)) {
							registeredCreators.set(`${specifier.local.name}.${injectorName}`, injector);
						}
					} else if (specifier.type === 'ImportSpecifier') {
						const importedName = specifier.imported.name as string;
						const variableName = specifier.local.name;

						if (importedName in apparitionInjectors) {
							registeredCreators.set(
								variableName,
								(apparitionInjectors as Record<string, ApparitionInjector>)[importedName]
							);
						}
					}
				}
			}
		}
	};

	return [findImports, registeredCreators] as const;
}

function makeCallFinder(registeredCreators: Map<string, ApparitionInjector>, source: string) {
	const createdApparitions = new Map<string, InjectorScriptParameters>();

	const findCallsToCreators: Parameters<typeof walk>[1] = {
		enter(node: TemplateNode, parent: TemplateNode) {
			if (
				node.type === 'CallExpression' &&
				node.callee.type === 'Identifier' &&
				registeredCreators.has(node.callee.name)
			) {
				const injector = registeredCreators.get(node.callee.name)!;
				const parameters: InjectorScriptParameters = { injector };

				const initObjectNode = node.arguments[0];
				if (initObjectNode !== undefined) {
					parameters.initObject = source.slice(initObjectNode.start, initObjectNode.end);
				}

				if (parent.type === 'VariableDeclarator') {
					if (parent.id.type === 'ObjectPattern') {
						const destructuredFields = parent.id.properties;
						parameters.usedReturnedFields = destructuredFields.map(
							(field: TemplateNode) => field.value.name
						);
					} else {
						console.warn('Cannot tree-shake features because the result is not destructured.');
					}
				} else {
					console.warn(
						'Cannot tree-shake features because the call is not directly in a variable declaration.'
					);
				}

				for (const actionName of injector.actionNames) {
					createdApparitions.set(actionName, parameters);
				}
			}
		}
	};

	return [findCallsToCreators, createdApparitions] as const;
}

export function findCreatedApparitions(ast: Ast, source: string) {
	const [findImports, registeredCreators] = makeImportFinder();
	walk(ast.module, findImports);
	walk(ast.instance, findImports);

	const [findCallsToCreators, createdApparitions] = makeCallFinder(registeredCreators, source);
	walk(ast.instance, findCallsToCreators);

	return createdApparitions;
}



function action(node: HTMLElement, params: {}) {
	// init code
	node.setAttribute('data-apparition-init', JSON.stringify(params));

	return {
		destroy() { },
		update(newParams: {}) { },
	}
}


function createButton() {
		return button;
}

/*

<button use:action={{}}></button>

*/
