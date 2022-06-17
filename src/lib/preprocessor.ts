import MagicString from 'magic-string';
import { parse, walk } from 'svelte/compiler';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

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

const apparitions: Record<string, (node: string) => Apparition> = {
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

export const preprocessor: PreprocessorGroup = {
	markup: ({ content, filename }) => {
		if (filename === undefined || !/routes\/index.svelte/.test(filename)) {
			return { code: content };
		}

		const ast = parse(content, { filename });
		const s = new MagicString(content);
		walk(ast, {
			enter(node, parent) {
				if (node.type === 'ImportDeclaration' && node.source.value === 'apparitions') {
					console.log('apparitions bye');
					s.remove(node.start, node.end);
				}

				if (node.type === 'Action') {
					if (node.name in apparitions) {
						s.overwrite(
							node.start,
							node.end,
							stringifyApparition(apparitions[node.name](parent.name)),
						);
					}
				}
			}
		});

		return { code: s.toString(), map: s.generateMap().toString() };
	}
};
