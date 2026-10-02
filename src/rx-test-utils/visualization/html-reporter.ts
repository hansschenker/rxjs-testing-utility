import { Timeline } from '../models/timeline';
import { renderTimelineSvg } from './svg';
import { renderTimelineAscii, timelineToJson } from './timelines';

export interface HtmlReportOptions {
  title?: string;
  description?: string;
  includeJson?: boolean;
  includeAscii?: boolean;
  svgOptions?: any;
}

export function generateHtmlReport(
  timelines: Timeline[],
  options: HtmlReportOptions = {}
): string {
  const title = options.title || 'Timeline Report';
  const description = options.description || 'Observable Timeline Visualization';
  const includeJson = options.includeJson !== false;
  const includeAscii = options.includeAscii !== false;

  const svgContent = renderTimelineSvg(timelines, options.svgOptions);
  const jsonContent = includeJson ? timelineToJson(timelines) : null;
  const asciiContent = includeAscii ? renderTimelineAscii(timelines) : null;

  const json = jsonContent ? `
    <section class="section">
      <h2>Timeline Data (JSON)</h2>
      <pre class="json"><code>${escapeHtml(jsonContent)}</code></pre>
      <button class="copy-btn" data-target="json-content">Copy JSON</button>
    </section>
  ` : '';

  const ascii = asciiContent ? `
    <section class="section">
      <h2>ASCII Timeline</h2>
      <pre class="ascii"><code>${escapeHtml(asciiContent)}</code></pre>
      <button class="copy-btn" data-target="ascii-content">Copy ASCII</button>
    </section>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }

    header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: 700;
    }

    header p {
      font-size: 1.1em;
      opacity: 0.9;
    }

    main {
      padding: 40px;
    }

    .section {
      margin-bottom: 40px;
      padding: 30px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #667eea;
    }

    .section h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 1.5em;
    }

    .svg-container {
      background: white;
      padding: 20px;
      border-radius: 6px;
      overflow-x: auto;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    svg {
      display: block;
      width: 100%;
      height: auto;
      margin: 0 auto;
    }

    pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 20px;
      border-radius: 6px;
      overflow-x: auto;
      line-height: 1.4;
      font-size: 0.9em;
      font-family: 'Courier New', monospace;
    }

    pre code {
      color: inherit;
      font-family: inherit;
    }

    .json {
      color: #e8e8e8;
    }

    .json code {
      color: #e8e8e8;
    }

    .ascii {
      color: #66d9ef;
      font-weight: 600;
    }

    .copy-btn {
      margin-top: 10px;
      padding: 10px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9em;
      font-weight: 600;
      transition: background 0.3s ease;
    }

    .copy-btn:hover {
      background: #5568d3;
    }

    .copy-btn:active {
      background: #445bb8;
    }

    footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      border-top: 1px solid #e0e0e0;
      font-size: 0.9em;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      text-align: center;
    }

    .stat-card .value {
      font-size: 2em;
      font-weight: 700;
      color: #667eea;
    }

    .stat-card .label {
      color: #666;
      margin-top: 5px;
      font-size: 0.9em;
    }

    @media (max-width: 768px) {
      header h1 {
        font-size: 1.8em;
      }

      main {
        padding: 20px;
      }

      .section {
        padding: 20px;
      }

      pre {
        font-size: 0.8em;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
    </header>

    <main>
      <div class="stats">
        <div class="stat-card">
          <div class="value">${timelines.length}</div>
          <div class="label">Timelines</div>
        </div>
        <div class="stat-card">
          <div class="value">${timelines.reduce((sum, t) => sum + t.events.length, 0)}</div>
          <div class="label">Total Events</div>
        </div>
        <div class="stat-card">
          <div class="value">${new Date().toLocaleTimeString()}</div>
          <div class="label">Generated</div>
        </div>
      </div>

      <section class="section">
        <h2>SVG Timeline Visualization</h2>
        <div class="svg-container">
          ${svgContent}
        </div>
      </section>

      ${json}
      ${ascii}
    </main>

    <footer>
      <p>RxJS Testing Utility Timeline Report</p>
      <p>Generated on ${new Date().toLocaleString()}</p>
    </footer>
  </div>

  <script>
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const target = this.getAttribute('data-target');
        const element = document.querySelector('.' + target);
        if (element) {
          const text = element.textContent;
          navigator.clipboard.writeText(text).then(() => {
            const original = this.textContent;
            this.textContent = 'Copied!';
            setTimeout(() => {
              this.textContent = original;
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy:', err);
          });
        }
      });
    });
  </script>
</body>
</html>
`;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, char => map[char]);
}

export function saveHtmlReport(html: string, filename: string = 'timeline-report.html'): void {
  if (typeof window === 'undefined') {
    // Node.js environment
    const fs = require('fs');
    fs.writeFileSync(filename, html, 'utf-8');
    console.log(`Report saved to ${filename}`);
  } else {
    // Browser environment
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
