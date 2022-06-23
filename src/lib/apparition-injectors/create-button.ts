import type { ApparitionInjector } from "./type.d.js";

export const createButton: ApparitionInjector = () => ({
  attributes: {
    role: "button",
    tabindex: "0",
  },
  replacementCode: '{}',
});
