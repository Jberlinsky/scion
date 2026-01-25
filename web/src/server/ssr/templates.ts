/**
 * HTML shell templates for SSR
 *
 * Provides the HTML wrapper for server-rendered Lit components
 */

import type { PageData } from '../../shared/types.js';

export interface HtmlTemplateOptions {
  /** Page title */
  title: string;
  /** Rendered component HTML content */
  content: string;
  /** Initial page data for hydration */
  initialData: PageData;
  /** JavaScript files to load */
  scripts: string[];
  /** CSS files to load */
  styles: string[];
}

/**
 * Generates the full HTML document with SSR content
 */
export function getHtmlTemplate(opts: HtmlTemplateOptions): string {
  const escapedData = JSON.stringify(opts.initialData)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(opts.title)} - Scion</title>

    <!-- Preconnect to CDN for faster loading -->
    <link rel="preconnect" href="https://cdn.webawesome.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Web Awesome / Shoelace (loaded in M3, placeholder for now) -->
    <!-- <link rel="stylesheet" href="https://cdn.webawesome.com/dist/themes/default.css"> -->
    <!-- <script type="module" src="https://cdn.webawesome.com/dist/webawesome.js"></script> -->

    <!-- App styles -->
    ${opts.styles.map((s) => `<link rel="stylesheet" href="${s}">`).join('\n    ')}

    <!-- Initial state for hydration -->
    <script id="__SCION_DATA__" type="application/json">${escapedData}</script>

    <style>
        /* Critical CSS */
        :root {
            --scion-primary: #3b82f6;
            --scion-primary-hover: #2563eb;
            --scion-bg: #f8fafc;
            --scion-surface: #ffffff;
            --scion-text: #1e293b;
            --scion-text-muted: #64748b;
            --scion-border: #e2e8f0;
            --scion-sidebar-width: 260px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html, body {
            height: 100%;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: var(--scion-bg);
            color: var(--scion-text);
        }

        #app {
            min-height: 100%;
        }

        /* Prevent FOUC for custom elements */
        scion-app:not(:defined),
        scion-page-home:not(:defined),
        scion-page-404:not(:defined) {
            display: block;
            opacity: 0.5;
        }
    </style>
</head>
<body>
    <div id="app">${opts.content}</div>

    <!-- Hydration scripts -->
    ${opts.scripts.map((s) => `<script type="module" src="${s}"></script>`).join('\n    ')}
</body>
</html>`;
}

/**
 * Escape HTML entities to prevent XSS
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Get page title based on URL path
 */
export function getPageTitle(path: string): string {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/groves': 'Groves',
    '/agents': 'Agents',
    '/settings': 'Settings',
  };

  // Check for exact match
  if (titles[path]) {
    return titles[path];
  }

  // Check for pattern matches
  if (path.startsWith('/groves/')) {
    return 'Grove Details';
  }
  if (path.startsWith('/agents/')) {
    return 'Agent Details';
  }

  return 'Page Not Found';
}
