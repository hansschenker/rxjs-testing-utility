# rxjs-testing-utility

A lightweight TypeScript utility library for recording and visualizing RxJS observable timelines during tests.

## What it includes

- `createRecordingMonitor()` for capturing observable events with deterministic time + order metadata
- `formatSynchronizedTimeline()` for rendering multiple timelines side-by-side
- JSON conversion helpers for timeline export
- SVG output utilities for visual debugging and browser rendering

## Core concepts

The library models each observable event as a time-ordered record:

- `time`: scheduler time
- `order`: ordering within the same time slot
- `event`: the emitted value or lifecycle marker

This lets you compare concurrent streams and identify ordering problems, race conditions, and subscription timing issues.

## Example

```ts
import { createRecordingMonitor, createTimeOrderCoordinator } from './src/rx-test-utils/monitors/recording';
import { monitored } from './src/rx-test-utils/monitor';
import { recordedToTimelines, renderTimelineAscii } from './src/rx-test-utils/visualization/timelines';

const scheduler = /* RxJS TestScheduler */;
const coordinator = createTimeOrderCoordinator();
const { monitor, recorded } = createRecordingMonitor(scheduler, coordinator);

const source$ = monitored(someObservable, monitor);
source$.subscribe();

const timelines = recordedToTimelines(recorded);
console.log(renderTimelineAscii(timelines));
```

## Files

- `src/rx-test-utils/models/timeline.ts`
- `src/rx-test-utils/monitor.ts`
- `src/rx-test-utils/monitors/recording.ts`
- `src/rx-test-utils/serializers/synchronized-timeline.ts`
- `src/rx-test-utils/visualization/timelines.ts`
- `src/rx-test-utils/visualization/svg.ts`
- `src/rx-test-utils/visualization/TimelineChart.tsx`

## License

MIT
