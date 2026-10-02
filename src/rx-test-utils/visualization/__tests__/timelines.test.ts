import { recordToTimeline, recordedToTimelines, renderTimelineAscii, timelineToJson } from '../timelines';
import { Timeline } from '../../models/timeline';

describe('Timeline Visualization', () => {
  describe('recordToTimeline', () => {
    it('should convert messages to a timeline with label', () => {
      const messages = [
        { time: 0, value: 'a' },
        { time: 10, value: 'b' }
      ];

      const timeline = recordToTimeline('test-stream', messages);

      expect(timeline.label).toBe('test-stream');
      expect(timeline.events).toHaveLength(2);
      expect(timeline.events[0].event).toBe('a');
      expect(timeline.events[1].event).toBe('b');
    });

    it('should handle time-order pairs', () => {
      const messages = [
        { time: 10, order: 1, value: 'x' },
        { time: 10, order: 2, value: 'y' }
      ];

      const timeline = recordToTimeline('ordered', messages);

      expect(timeline.events[0].time).toEqual([10, 1]);
      expect(timeline.events[1].time).toEqual([10, 2]);
    });

    it('should format error events', () => {
      const messages = [
        { time: 5, kind: 'E' as const, error: new Error('test error') }
      ];

      const timeline = recordToTimeline('errors', messages);

      expect(timeline.events[0].event.kind).toBe('error');
      expect(timeline.events[0].event.error).toBeInstanceOf(Error);
    });

    it('should format complete events', () => {
      const messages = [
        { time: 0, value: 'a' },
        { time: 10, kind: 'C' as const }
      ];

      const timeline = recordToTimeline('lifecycle', messages);

      expect(timeline.events[1].event.kind).toBe('complete');
    });
  });

  describe('recordedToTimelines', () => {
    it('should convert recorded observable subscriptions to timelines', () => {
      const recorded = {
        subscriptions: [
          {
            subscribedTime: 0,
            messages: [
              { time: 5, order: 0, kind: 'N' as const, value: 'a' },
              { time: 10, order: 0, kind: 'C' as const }
            ]
          },
          {
            subscribedTime: 2,
            unsubscribedTime: 12,
            messages: [
              { time: 8, order: 0, kind: 'N' as const, value: 'b' }
            ]
          }
        ]
      };

      const timelines = recordedToTimelines(recorded);

      expect(timelines).toHaveLength(2);
      expect(timelines[0].label).toBe('subscription 1');
      expect(timelines[0].startTime).toBe(0);
      expect(timelines[1].label).toBe('subscription 2');
      expect(timelines[1].startTime).toBe(2);
      expect(timelines[1].endTime).toBe(12);
    });

    it('should handle empty subscriptions', () => {
      const recorded = { subscriptions: [] };
      const timelines = recordedToTimelines(recorded);
      expect(timelines).toHaveLength(0);
    });
  });

  describe('renderTimelineAscii', () => {
    it('should render a simple timeline as ASCII', () => {
      const timelines: Timeline[] = [
        {
          label: 'stream',
          events: [
            { time: 0, event: 'a' },
            { time: 5, event: 'b' }
          ]
        }
      ];

      const ascii = renderTimelineAscii(timelines);

      expect(ascii).toContain('stream');
      expect(ascii).toContain('a');
      expect(ascii).toContain('b');
    });

    it('should format error events as "E"', () => {
      const timelines: Timeline[] = [
        {
          label: 'errors',
          events: [
            { time: 0, event: { kind: 'error', error: new Error('fail') } }
          ]
        }
      ];

      const ascii = renderTimelineAscii(timelines);
      expect(ascii).toContain('E');
    });

    it('should format complete events as "C"', () => {
      const timelines: Timeline[] = [
        {
          label: 'lifecycle',
          events: [
            { time: 0, event: 'a' },
            { time: 5, event: { kind: 'complete' } }
          ]
        }
      ];

      const ascii = renderTimelineAscii(timelines);
      expect(ascii).toContain('C');
    });

    it('should handle multiple synchronized timelines', () => {
      const timelines: Timeline[] = [
        {
          label: 'source',
          events: [{ time: 0, event: 'x' }]
        },
        {
          label: 'filtered',
          events: [{ time: 0, event: 'x' }]
        }
      ];

      const ascii = renderTimelineAscii(timelines);

      expect(ascii).toContain('source');
      expect(ascii).toContain('filtered');
    });
  });

  describe('timelineToJson', () => {
    it('should serialize timelines to JSON', () => {
      const timelines: Timeline[] = [
        {
          label: 'test',
          events: [{ time: 0, event: 'a' }]
        }
      ];

      const json = timelineToJson(timelines);
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0].label).toBe('test');
      expect(parsed[0].events[0].event).toBe('a');
    });

    it('should maintain time-order pairs in JSON', () => {
      const timelines: Timeline[] = [
        {
          label: 'ordered',
          events: [{ time: [10, 2], event: 'y' }]
        }
      ];

      const json = timelineToJson(timelines);
      const parsed = JSON.parse(json);

      expect(parsed[0].events[0].time).toEqual([10, 2]);
    });

    it('should format with proper indentation', () => {
      const timelines: Timeline[] = [
        {
          label: 'pretty',
          events: [{ time: 0, event: 'a' }]
        }
      ];

      const json = timelineToJson(timelines);

      expect(json).toContain('\n');
      expect(json).toContain('  ');
    });
  });
});
