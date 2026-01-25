/**
 * 404 Not Found page component
 *
 * Displayed when a route is not found
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { PageData } from '../../shared/types.js';

@customElement('scion-page-404')
export class ScionPage404 extends LitElement {
  /**
   * Page data from SSR
   */
  @property({ type: Object })
  accessor pageData: PageData | null = null;

  static override styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
    }

    .container {
      text-align: center;
      max-width: 480px;
      padding: 2rem;
    }

    .code {
      font-size: 8rem;
      font-weight: 800;
      line-height: 1;
      background: linear-gradient(135deg, var(--scion-primary, #3b82f6) 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--scion-text, #1e293b);
      margin: 0 0 0.75rem 0;
    }

    p {
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 2rem 0;
      line-height: 1.6;
    }

    .path {
      font-family: monospace;
      background: var(--scion-bg, #f8fafc);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
    }

    .btn-primary {
      background: var(--scion-primary, #3b82f6);
      color: white;
    }

    .btn-primary:hover {
      background: var(--scion-primary-hover, #2563eb);
    }

    .btn-secondary {
      background: var(--scion-surface, #ffffff);
      color: var(--scion-text, #1e293b);
      border: 1px solid var(--scion-border, #e2e8f0);
    }

    .btn-secondary:hover {
      background: var(--scion-bg, #f8fafc);
    }

    .btn svg {
      width: 1.25rem;
      height: 1.25rem;
    }
  `;

  override render() {
    const requestedPath = this.pageData?.path || 'unknown';

    return html`
      <div class="container">
        <div class="code">404</div>
        <h1>Page Not Found</h1>
        <p>
          Sorry, we couldn't find the page you're looking for. The path
          <span class="path">${requestedPath}</span> doesn't exist.
        </p>
        <div class="actions">
          <a href="/" class="btn btn-primary"> ${this.renderIcon('home')} Back to Dashboard </a>
          <a href="javascript:history.back()" class="btn btn-secondary">
            ${this.renderIcon('arrow-left')} Go Back
          </a>
        </div>
      </div>
    `;
  }

  private renderIcon(name: string) {
    const icons: Record<string, unknown> = {
      home: html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>`,
      'arrow-left': html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>`,
    };
    return icons[name] || html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scion-page-404': ScionPage404;
  }
}
