/**
 * Main application shell component
 *
 * Provides the overall layout structure with sidebar navigation and content area
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { User } from '../shared/types.js';

@customElement('scion-app')
export class ScionApp extends LitElement {
  /**
   * Current authenticated user
   */
  @property({ type: Object })
  accessor user: User | null = null;

  /**
   * Current URL path for navigation highlighting
   */
  @property({ type: String })
  accessor currentPath = '/';

  static override styles = css`
    :host {
      display: flex;
      min-height: 100vh;
    }

    .sidebar {
      width: var(--scion-sidebar-width, 260px);
      background: var(--scion-surface, #ffffff);
      border-right: 1px solid var(--scion-border, #e2e8f0);
      display: flex;
      flex-direction: column;
    }

    .logo {
      padding: 1.5rem;
      border-bottom: 1px solid var(--scion-border, #e2e8f0);
    }

    .logo h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--scion-primary, #3b82f6);
      margin: 0;
    }

    .logo span {
      font-size: 0.75rem;
      color: var(--scion-text-muted, #64748b);
    }

    nav {
      flex: 1;
      padding: 1rem;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-section-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--scion-text-muted, #64748b);
      margin-bottom: 0.5rem;
      padding: 0 0.75rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: 0.5rem;
      color: var(--scion-text, #1e293b);
      text-decoration: none;
      transition: background-color 0.15s ease;
    }

    .nav-link:hover {
      background: var(--scion-bg, #f8fafc);
    }

    .nav-link.active {
      background: var(--scion-primary, #3b82f6);
      color: white;
    }

    .nav-link svg {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: var(--scion-bg, #f8fafc);
    }

    .header {
      height: 60px;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--scion-surface, #ffffff);
      border-bottom: 1px solid var(--scion-border, #e2e8f0);
    }

    .breadcrumb {
      font-size: 0.875rem;
      color: var(--scion-text-muted, #64748b);
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: var(--scion-primary, #3b82f6);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .content {
      flex: 1;
      padding: 1.5rem;
      overflow: auto;
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -100%;
        top: 0;
        bottom: 0;
        z-index: 100;
        transition: left 0.3s ease;
      }

      .sidebar.open {
        left: 0;
      }

      :host {
        flex-direction: column;
      }
    }
  `;

  override render() {
    const initials = this.user?.name
      ? this.user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : '?';

    return html`
      <aside class="sidebar">
        <div class="logo">
          <h1>Scion</h1>
          <span>Agent Orchestration</span>
        </div>

        <nav>
          <div class="nav-section">
            <div class="nav-section-title">Overview</div>
            <a href="/" class="nav-link ${this.currentPath === '/' ? 'active' : ''}">
              ${this.renderIcon('home')} Dashboard
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">Management</div>
            <a
              href="/groves"
              class="nav-link ${this.currentPath.startsWith('/groves') ? 'active' : ''}"
            >
              ${this.renderIcon('folder')} Groves
            </a>
            <a
              href="/agents"
              class="nav-link ${this.currentPath.startsWith('/agents') ? 'active' : ''}"
            >
              ${this.renderIcon('cpu')} Agents
            </a>
          </div>

          <div class="nav-section">
            <div class="nav-section-title">System</div>
            <a
              href="/settings"
              class="nav-link ${this.currentPath === '/settings' ? 'active' : ''}"
            >
              ${this.renderIcon('settings')} Settings
            </a>
          </div>
        </nav>
      </aside>

      <main class="main">
        <header class="header">
          <div class="breadcrumb">${this.getBreadcrumb()}</div>
          <div class="user-menu">
            ${this.user
              ? html`
                  <span>${this.user.name}</span>
                  <div class="user-avatar">${initials}</div>
                `
              : html`<a href="/auth/login">Sign in</a>`}
          </div>
        </header>

        <div class="content">
          <slot></slot>
        </div>
      </main>
    `;
  }

  private getBreadcrumb(): string {
    const path = this.currentPath;
    if (path === '/') return 'Dashboard';
    if (path === '/groves') return 'Groves';
    if (path.startsWith('/groves/')) return 'Groves / Details';
    if (path === '/agents') return 'Agents';
    if (path.startsWith('/agents/')) return 'Agents / Details';
    if (path === '/settings') return 'Settings';
    return 'Page Not Found';
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
      cpu: html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>`,
      settings: html`<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>`,
    };
    return icons[name] || html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'scion-app': ScionApp;
  }
}
