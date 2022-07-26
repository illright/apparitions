import type { NonUndefined } from 'utility-types';

export class PropDiff<PropsType extends object> {
  props: PropsType;

  constructor(props: Required<PropsType>) {
    this.props = props;
  }

  compare(
    props: PropsType,
    callbacks: {
      [Property in keyof PropsType]: (
        newValue: NonUndefined<PropsType[Property]>,
        oldValue: PropsType[Property]
      ) => void;
    }
  ) {
    for (const key in props) {
      if (props[key] !== this.props[key]) {
        callbacks[key](props[key], this.props[key]);
      }
    }
    this.props = props;
  }
}
