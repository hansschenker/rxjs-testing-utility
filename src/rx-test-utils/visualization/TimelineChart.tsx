import { Timeline } from '../models/timeline';

export interface TimelineSvgOptions {
  width?: number;
  rowHeight?: number;
  eventRadius?: number;
  colors?: string[];
}

export function renderTimelineSvg(timelines: Timeline[], options: TimelineSvgOptions = {}) {
  const width = options.width || 900;
  const rowHeight = options.rowHeight || 42;
  const eventRadius = options.eventRadius || 6;
  const colors = options.colors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const maxTime = Math.max(
    0,
    ...timelines.reduce((acc, timeline) => {
      const times = timeline.events.map(event => {
        const value = event.time as any;
        return Array.isArray(value) ? value[0] : value;
      });
      return acc.concat(times);
    }, [] as number[])
  );

  const svgWidth = width;
  const svgHeight = rowHeight * timelines.length + 30;

  let y = 20;
  const rows = timelines.map((timeline, index) => {
    const xFor = (time: number) => 50 + (time / Math.max(1, maxTime)) * (svgWidth - 100);

    const events = timeline.events.map(event => {
      const value = event.time as any;
      const time = Array.isArray(value) ? value[0] : value;
      const x = xFor(time);
      const cy = y + rowHeight / 2;

      return `
        <g>
          <circle cx="${x}" cy="${cy}" r="${eventRadius}" fill="${colors[index % colors.length]}" />
          <text x="${x + 10}" y="${cy + 4}" font-size="11" fill="#111827">${String(event.event)}</text>
        </g>
      `;
    }).join('');

    const row = `
      <g>
        <text x="10" y="${y + rowHeight / 2 + 4}" font-size="12" fill="#111827">${String(timeline.label)}</text>
        <line x1="50" y1="${y + rowHeight / 2}" x2="${svgWidth - 20}" y2="${y + rowHeight / 2}" stroke="#d1d5db" />
        ${events}
      </g>
    `;

    y += rowHeight;
    return row;
  }).join('');

  return `
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      ${rows}
    </svg>
  `;
}
