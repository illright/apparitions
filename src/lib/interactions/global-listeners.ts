/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

type EventListenerInferring<EventName> = EventName extends keyof DocumentEventMap
  ? (this: Document, _ev: DocumentEventMap[EventName]) => void
  : EventListener;

interface RecordedEventListenerOptions {
  eventName: string;
  eventTarget: EventTarget;
  fn: (_evt: Event) => void;
  options: AddEventListenerOptions;
}

export class GlobalListeners {
  private globalListeners: Map<EventListener, RecordedEventListenerOptions>;

  constructor() {
    this.globalListeners = new Map();
  }

  add<EventName extends string>(
    eventTarget: EventTarget,
    eventName: EventName,
    listener: EventListenerInferring<EventName>,
    options: AddEventListenerOptions
  ): void {
    // Make sure we remove the listener after it is called with the `once` option.
    const fn = options.once
      ? (evt: Event) => {
          this.globalListeners.delete(listener);
          listener(evt);
        }
      : listener;
    this.globalListeners.set(listener, {
      eventName,
      eventTarget,
      fn,
      options,
    });
    eventTarget.addEventListener(eventName, listener, options);
  }

  remove<EventName extends string>(
    eventTarget: EventTarget,
    eventName: EventName,
    listener: EventListenerInferring<EventName>,
    options: AddEventListenerOptions
  ): void {
    const fn = this.globalListeners.get(listener)?.fn || listener;
    eventTarget.removeEventListener(eventName, fn, options);
    this.globalListeners.delete(listener);
  }

  removeAll(): void {
    this.globalListeners.forEach((value, key) => {
      this.remove(value.eventTarget, value.eventName, key, value.options);
    });
  }
}
