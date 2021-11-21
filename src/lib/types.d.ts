export interface SvelteActionOutput<ParametersType> {
	update?: (newParameters: ParametersType) => void;
	destroy?: () => void;
}

export type EventDispatcher<EventMap> = <EventKey extends keyof EventMap>(
	type: EventKey,
	detail?: EventMap[EventKey]
) => void;
