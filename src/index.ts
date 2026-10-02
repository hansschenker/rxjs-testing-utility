import * as React from 'react';

import { Timeline } from '../models/timeline';
import { renderTimelineSvg } from './svg';

export interface TimelineChartProps {
  timelines: Timeline[];
}

export class TimelineChart extends React.Component<TimelineChartProps, {}> {
  render() {
    const svg = renderTimelineSvg(this.props.timelines, {
      width: 900,
      rowHeight: 42,
      eventRadius: 6
    });

    return (
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    );
  }
}
