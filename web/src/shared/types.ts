/**
 * Shared types for server and client
 */

/**
 * User information
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | undefined;
}

/**
 * Initial page data passed from SSR to client
 */
export interface PageData {
  /** Current URL path */
  path: string;
  /** Page title */
  title: string;
  /** Current user (if authenticated) */
  user?: User | undefined;
  /** Additional page-specific data */
  data?: Record<string, unknown> | undefined;
}

/**
 * Route definition for client-side routing
 */
export interface RouteConfig {
  path: string;
  component: string;
  action?: () => Promise<void>;
}
