/**
 * Home/Dashboard page component
 *
 * Displays an overview of the system status
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { PageData } from '../../shared/types.js';

@customElement('scion-page-home')
export class ScionPageHome extends LitElement {
  /**
   * Page data from SSR
   */
  @property({ type: Object })
  accessor pageData: PageData | null = null;

  static override styles = css`
    :host {
      display: block;
    }

    .hero {
      background: linear-gradient(135deg, var(--scion-primary, #3b82f6) 0%, #1d4ed8 100%);
      color: white;
      padding: 2rem;
      border-radius: 1rem;
      margin-bottom: 2rem;
    }

    .hero h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .hero p {
      font-size: 1.125rem;
      opacity: 0.9;
      margin: 0;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--scion-surface, #ffffff);
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .stat-card h3 {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--scion-text-muted, #64748b);
      margin: 0 0 0.5rem 0;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--scion-text, #1e293b);
    }

    .stat-change {
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .stat-change.positive {
      color: #10b981;
    }

    .stat-change.negative {
      color: #ef4444;
    }

    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--scion-text, #1e293b);
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: var(--scion-surface, #ffffff);
      border: 1px solid var(--scion-border, #e2e8f0);
      border-radius: 0.75rem;
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.15s ease;
      text-decoration: none;
      color: inherit;
    }

    .action-card:hover {
      border-color: var(--scion-primary, #3b82f6);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
    }

    .action-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      background: var(--scion-bg, #f8fafc);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--scion-primary, #3b82f6);
    }

    .action-icon svg {
      width: 1.25rem;
      height: 1.25rem;
    }

    .action-text h4 {
      font-size: 0.9375rem;
      font-weight: 600;
      margin: 0 0 0.25rem 0;
    }

    .action-text p {
      font-size: 0.8125rem;
      color: var(--scion-text-muted, #64748b);
      margin: 0;
    }
  `;

  override render() {
    const userName = this.pageData?.user?.name?.split(' ')[0] || 'there';

    return html`
      <div class="hero">
        <h1>Welcome back, ${userName}!</h1>
        <p>Here's what's happening with your agents today.</p>
      </div>

      <div class="stats">
        <div class="stat-card">
          <h3>Active Agents</h3>
          <div class="stat-value">--</div>
          <div class="stat-change positive">Ready for work</div>
        </div>
        <div class="stat-card">
          <h3>Groves</h3>
          <div class="stat-value">--</div>
          <div class="stat-change">Project workspaces</div>
        </div>
        <div class="stat-card">
          <h3>Tasks Completed</h3>
          <div class="stat-value">--</div>
          <div class="stat-change positive">This week</div>
        </div>
        <div class="stat-card">
          <h3>System Status</h3>
          <div class="stat-value" style="color: #10b981;">Healthy</div>
          <div class="stat-change">All systems operational</div>
        </div>
      </div>

      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions">
        <a href="/agents" class="action-card">
          <div class="action-icon">${this.renderIcon('plus')}</div>
          <div class="action-text">
            <h4>Create Agent</h4>
            <p>Spin up a new AI agent</p>
          </div>
        </a>
        <a href="/groves" class="action-card">
          <div class="action-icon">${this.renderIcon('folder')}</div>
          <div class="action-text">
            <h4>View Groves</h4>
            <p>Browse project workspaces</p>
          </div>
        </a>
        <a href="/agents" class="action-card">
          <div class="action-icon">${this.renderIcon('terminal')}</div>
          <div class="action-text">
            <h4>Open Terminal</h4>
            <p>Connect to running agent</p>
          </div>
        </a>
      </div>
    `;
  }

  private renderIcon(name: string) {
    const icons: Record<string, unknown> = {
      plus: html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>`,
      folder: html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>`,
      terminal: html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>`,
    };
    return icons[name] || html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scion-page-home': ScionPageHome;
  }
}
