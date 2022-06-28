import type { ApparitionInjector } from "./type.d.js";

export const createButton: ApparitionInjector = (node, initObject) => {
  const injection: ReturnType<ApparitionInjector> = {
    attributes: {},
    eventHandlers: {
      mousedown: 'buttonApparition.onMouseDown',
      mouseup: 'buttonApparition.onMouseUp',
    },
    prependedCode: [
      'import { ButtonApparition } from "apparitions/button";',
      'let buttonApparition;'
    ].join(''),
    replacementExpression: `(buttonApparition = new ButtonApparition(${initObject}))`
  };

  if (node !== 'BUTTON') {
    injection.attributes!.role = 'button';
    injection.attributes!.tabindex = '0';
  }

  return injection;
};

createButton.actionNames = ['asButton'];
