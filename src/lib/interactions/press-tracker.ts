import { disableTextSelection, restoreTextSelection } from './text-selection';
import { GlobalListeners } from './global-listeners';
import { focusWithoutScrolling } from './focus-without-scrolling';

export interface PressTrackerParameters {
  /** Whether the target is in a controlled press state (e.g. an overlay it triggers is open). */
  isPressed?: boolean;
  /** Whether the press events should be disabled. */
  isDisabled?: boolean;
  /** Whether the target should not receive focus on press. */
  preventFocusOnPress?: boolean;
  /**
   * Whether press events should be canceled when the pointer leaves the target while pressed.
   * By default, this is `false`, which means if the pointer returns back over the target while
   * still pressed, onPressStart will be fired again. If set to `true`, the press is canceled
   * when the pointer leaves the target and onPressStart will not be fired if the pointer returns.
   */
  shouldCancelOnPointerExit?: boolean;
  /** Whether text selection should be enabled on the pressable element. */
  allowTextSelectionOnPress?: boolean;
}

export interface PressTrackerState {
  isPressed: boolean;
  ignoreEmulatedMouseEvents: boolean;
  ignoreClickAfterPress: boolean;
  didFirePressStart: boolean;
  activePointerId: number;
  target: HTMLElement | null;
  isOverTarget: boolean;
  pointerType: PointerType;
  userSelect?: string;
}

export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';

export interface PressEvent {
  /** The type of press event being fired. */
  type: 'pressstart' | 'pressend' | 'pressup' | 'press';
  /** The pointer type that triggered the press event. */
  pointerType: PointerType;
  /** The target element of the press event. */
  target: HTMLElement;
  /** Whether the shift keyboard modifier was held during the press event. */
  shiftKey: boolean;
  /** Whether the ctrl keyboard modifier was held during the press event. */
  ctrlKey: boolean;
  /** Whether the meta keyboard modifier was held during the press event. */
  metaKey: boolean;
  /** Whether the alt keyboard modifier was held during the press event. */
  altKey: boolean;
}

export interface PressEvents {
  /** Handler that is called when the press is released over the target. */
  onPress?: (_e: PressEvent) => void;
  /** Handler that is called when a press interaction starts. */
  onPressStart?: (_e: PressEvent) => void;
  /**
   * Handler that is called when a press interaction ends, either
   * over the target or when the pointer leaves the target.
   */
  onPressEnd?: (_e: PressEvent) => void;
  /** Handler that is called when the press state changes. */
  onPressChange?: (_isPressed: boolean) => void;
  /**
   * Handler that is called when a press is released over the target, regardless of
   * whether it started on the target or not.
   */
  onPressUp?: (_e: PressEvent) => void;
}

interface EventBase {
  currentTarget: EventTarget;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
}

export class PressTracker {
  private parameters: PressTrackerParameters;
  private hooks: PressEvents;
  private state: PressTrackerState;
  private trackedNode: HTMLElement | null;
  private localListeners: Map<
    keyof HTMLElementEventMap,
    (_e: Event) => void
  > | null;
  private globalListeners: GlobalListeners | null;

  constructor(hooks: PressEvents) {
    this.parameters = {
      isDisabled: false,
      isPressed: false,
      preventFocusOnPress: false,
      shouldCancelOnPointerExit: false,
      allowTextSelectionOnPress: false,
    };

    this.state = {
      isPressed: false,
      ignoreEmulatedMouseEvents: false,
      ignoreClickAfterPress: false,
      didFirePressStart: false,
      activePointerId: null,
      target: null,
      isOverTarget: false,
      pointerType: null,
    };

    this.hooks = hooks;
    this.trackedNode = null;
    this.localListeners = null;
  }

