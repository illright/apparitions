import MagicString from 'magic-string';
import { parse, walk } from 'svelte/compiler';
import type { Ast } from 'svelte/types/compiler/interfaces';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

const packageName = 'apparitions';

interface Apparition {
	attributes: Record<string, string>;
	eventHandlers: Record<string, string>;
}

function stringifyApparition(apparition: Apparition) {
	const jointAttributes = Object.entries(apparition.attributes)
		.map(([name, value]) => `${name}=${JSON.stringify(value)}`)
		.join(' ');
	const jointEventHandlers = Object.entries(apparition.eventHandlers)
		.map(([name, value]) => `on:${name}={${value}}`)
		.join(' ');
	return `${jointAttributes} ${jointEventHandlers}`;
}

type ApparitionCreator = (node: string) => Apparition;

const apparitions: Record<string, ApparitionCreator> = {
	asButton() {
		return {
			attributes: {
				type: 'button'
			},
			eventHandlers: {
				click: '() => { console.log("Hello") }'
			}
		};
	}
};

/**
 * Walk the AST of the `<script>` and `<script context="module">`, searching
 * for imports from the pseudo-library.
 *
 * Removes these imports from the source code and extracts the relevant variable names.
 */
function identifyImportsFromApparitions(ast: Ast, s: MagicString) {
	const namedImports = new Map<string, ApparitionCreator>();
	let namespace: string | null = null;

	const walker: Parameters<typeof walk>[1] = {
		enter(node) {
			if (node.type === 'ImportDeclaration' && node.source.value === packageName) {
				for (const specifier of node.specifiers) {
					if (specifier.type === 'ImportNamespaceSpecifier') {
						namespace = specifier.local.name;
					} else if (specifier.type === 'ImportSpecifier') {
						const importedName = specifier.imported.name;
						const variableName = specifier.local.name;

						if (importedName in apparitions) {
							namedImports.set(variableName, apparitions[importedName]);
						}
					}
				}

				s.remove(node.start, node.end);
			} else if (node.type !== 'Program' && node.type !== 'Script') {
				this.skip();
			}
		}
	};

	walk(ast.instance, walker);
	walk(ast.module, walker);

	return [namedImports, namespace] as const;
}

export const preprocessor: PreprocessorGroup = {
	markup: ({ content, filename }) => {
		const ast = parse(content, { filename });
		const s = new MagicString(content);

		const [namedImports, namespace] = identifyImportsFromApparitions(ast, s);
		walk(ast, {
			enter(node, parent) {
				if (node.type === 'Action') {
					if (namedImports.has(node.name)) {
						s.overwrite(
							node.start,
							node.end,
							stringifyApparition(namedImports.get(node.name)!(parent.name))
						);
					}
				}
			}
		});

		return { code: s.toString(), map: s.generateMap().toString() };
	}
};
