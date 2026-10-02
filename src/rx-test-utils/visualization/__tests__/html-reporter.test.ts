import { generateHtmlReport } from '../html-reporter';
import { Timeline } from '../../models/timeline';

describe('HTML Reporter', () => {
  describe('generateHtmlReport', () => {
    it('should generate valid HTML document', () => {
      const timelines: Timeline[] = [
        { label: 'stream', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('<html');
      expect(html).toContain('</html>');
      expect(html).toContain('<head>');
      expect(html).toContain('<body>');
    });

    it('should include custom title', () => {
      const timelines: Timeline[] = [];
      const html = generateHtmlReport(timelines, {
        title: 'My Custom Timeline Report'
      });

      expect(html).toContain('<title>My Custom Timeline Report</title>');
      expect(html).toContain('<h1>My Custom Timeline Report</h1>');
    });

    it('should include custom description', () => {
      const timelines: Timeline[] = [];
      const html = generateHtmlReport(timelines, {
        description: 'Test Description'
      });

      expect(html).toContain('Test Description');
    });

    it('should include SVG visualization', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).toContain('<svg');
      expect(html).toContain('</svg>');
    });

    it('should include JSON section by default', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).toContain('Timeline Data (JSON)');
      expect(html).toContain('<pre class="json">');
    });

    it('should exclude JSON section when includeJson is false', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines, { includeJson: false });

      expect(html).not.toContain('Timeline Data (JSON)');
    });

    it('should include ASCII section by default', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).toContain('ASCII Timeline');
      expect(html).toContain('<pre class="ascii">');
    });

    it('should exclude ASCII section when includeAscii is false', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines, { includeAscii: false });

      expect(html).not.toContain('ASCII Timeline');
    });

    it('should display timeline statistics', () => {
      const timelines: Timeline[] = [
        { label: 't1', events: [{ time: 0, event: 'a' }, { time: 5, event: 'b' }] },
        { label: 't2', events: [{ time: 0, event: 'x' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).toContain('Timelines');
      expect(html).toContain('Total Events');
      // 2 timelines, 3 total events
      expect(html).toContain('>2<');
      expect(html).toContain('>3<');
    });

    it('should include copy buttons', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).toContain('copy-btn');
      expect(html).toContain('Copy');
    });

    it('should include responsive design styles', () => {
      const timelines: Timeline[] = [];
      const html = generateHtmlReport(timelines);

      expect(html).toContain('@media');
      expect(html).toContain('viewport');
    });

    it('should include interactive JavaScript', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).toContain('<script>');
      expect(html).toContain('navigator.clipboard');
      expect(html).toContain('</script>');
    });

    it('should escape HTML special characters in data', () => {
      const timelines: Timeline[] = [
        { label: '<script>alert("xss")</script>', events: [{ time: 0, event: 'test&value' }] }
      ];

      const html = generateHtmlReport(timelines);

      expect(html).not.toContain('<script>alert');
      expect(html).toContain('&lt;script&gt;');
      expect(html).toContain('&amp;');
    });

    it('should support custom SVG options', () => {
      const timelines: Timeline[] = [
        { label: 'test', events: [{ time: 0, event: 'a' }] }
      ];

      const html = generateHtmlReport(timelines, {
        svgOptions: {
          width: 1500,
          colors: ['#ff0000']
        }
      });

      expect(html).toContain('width="1500"');
      expect(html).toContain('#ff0000');
    });
  });
});
