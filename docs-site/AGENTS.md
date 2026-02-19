# Scion Documentation Meta-Guide

This guide outlines the organizational philosophy, architecture, and curation standards for the Scion documentation project. It serves as a blueprint for both human and AI contributors to ensure a consistent and navigable documentation experience.

## 1. Documentation Dimensions

Scion documentation must navigate three primary dimensions:

| Dimension | Variants |
| :--- | :--- |
| **User Persona** | End User (Developer), Administrator (DevOps/Ops), Contributor (Core Developer) |
| **Operational Mode** | Solo (Local-only, zero-config), Hosted (Distributed, Hub-centric) |
| **Interface** | CLI (Primary), Web Dashboard (Visualization & Control) |

Note no one variant within a dimension has supremacy over another.

## 2. Content Architecture

The documentation is organized into five functional pillars. The "Intersection" of dimensions is handled by grouping guides by **Persona** and then branching by **Mode**.

### I. Foundations (Everyone)
*   **Overview**: High-level value proposition.
*   **Core Concepts**: Universal primitives (Grove, Harness, Profile, Runtime, Agent).
*   **Supported Harnesses**: List of available LLM harnesses.
*   **Glossary**: Standardized terminology.

### II. Developer's Guide (End Users)
*   **Solo Workflow (The "Local" Path)**:
    *   Installation & Quick Start.
    *   Workspace Management.
    *   Local Configuration (`settings.json`).
*   **Hosted Workflow (The "Team" Path)**:
    *   Connecting to a Scion Hub.
    *   Using the Web Dashboard.
    *   Secret Management (Hub-based).
*   **How To (Shared)**:
    *   Working with Templates & Harnesses.
    *   Interactive sessions (Tmux/Attach).

### III. Administrator's Guide (Ops/Admins)
*   **Infrastructure Deployment**:
    *   Setting up the Scion Hub (Persistence, Web Server).
    *   Provisioning Runtime Brokers (Docker, Podman, Apple Virtualization).
    *   Kubernetes Integration (Pod management, SCM strategies).
*   **Security & Identity**:
    *   Authentication flows (OAuth vs. Dev Auth).
    *   Permissions & Policy design.
*   **Operations**:
    *   Observability (Logs & Monitoring).
    *   Metrics collection.

### IV. Contributor's Guide (Developers)
*   **Architecture Deep Dive**: Internal component interactions.
*   **Development Guides**: Local logging, etc.
*   **Design Catalog**: Historical and future design specifications (mirrored from `.design/`).

### V. Technical Reference (Everyone)
*   **CLI Reference**: Generated command documentation (under `reference/cli/`).
*   **API Reference**: Hub and Runtime Broker REST/WebSocket specifications.

## 3. Handling the Intersections

### Mode Intersection (Solo vs. Hosted)
*   **The Default is Solo**: All "Getting Started" content assumes Solo mode to minimize friction.
*   **The "Upgrade" Pattern**: Hosted mode features are presented as enhancements. For example, the "Secret Management" guide should start with "Local Env Vars" and then provide a "Using the Hub for Secrets" section.

### Interface Intersection (CLI vs. Web)
*   **Action-Oriented Documentation**: For any user task (e.g., "Starting an Agent"), the documentation should provide instructions for both interfaces using a tabbed or side-by-side format:
    *   **CLI**: `scion start ...`
    *   **Web**: Navigation path in the UI.

## 4. Starlight Sidebar Configuration

The `astro.config.mjs` sidebar reflects this hierarchy. When adding new files, ensure they are registered in the sidebar:

```javascript
sidebar: [
    {
        label: 'Foundations',
        items: [
            { label: 'Overview', slug: 'overview' },
            { label: 'Core Concepts', slug: 'concepts' },
            // ...
        ],
    },
    {
        label: 'Developer Guide',
        items: [
            {
                label: 'Local Workflow',
                items: [ /* ... */ ],
            },
            {
                label: 'Team Workflow',
                items: [ /* ... */ ],
            },
            // ...
        ],
    },
    // ...
]
```

## 5. Curation Standards

1.  **Code-First Truth**: Documentation should be updated in the same PR as the feature implementation.
2.  **Source of Truth**:
    *   Always check `.design/` for architectural intent.
    *   Consult `pkg/` for implementation details.
    *   Verify CLI flags in `cmd/`.
3.  **Persona-Specific Tone**:
    *   *User docs* should be practical and task-oriented.
    *   *Admin docs* should be technical and detail-oriented.
    *   *Reference docs* should be exhaustive and dry.
4.  **Diagrams**: Use **D2** for all diagrams. Include them in `d2` code blocks within Markdown files.
5.  **Cross-Linking**: Link from high-level guides to specific references to avoid duplication.

## 6. Agent Workflow & Verification

### Status Reporting
Before asking the user a question or completing a task, use the following commands to update the agent's status:

*   **Asking User**: `sciontool status ask_user "<question>"`
*   **Task Completed**: `sciontool status task_completed "<task title>"`

### Verification Steps
*   **Link Check**: Ensure all relative links between documents are valid.
*   **Sidebar Verification**: Ensure new pages are added to `docs-site/astro.config.mjs`.
*   **Formatting**: Use standard Markdown. Starlight supports [Callouts](https://starlight.astro.build/guides/authoring-content/#asides) (Note, Tip, Caution, Danger).

**Note on D2**: The `d2` CLI may not be available in all environments. If you cannot run `./check-d2.sh`, ensure your D2 syntax is correct according to [D2 documentation](https://d2lang.com/tour/intro).
