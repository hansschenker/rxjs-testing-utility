export type TimeOrder =
    number |
    [number, number];

export interface TimelineEvent {
    time: TimeOrder;
    event: any;
}

export interface Timeline {
    label?: any;
    startTime?: TimeOrder;
    endTime?: TimeOrder;
    events: TimelineEvent[];
}
