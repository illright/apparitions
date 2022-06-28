import { preprocess } from 'svelte/compiler';

import type { default as MagicString } from 'magic-string';
import type { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

/** A script tag in a source string. */
interface ScriptTag {
  /** The content of the tag, including the tag and attributes. */
  content: string;
  start: number;
  end: number;
}

/**
 * Extract script tags from a string of Svelte source code.
 *
 * Returns the content of the tag and their start and end indices.
 */
function findScriptTags(source: string) {
	// Taken from Svelte's preprocessing algorithm
	//   https://github.com/sveltejs/svelte/blob/bc34862060e551f04e2afab179e92915faeab93b/src/compiler/preprocess/index.ts#L149
	const scriptTagRegex = /<!--[^]*?-->|<script(\s[^]*?)?(?:>([^]*?)<\/script>|\/>)/gi;
	const scriptTags: ScriptTag[] = [];

	for (const match of source.matchAll(scriptTagRegex)) {
		scriptTags.push({
			content: match[0],
			start: match.index ?? 0,
			end: match.index ?? 0 + match[0].length
		});
	}

	return scriptTags;
}

/**
 * Run the given action after temporarily replacing the `<script>` tags
 * with their preprocessed versions.
 *
 * After running the action, the original contents of the `<script>` tags
 * will be returned.
 */
export async function withPreprocessedScriptTags(
	s: MagicString,
	preprocessorChain: PreprocessorGroup[],
	filename: string | undefined,
	action: () => void
) {
	const scriptTags = findScriptTags(s.original);

	for (const scriptTag of scriptTags) {
		const processed = await preprocess(scriptTag.content, preprocessorChain!, { filename });
		s.overwrite(scriptTag.start, scriptTag.end, processed.code);
	}

	action();

	for (const scriptTag of scriptTags) {
		s.overwrite(scriptTag.start, scriptTag.end, scriptTag.content);
	}
}
