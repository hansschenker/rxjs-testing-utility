import { renderTimelineSvg } from '../svg';
import { Timeline } from '../../models/timeline';

describe('SVG Timeline Renderer', () => {
  describe('renderTimelineSvg', () => {
    it('should generate valid SVG markup', () => {
      const timelines: Timeline[] = [
        {
          label: 'stream',
          events: [{ time: 0, event: 'a' }]
        }
      ];

      const svg = renderTimelineSvg(timelines);

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    });

    it('should include timeline labels', () => {
      const timelines: Timeline[] = [
        {
          label: 'source-stream',
          events: [{ time: 0, event: 'a' }]
        },
        {
          label: 'filtered-result',
          events: [{ time: 0, event: 'a' }]
        }
      ];

      const svg = renderTimelineSvg(timelines);

      expect(svg).toContain('source-stream');
      expect(svg).toContain('filtered-result');
    });

    it('should render event circles', () => {
      const timelines: Timeline[] = [
        {
          label: 'events',
          events: [
            { time: 0, event: 'a' },
            { time: 10, event: 'b' }
          ]
        }
      ];

      const svg = renderTimelineSvg(timelines);

      expect(svg).toContain('circle');
      expect(svg).toContain('r="6"');
    });

    it('should use custom colors for timelines', () => {
      const timelines: Timeline[] = [
        { label: 't1', events: [{ time: 0, event: 'a' }] },
        { label: 't2', events: [{ time: 0, event: 'b' }] }
      ];

      const svg = renderTimelineSvg(timelines, {
        colors: ['#ff0000', '#00ff00']
      });

      expect(svg).toContain('#ff0000');
      expect(svg).toContain('#00ff00');
    });

    it('should respect custom dimensions', () => {
      const timelines: Timeline[] = [
        { label: 'stream', events: [{ time: 0, event: 'a' }] }
      ];

      const svg = renderTimelineSvg(timelines, {
        width: 1200,
        rowHeight: 50,
        eventRadius: 8
      });

      expect(svg).toContain('width="1200"');
      expect(svg).toContain('r="8"');
    });

    it('should render horizontal timeline lines', () => {
      const timelines: Timeline[] = [
        { label: 'stream', events: [{ time: 0, event: 'a' }] }
      ];

      const svg = renderTimelineSvg(timelines);

      expect(svg).toContain('line');
      expect(svg).toContain('stroke="#d1d5db"');
    });

    it('should handle empty timelines', () => {
      const timelines: Timeline[] = [];
      const svg = renderTimelineSvg(timelines);

      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
    });

    it('should calculate SVG height based on number of timelines', () => {
      const timelines: Timeline[] = [
        { label: 't1', events: [{ time: 0, event: 'a' }] },
        { label: 't2', events: [{ time: 0, event: 'b' }] },
        { label: 't3', events: [{ time: 0, event: 'c' }] }
      ];

      const svg = renderTimelineSvg(timelines, { rowHeight: 40 });

      // 3 rows * 40 + 30 padding = 150
      expect(svg).toContain('height="150"');
    });

    it('should render event labels next to circles', () => {
      const timelines: Timeline[] = [
        {
          label: 'stream',
          events: [{ time: 0, event: 'hello' }]
        }
      ];

      const svg = renderTimelineSvg(timelines);

      expect(svg).toContain('hello');
      expect(svg).toContain('text');
    });
  });
});
