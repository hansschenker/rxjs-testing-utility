import { Timeline } from '../models/timeline';

export function renderTimelineAscii(timelines: Timeline[]): string {
    const { formatSynchronizedTimeline } = require('../serializers/synchronized-timeline');
    return formatSynchronizedTimeline(timelines, {
        formatEvent: (event: any) => {
            if (event === undefined || event === null) {
                return '?';
            }
            if (typeof event === 'string') {
                return event;
            }
            if (event.kind === 'error') {
                return 'E';
            }
            if (event.kind === 'complete') {
                return 'C';
            }
            return String(event);
        }
    });
}

export function timelineToJson(timelines: Timeline[]): string {
    return JSON.stringify(timelines, null, 2);
}

export function recordedToTimelines<T>(recorded: { subscriptions: Array<{ subscribedTime: number; unsubscribedTime?: number; messages: Array<{ time: number; order?: number; value?: T; kind?: 'N' | 'C' | 'E'; error?: any }> }> }): Timeline[] {
    return recorded.subscriptions.map((subscription, index) => {
        return {
            label: `subscription ${index + 1}`,
            startTime: subscription.subscribedTime,
            endTime: subscription.unsubscribedTime,
            events: subscription.messages.map(message => {
                const time = message.order === undefined ? message.time : [message.time, message.order] as [number, number];
                if (message.kind === 'E') {
                    return { time, event: { kind: 'error', error: message.error } };
                }
                if (message.kind === 'C') {
                    return { time, event: { kind: 'complete' } };
                }
                return { time, event: message.value };
            })
        };
    });
}