  attach(node: HTMLElement): void {
    if (this.trackedNode !== null || this.localListeners !== null) {
      return;
    }

    this.trackedNode = node;
    this.globalListeners = new GlobalListeners();
    this.localListeners = new Map();

    this.localListeners.set('keydown', this.onKeyDown.bind(this));
    this.localListeners.set('keyup', this.onKeyUp.bind(this));
    this.localListeners.set('click', this.onClick.bind(this));
    if (typeof PointerEvent !== undefined) {
      this.localListeners.set('pointerdown', this.onPointerDown.bind(this));
      this.localListeners.set('mousedown', this.onMouseDownPE.bind(this));
      this.localListeners.set('pointerup', this.onPointerUp.bind(this));
      this.localListeners.set('dragstart', this.onDragStartPE.bind(this));
    } else {
      this.localListeners.set('mousedown', this.onMouseDownNPE.bind(this));
      this.localListeners.set('mouseenter', this.onMouseEnter.bind(this));
      this.localListeners.set('mouseleave', this.onMouseLeave.bind(this));
      this.localListeners.set('mouseup', this.onMouseUp.bind(this));
      this.localListeners.set('touchstart', this.onTouchStart.bind(this));
      this.localListeners.set('touchmove', this.onTouchMove.bind(this));
      this.localListeners.set('touchcancel', this.onTouchCancel.bind(this));
      this.localListeners.set('dragstart', this.onDragStartNPE.bind(this));
    }

    for (const [eventName, eventListener] of this.localListeners.entries()) {
      this.trackedNode.addEventListener(eventName, eventListener);
    }
  }

  destroy(): void {
    if (this.trackedNode === null || this.localListeners === null) {
      return;
    }

    for (const [eventName, eventListener] of this.localListeners.entries()) {
      this.trackedNode.removeEventListener(eventName, eventListener);
    }

    this.trackedNode = null;
    this.localListeners = null;
    this.globalListeners?.removeAll();
    this.globalListeners = null;
  }

  // ---------------

  triggerPressStart(originalEvent: EventBase, pointerType: PointerType): void {
    if (this.parameters.isDisabled || this.state.didFirePressStart) {
      return;
    }

    this.hooks.onPressStart?.({
      type: 'pressstart',
      pointerType,
      target: originalEvent.currentTarget as HTMLElement,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
    });

    this.hooks.onPressChange?.(true);

    this.state.didFirePressStart = true;
  }

  triggerPressEnd(
    originalEvent: EventBase,
    pointerType: PointerType,
    wasPressed = true
  ): void {
    if (!this.state.didFirePressStart) {
      return;
    }

    this.state.ignoreClickAfterPress = true;
    this.state.didFirePressStart = false;

    this.hooks.onPressEnd?.({
      type: 'pressend',
      pointerType,
      target: originalEvent.currentTarget as HTMLElement,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
    });

    this.hooks.onPressChange?.(false);

    if (wasPressed && !this.parameters.isDisabled) {
      this.hooks.onPress?.({
        type: 'press',
        pointerType,
        target: originalEvent.currentTarget as HTMLElement,
        shiftKey: originalEvent.shiftKey,
        metaKey: originalEvent.metaKey,
        ctrlKey: originalEvent.ctrlKey,
        altKey: originalEvent.altKey,
      });
    }
  }

  triggerPressUp(originalEvent: EventBase, pointerType: PointerType): void {
    if (this.parameters.isDisabled) {
      return;
    }

    this.hooks.onPressUp?.({
      type: 'pressup',
      pointerType,
      target: originalEvent.currentTarget as HTMLElement,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
    });
  }

  cancel(e: EventBase): void {
    if (this.state.isPressed) {
      if (this.state.isOverTarget) {
        this.triggerPressEnd(
          PressTracker.createEvent(this.state.target, e),
          this.state.pointerType,
          false
        );
      }
      this.state.isPressed = false;
      this.state.isOverTarget = false;
      this.state.activePointerId = null;
      this.state.pointerType = null;
      this.globalListeners?.removeAll();
      if (!this.parameters.allowTextSelectionOnPress) {
        restoreTextSelection(this.state.target);
      }
    }
  }

  // ---------------

  onKeyDown(e: KeyboardEvent): void {
    if (
      PressTracker.isValidKeyboardEvent(e) &&
      PressTracker.currentTargetContainsTarget(e)
    ) {
      if (PressTracker.shouldPreventDefaultKeyboard(e.target as Element)) {
        e.preventDefault();
      }
      e.stopPropagation();

      // If the event is repeating, it may have started on a different element
      // after which focus moved to the current element. Ignore these events and
      // only handle the first key down event.
      if (!this.state.isPressed && !e.repeat) {
        this.state.target = e.currentTarget as HTMLElement;
        this.state.isPressed = true;
        this.triggerPressStart(e, 'keyboard');

        // Focus may move before the key up event, so register the event on the document
        // instead of the same element where the key down event occurred.
        this.globalListeners.add(document, 'keyup', this.globalOnKeyUp, { capture: false });
      }
    }
  }

