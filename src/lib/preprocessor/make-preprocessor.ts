import MagicString from 'magic-string';
import { parse, walk } from 'svelte/compiler';
import autoPreprocess from 'svelte-preprocess';
import type { Ast } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

import { withPreprocessedScriptTags } from './meta-preprocessing.js';
import { findCreatedApparitions, type InjectorScriptParameters } from './analyze-script.js';
import type { ApparitionInjector } from '../apparition-injectors/index.js';

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

interface ApparitionsPreprocessorGroup extends PreprocessorGroup {
	apparitions: Map<string, InjectorScriptParameters> | undefined;
}

function injectApparitions(
	ast: Ast,
	s: MagicString,
	createdApparitions: Map<string, InjectorScriptParameters>
) {
	const findAndReplaceApparitions: Parameters<typeof walk>[1] = {
		enter(node, parent) {
			if (node.type === 'Action' && createdApparitions.has(node.name)) {
				const scriptParameters = createdApparitions.get(node.name)!;

				if (parent.type !== 'Element') {
					console.warn('Apparitions can only be applied to HTML elements.');
					this.skip();
					return;
				}

				const targetNode = parent.name.toUpperCase();

				const { attributes, eventHandlers, replacementExpression, prependedCode } =
					scriptParameters.injector(
						targetNode,
						scriptParameters.initObject,
						scriptParameters.usedReturnedFields
					);

				if (creator.parameters[2] !== undefined) {
					const { attributes, eventHandlers, replacementExpression, prependedCode } =
						creator.injector(...(creator.parameters as Parameters<ApparitionInjector>));

					if (replacementExpression !== undefined) {
						s.overwrite(
							creator.creationLocation.start,
							creator.creationLocation.end,
							replacementExpression
						);
					}

					if (
						prependedCode !== undefined &&
						ast.instance !== undefined &&
						ast.instance.content?.type === 'Program'
					) {
						s.appendLeft(ast.instance.content.start, prependedCode);
					}

					const attributesSerialized =
						attributes !== undefined ? stringifyAttributes(attributes) : undefined;
					const eventHandlersSerialized =
						eventHandlers !== undefined ? stringifyEventHandlers(eventHandlers) : undefined;
					s.overwrite(
						node.start,
						node.end,
						[attributesSerialized, eventHandlersSerialized].filter(Boolean).join(' ')
					);
				}
			}
		}
	};

	walk(ast.html, findAndReplaceApparitions);
}

export function makePreprocessor(preprocessorChain?: PreprocessorGroup[]) {
	if (preprocessorChain === undefined) {
		preprocessorChain = [autoPreprocess()];
	}

	const apparitionsPreprocessor: ApparitionsPreprocessorGroup = {
		apparitions: undefined,
		/**
		 * Stage 1. Analyze the script tags to locate apparitions,
		 * replace the pseudo-actions in the markup.
		 */
		async markup({ content, filename }) {
			const s = new MagicString(content);

			await withPreprocessedScriptTags(s, preprocessorChain!, filename, () => {
				const ast = parse(s.toString(), { filename });
				this.apparitions = findCreatedApparitions(ast, s.toString());
				injectApparitions(ast, s, this.apparitions);
			});

			// if (/routes/.test(filename ?? '')) {
			// 	console.log(s.toString());
			// }

			return {
				code: s.toString(),
				map: s.generateMap().toString()
			};
		},
		/**
		 * Stage 2. Transform the contents of the script tag,
		 * removing pseudo-imports and pseudo-calls, defining variables
		 * that are injected into the markup at stage 1.
		 */
		script() {}
	};

	return apparitionsPreprocessor;
}

/**
 * x Step 1. Find the start and end of both script tags (if present)
 * x Step 2. Extract both script tags and preprocess them both
 * x Step 3. Save the unpreprocessed script tag contents into a state variable for way later
 * x Step 4. Replace the contents of both script tags for the preprocess ones in a magic string
 * x Step 5. Parse the current content of the magic string into an AST
 * Step 6. Find imports from apparitions and save them as registered apparition creators
 * Step 7. Find calls to apparition creators and extract the initializing object, extracted fields and variable names for pseudo-actions
 * Step 8. Find applications of pseudo-actions and extract the node name
 * Step 9. Run the apparition injectors corresponding to the used creators
 * Step 10. Insert the results of apparition injectors into the markup, saving the code to be inserted in the script tags
 * x Step 11. Restore the script tags
 */
