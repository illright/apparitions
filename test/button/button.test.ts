import '@testing-library/jest-dom';

import { render } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

import DivButton from '$userland/div-button.svelte';
import DivButtonWithContent from './div-button-with-content.svelte';
import DivButtonAndLabel from './div-button-and-label.svelte';

describe('a `<div>`-rooted button from a website user perspective', () => {
  it('is discoverable by an accessible role', () => {
    const { getByRole } = render(DivButton);

    expect(getByRole('button')).toBeInTheDocument();
  });

  it('is pressable with a mouse or touch', () => {
    const { component, getByRole } = render(DivButton);
    const mockPressHandler = jest.fn();
    component.$on('click', mockPressHandler);

    userEvent.click(getByRole('button'));
    expect(mockPressHandler).toBeCalledTimes(1);
  });

  it('is pressable with <Space> and <Enter>', () => {
    const { component, getByRole } = render(DivButton);
    const mockPressHandler = jest.fn();
    component.$on('click', mockPressHandler);

    expect(document.body).toHaveFocus();
    userEvent.keyboard('{Enter}'); // shouldn't count
    userEvent.tab();
    expect(getByRole('button')).toHaveFocus();
    userEvent.keyboard('{Enter}');
    userEvent.keyboard(' ');

    expect(mockPressHandler).toBeCalledTimes(2);
  });

  it('is not pressable with a key that is not <Space> or <Enter>', () => {
    const { component, getByRole } = render(DivButton);
    const mockPressHandler = jest.fn();
    component.$on('press', mockPressHandler);

    expect(document.body).toHaveFocus();
    userEvent.tab();
    expect(getByRole('button')).toHaveFocus();
    userEvent.keyboard('A');

    expect(mockPressHandler).not.toBeCalled();
  });

  it('is not keyboard-pressable when not in focus', () => {
    const { component, getByRole } = render(DivButton);
    const mockPressHandler = jest.fn();
    component.$on('press', mockPressHandler);

    expect(getByRole('button')).not.toHaveFocus();
    userEvent.keyboard('{Enter}');

    expect(mockPressHandler).not.toBeCalled();
  });

  it('can communicate the disabled state', () => {
    const { getByRole } = render(DivButton, { disabled: true });

    expect(getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('is not functional when disabled', () => {
    const { component, getByRole } = render(DivButton);
    const mockPressHandler = jest.fn();
    component.$on('press', mockPressHandler);

    const button = getByRole('button');
    userEvent.click(button);

    button.focus();
    userEvent.keyboard('{Enter}');
    userEvent.keyboard(' ');

    expect(mockPressHandler).not.toBeCalled();
  });

  it('can get an accessible name from slot content', () => {
    const label = 'an internal label';
    const { getByRole } = render(DivButtonWithContent, { content: label });

    expect(getByRole('button')).toHaveAccessibleName(label);
  });

  it('can get an accessible label from the `aria-label`', () => {
    const label = 'an ARIA attribute label';
    const { getByLabelText } = render(DivButton, { 'aria-label': label });

    expect(getByLabelText(label)).toBeInTheDocument();
  });

  it('can get an accessible label from another element', () => {
    const label = 'an ARIA external label';
    const { getByLabelText } = render(DivButtonAndLabel, { labelText: label });

    expect(getByLabelText(label)).toBeInTheDocument();
  });
});