  onKeyUp(e: KeyboardEvent): void {
    if (
      PressTracker.isValidKeyboardEvent(e) &&
      !e.repeat &&
      PressTracker.currentTargetContainsTarget(e)
    ) {
      this.triggerPressUp(
        PressTracker.createEvent(this.state.target, e),
        'keyboard'
      );
    }
  }

  onClick(e: MouseEvent): void {
    if (e && !PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    if (e && e.button === 0) {
      e.stopPropagation();
      if (this.parameters.isDisabled) {
        e.preventDefault();
      }

      // If triggered from a screen reader or by using element.click(),
      // trigger as if it were a keyboard click.
      if (
        !this.state.ignoreClickAfterPress &&
        !this.state.ignoreEmulatedMouseEvents &&
        (this.state.pointerType === 'virtual' || PressTracker.isVirtualClick(e))
      ) {
        // Ensure the element receives focus (VoiceOver on iOS does not do this)
        if (
          !this.parameters.isDisabled &&
          !this.parameters.preventFocusOnPress
        ) {
          focusWithoutScrolling(e.currentTarget as HTMLElement);
        }

        this.triggerPressStart(e, 'virtual');
        this.triggerPressUp(e, 'virtual');
        this.triggerPressEnd(e, 'virtual');
      }

      this.state.ignoreEmulatedMouseEvents = false;
      this.state.ignoreClickAfterPress = false;
    }
  }

  globalOnKeyUp(e: KeyboardEvent): void {
    if (this.state.isPressed && PressTracker.isValidKeyboardEvent(e)) {
      if (PressTracker.shouldPreventDefaultKeyboard(e.target as Element)) {
        e.preventDefault();
      }
      e.stopPropagation();

      this.state.isPressed = false;
      const target = e.target as HTMLElement;
      this.triggerPressEnd(
        PressTracker.createEvent(this.state.target, e),
        'keyboard',
        this.state.target.contains(target)
      );
      this.globalListeners?.removeAll();

      // If the target is a link, trigger the click method to open the URL,
      // but defer triggering pressEnd until onClick event handler.
      if (
        (this.state.target.contains(target) &&
          PressTracker.isHTMLAnchorLink(this.state.target)) ||
        this.state.target.getAttribute('role') === 'link'
      ) {
        this.state.target.click();
      }
    }
  }

  onPointerDown(e: PointerEvent): void {
    // Only handle left clicks, and ignore events that bubbled through portals.
    if (e.button !== 0 || !PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    // iOS Safari fires pointer events from VoiceOver with incorrect coordinates/target.
    // Ignore and let the onClick handler take care of it instead.
    // https://bugs.webkit.org/show_bug.cgi?id=222627
    // https://bugs.webkit.org/show_bug.cgi?id=223202
    if (PressTracker.isVirtualPointerEvent(e)) {
      this.state.pointerType = 'virtual';
      return;
    }

    // Due to browser inconsistencies, especially on mobile browsers, we prevent
    // default on pointer down and handle focusing the pressable element ourselves.
    if (PressTracker.shouldPreventDefault(e.target as Element)) {
      e.preventDefault();
    }

    this.state.pointerType = e.pointerType as PointerType;

    e.stopPropagation();
    if (!this.state.isPressed) {
      this.state.isPressed = true;
      this.state.isOverTarget = true;
      this.state.activePointerId = e.pointerId;
      this.state.target = e.currentTarget as HTMLElement;

      if (!this.parameters.isDisabled && !this.parameters.preventFocusOnPress) {
        focusWithoutScrolling(e.currentTarget as HTMLElement);
      }

      if (!this.parameters.allowTextSelectionOnPress) {
        disableTextSelection(this.state.target);
      }

      this.triggerPressStart(e, this.state.pointerType);

      this.globalListeners?.add(
        document,
        'pointermove',
        this.globalOnPointerMove,
        { capture: false }
      );
      this.globalListeners?.add(document, 'pointerup', this.globalOnPointerUp, {
        capture: false,
      });
      this.globalListeners?.add(
        document,
        'pointercancel',
        this.globalOnPointerCancel,
        { capture: false }
      );
    }
  }

  onMouseDownPE(e: MouseEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    if (e.button === 0) {
      // Chrome and Firefox on touch Windows devices require mouse down events
      // to be canceled in addition to pointer events, or an extra asynchronous
      // focus event will be fired.
      if (PressTracker.shouldPreventDefault(e.target as Element)) {
        e.preventDefault();
      }

      e.stopPropagation();
    }
  }

  onPointerUp(e: PointerEvent): void {
    // iOS fires pointerup with zero width and height, so check the pointerType recorded during pointerdown.
    if (
      !PressTracker.currentTargetContainsTarget(e) ||
      this.state.pointerType === 'virtual'
    ) {
      return;
    }

    // Only handle left clicks
    // Safari on iOS sometimes fires pointerup events, even
    // when the touch isn't over the target, so double check.
    if (
      e.button === 0 &&
      PressTracker.isOverTarget(e, e.currentTarget as HTMLElement)
    ) {
      this.triggerPressUp(
        e,
        this.state.pointerType || (e.pointerType as PointerType)
      );
    }
  }

  // Safari on iOS < 13.2 does not implement pointerenter/pointerleave events correctly.
  // Use pointer move events instead to implement our own hit testing.
  // See https://bugs.webkit.org/show_bug.cgi?id=199803
  globalOnPointerMove(e: PointerEvent): void {
    if (e.pointerId !== this.state.activePointerId) {
      return;
    }

    if (PressTracker.isOverTarget(e, this.state.target)) {
      if (!this.state.isOverTarget) {
        this.state.isOverTarget = true;
        this.triggerPressStart(
          PressTracker.createEvent(this.state.target, e),
          this.state.pointerType
        );
      }
    } else if (this.state.isOverTarget) {
      this.state.isOverTarget = false;
      this.triggerPressEnd(
        PressTracker.createEvent(this.state.target, e),
        this.state.pointerType,
        false
      );
      if (this.parameters.shouldCancelOnPointerExit) {
        this.cancel(e);
      }
    }
  }

  globalOnPointerUp(e: PointerEvent): void {
    if (
      e.pointerId === this.state.activePointerId &&
      this.state.isPressed &&
      e.button === 0
    ) {
      if (PressTracker.isOverTarget(e, this.state.target)) {
        this.triggerPressEnd(
          PressTracker.createEvent(this.state.target, e),
          this.state.pointerType
        );
      } else if (this.state.isOverTarget) {
        this.triggerPressEnd(
          PressTracker.createEvent(this.state.target, e),
          this.state.pointerType,
          false
        );
      }

      this.state.isPressed = false;
      this.state.isOverTarget = false;
      this.state.activePointerId = null;
      this.state.pointerType = null;
      this.globalListeners?.removeAll();
      if (!this.parameters.allowTextSelectionOnPress) {
        restoreTextSelection(this.state.target);
      }
    }
  }

  globalOnPointerCancel(e: PointerEvent): void {
    this.cancel(e);
  }

  onDragStartPE(e: DragEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    // Safari does not call onPointerCancel when a drag starts, whereas Chrome and Firefox do.
    this.cancel(e);
  }

  onMouseDownNPE(e: MouseEvent): void {
    // Only handle left clicks
    if (e.button !== 0 || !PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    // Due to browser inconsistencies, especially on mobile browsers, we prevent
    // default on mouse down and handle focusing the pressable element ourselves.
    if (PressTracker.shouldPreventDefault(e.target as Element)) {
      e.preventDefault();
    }

    e.stopPropagation();
    if (this.state.ignoreEmulatedMouseEvents) {
      return;
    }

    this.state.isPressed = true;
    this.state.isOverTarget = true;
    this.state.target = e.currentTarget as HTMLElement;
    this.state.pointerType = PressTracker.isVirtualClick(e)
      ? 'virtual'
      : 'mouse';

    if (!this.parameters.isDisabled && !this.parameters.preventFocusOnPress) {
      focusWithoutScrolling(e.currentTarget as HTMLElement);
    }

    this.triggerPressStart(e, this.state.pointerType);

    this.globalListeners?.add(
      document,
      'mouseup',
      this.globalOnMouseUp.bind(this),
      { capture: false }
    );
  }

  onMouseEnter(e: MouseEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    e.stopPropagation();
    if (this.state.isPressed && !this.state.ignoreEmulatedMouseEvents) {
      this.state.isOverTarget = true;
      this.triggerPressStart(e, this.state.pointerType);
    }
  }

  onMouseLeave(e: MouseEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    e.stopPropagation();
    if (this.state.isPressed && !this.state.ignoreEmulatedMouseEvents) {
      this.state.isOverTarget = false;
      this.triggerPressEnd(e, this.state.pointerType, false);
      if (this.parameters.shouldCancelOnPointerExit) {
        this.cancel(e);
      }
    }
  }

  onMouseUp(e: MouseEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    if (!this.state.ignoreEmulatedMouseEvents && e.button === 0) {
      this.triggerPressUp(e, this.state.pointerType);
    }
  }

  globalOnMouseUp(e: MouseEvent): void {
    // Only handle left clicks
    if (e.button !== 0) {
      return;
    }

    this.state.isPressed = false;
    this.globalListeners?.removeAll();

    if (this.state.ignoreEmulatedMouseEvents) {
      this.state.ignoreEmulatedMouseEvents = false;
      return;
    }

    if (PressTracker.isOverTarget(e, this.state.target)) {
      this.triggerPressEnd(
        PressTracker.createEvent(this.state.target, e),
        this.state.pointerType
      );
    } else if (this.state.isOverTarget) {
      this.triggerPressEnd(
        PressTracker.createEvent(this.state.target, e),
        this.state.pointerType,
        false
      );
    }

    this.state.isOverTarget = false;
  }

  onTouchStart(e: TouchEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    e.stopPropagation();
    const touch = PressTracker.getTouchFromEvent(e);
    if (!touch) {
      return;
    }
    this.state.activePointerId = touch.identifier;
    this.state.ignoreEmulatedMouseEvents = true;
    this.state.isOverTarget = true;
    this.state.isPressed = true;
    this.state.target = e.currentTarget as HTMLElement;
    this.state.pointerType = 'touch';

    // Due to browser inconsistencies, especially on mobile browsers, we prevent default
    // on the emulated mouse event and handle focusing the pressable element ourselves.
    if (!this.parameters.isDisabled && !this.parameters.preventFocusOnPress) {
      focusWithoutScrolling(e.currentTarget as HTMLElement);
    }

    if (!this.parameters.allowTextSelectionOnPress) {
      disableTextSelection(this.state.target);
    }

    this.triggerPressStart(e, this.state.pointerType);

    this.globalListeners?.add(
      window,
      'scroll',
      this.globalOnScroll.bind(this),
      { capture: true }
    );
  }

  onTouchMove(e: TouchEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    e.stopPropagation();
    if (!this.state.isPressed) {
      return;
    }

    const touch = PressTracker.getTouchById(e, this.state.activePointerId);
    if (touch && PressTracker.isOverTarget(touch, e.currentTarget as HTMLElement)) {
      if (!this.state.isOverTarget) {
        this.state.isOverTarget = true;
        this.triggerPressStart(e, this.state.pointerType);
      }
    } else if (this.state.isOverTarget) {
      this.state.isOverTarget = false;
      this.triggerPressEnd(e, this.state.pointerType, false);
      if (this.parameters.shouldCancelOnPointerExit) {
        this.cancel(e);
      }
    }
  }

  onTouchEnd(e: TouchEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    e.stopPropagation();
    if (!this.state.isPressed) {
      return;
    }

    const touch = PressTracker.getTouchById(e, this.state.activePointerId);
    if (
      touch &&
      PressTracker.isOverTarget(touch, e.currentTarget as HTMLElement)
    ) {
      this.triggerPressUp(e, this.state.pointerType);
      this.triggerPressEnd(e, this.state.pointerType);
    } else if (this.state.isOverTarget) {
      this.triggerPressEnd(e, this.state.pointerType, false);
    }

    this.state.isPressed = false;
    this.state.activePointerId = null;
    this.state.isOverTarget = false;
    this.state.ignoreEmulatedMouseEvents = true;
    if (!this.parameters.allowTextSelectionOnPress) {
      restoreTextSelection(this.state.target);
    }
    this.globalListeners?.removeAll();
  }

  onTouchCancel(e: TouchEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    e.stopPropagation();
    if (this.state.isPressed) {
      this.cancel(e);
    }
  }

  globalOnScroll(e: Event): void {
    if (
      this.state.isPressed &&
      (e.target as Node).contains(this.state.target)
    ) {
      this.cancel({
        currentTarget: this.state.target,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
        altKey: false,
      });
    }
  }

  onDragStartNPE(e: DragEvent): void {
    if (!PressTracker.currentTargetContainsTarget(e)) {
      return;
    }

    this.cancel(e);
  }

  // ---------------

  static currentTargetContainsTarget(e: Event): boolean {
    return (e.currentTarget as Node).contains(e.target as Node);
  }

  static createEvent(target: HTMLElement, e: EventBase): EventBase {
    return {
      currentTarget: target,
      shiftKey: e.shiftKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      altKey: e.altKey,
    };
  }

  static isHTMLAnchorLink(target: HTMLElement): boolean {
    return target.tagName === 'A' && target.hasAttribute('href');
  }

  static isValidKeyboardEvent(event: KeyboardEvent): boolean {
    const { key, code, target } = event;
    const element = target as HTMLElement;
    const { tagName, isContentEditable } = element;
    const role = element.getAttribute('role');
    // Accessibility for keyboards. Space and Enter only.
    // "Spacebar" is for IE 11
    return (
      (key === 'Enter' ||
        key === ' ' ||
        key === 'Spacebar' ||
        code === 'Space') &&
      tagName !== 'INPUT' &&
      tagName !== 'TEXTAREA' &&
      isContentEditable !== true &&
      // A link with a valid href should be handled natively,
      // unless it also has role='button' and was triggered using Space.
      (!PressTracker.isHTMLAnchorLink(element) ||
        (role === 'button' && key !== 'Enter')) &&
      // An element with role='link' should only trigger with Enter key
      !(role === 'link' && key !== 'Enter')
    );
  }

  static getTouchFromEvent(event: TouchEvent): Touch | null {
    const { targetTouches } = event;
    if (targetTouches.length > 0) {
      return targetTouches[0];
    }
    return null;
  }

  static getTouchById(event: TouchEvent, pointerId: null | number): null | Touch {
    const changedTouches = event.changedTouches;
    for (let i = 0; i < changedTouches.length; i++) {
      const touch = changedTouches[i];
      if (touch.identifier === pointerId) {
        return touch;
      }
    }
    return null;
  }

  static shouldPreventDefault(target: Element): boolean {
    // We cannot prevent default if the target is inside a draggable element.
    return !target.closest('[draggable="true"]');
  }

  static shouldPreventDefaultKeyboard(target: Element): boolean {
    return !(
      (target.tagName === 'INPUT' || target.tagName === 'BUTTON') &&
      (target as HTMLButtonElement | HTMLInputElement).type === 'submit'
    );
  }

  /**
   * Keyboards, Assistive Technologies, and element.click() all produce a "virtual"
   * click event. This is a method of inferring such clicks. Every browser except
   * IE 11 only sets a zero value of "detail" for click events that are "virtual".
   * However, IE 11 uses a zero value for all click events. For IE 11 we rely on
   * the quirk that it produces click events that are of type PointerEvent, and
   * where only the "virtual" click lacks a pointerType field.
   */
  static isVirtualClick(event: MouseEvent | PointerEvent): boolean {
    // JAWS/NVDA with Firefox. Non-standard property.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((event as any).mozInputSource === 0 && event.isTrusted) {
      return true;
    }

    return event.detail === 0 && !(event as PointerEvent).pointerType;
  }

  static isVirtualPointerEvent(event: PointerEvent): boolean {
    // If the pointer size is zero, then we assume it's from a screen reader.
    // Android TalkBack double tap will sometimes return a event with width and height of 1
    // and pointerType === 'mouse' so we need to check for a specific combination of event attributes.
    // Cannot use "event.pressure === 0" as the sole check due to Safari pointer events always returning pressure === 0
    // instead of .5, see https://bugs.webkit.org/show_bug.cgi?id=206216
    return (
      (event.width === 0 && event.height === 0) ||
      (event.width === 1 &&
        event.height === 1 &&
        event.pressure === 0 &&
        event.detail === 0)
    );
  }

  static isOverTarget(point: EventPoint, target: HTMLElement): boolean {
    const rect = target.getBoundingClientRect();
    const pointRect = PressTracker.getPointClientRect(point);
    return PressTracker.areRectanglesOverlapping(rect, pointRect);
  }

  static getPointClientRect(point: EventPoint): Rect {
    const offsetX = point.width / 2 || point.radiusX || 0;
    const offsetY = point.height / 2 || point.radiusY || 0;

    return {
      top: point.clientY - offsetY,
      right: point.clientX + offsetX,
      bottom: point.clientY + offsetY,
      left: point.clientX - offsetX,
    };
  }

  static areRectanglesOverlapping(a: Rect, b: Rect): boolean {
    // check if they cannot overlap on x axis
    if (a.left > b.right || b.left > a.right) {
      return false;
    }
    // check if they cannot overlap on y axis
    if (a.top > b.bottom || b.top > a.bottom) {
      return false;
    }
    return true;
  }
}

interface Rect {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface EventPoint {
  clientX: number;
  clientY: number;
  width?: number;
  height?: number;
  radiusX?: number;
  radiusY?: number;
}
