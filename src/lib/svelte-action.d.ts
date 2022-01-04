export interface SvelteActionOutput<ParametersType> {
  update?: (_newParameters: ParametersType) => void;
  destroy?: () => void;
}

export type SvelteAction<
  ParametersType,
  NodeType extends HTMLElement = HTMLElement
> = (
  _node: NodeType,
  _parameters?: ParametersType
) => SvelteActionOutput<ParametersType>;
