# Podman Runtime Support

## Overview
This document outlines the design for adding Podman as a supported container runtime in Scion. Podman provides a daemonless, rootless alternative to Docker, sharing a largely compatible CLI but offering different architectural benefits, particularly regarding security and process isolation.

## Motivation
- **Security**: Podman's rootless mode is a significant advantage for users who cannot or do not want to run a root-level daemon.
- **Compatibility**: Many developers use Podman as a drop-in replacement for Docker (often aliased). Native support ensures Scion works correctly without relying on aliases.
- **Ecosystem**: Podman is the default container tool in several Linux distributions (e.g., RHEL, Fedora) and is gaining popularity on macOS via Podman Machine.

## Implementation Design

### 1. `PodmanRuntime` Implementation
A new `PodmanRuntime` struct will be added to `pkg/runtime/podman.go`, implementing the `Runtime` interface defined in `pkg/runtime/interface.go`.

```go
type PodmanRuntime struct {
    Command string // defaults to "podman"
}
```

### 2. Command Compatibility
Most Podman commands are identical to Docker, allowing for significant code reuse or a similar structure to `DockerRuntime`:
- `podman run`: Supports `--memory`, `--cpus`, `-v` (bind mounts), and `-l` (labels).
- `podman stop`, `podman rm`, `podman logs`, `podman exec`, `podman attach`, `podman pull`.
- `podman inspect`: Similar output structure for mounts.

### 3. Key Differences & Challenges

#### JSON Output Format (`podman ps`)
Docker's `docker ps --format '{{json .}}'` returns a stream of newline-separated JSON objects.
Podman's `podman ps --format json` returns a single JSON array of objects.

Furthermore, field names and types differ:
- **Docker**: `ID`, `Names`, `Status`, `Image`, `Labels` (all strings; Labels is CSV).
- **Podman**: `Id`, `Names` (array), `Status`, `Image`, `Labels` (map).

`PodmanRuntime.List()` must implement a custom parser for this format.

#### Rootless Bind Mounts
In rootless mode, Podman uses user namespaces. Bind mounts of local directories (like `.scion/agents/...`) might require `idmap` options or specific ownership if the container process runs as a non-root user (which Scion agents typically do via the `scion` user).

<!-- feedback - please research that this is done as part of the sciontool init process, it should handle the GID/UID swap from the host user ID for mounts access by the container scion user -->

#### Podman Machine (macOS/Windows)
On macOS, Podman runs inside a virtual machine. The `podman` CLI communicates with the VM via SSH.
- `GetWorkspacePath`: This method returns the host path to the workspace. For Podman on macOS, this path must be accessible both to the host (for Scion) and the VM (via virtiofs/9p mounts) to be correctly mounted into the container.

### 4. Integration Plan

#### Environment Detection
`podman system info --format json` can be used to detect if Podman is available and whether it is running in rootless mode or via a remote service (like Podman Machine). This can help in providing better error messages or auto-configuring mount options.

#### Factory Registration
Update `pkg/runtime/factory.go` to recognize "podman" as a runtime type.

#### API Updates
Update `pkg/api/types.go` and other relevant documentation to include `podman` in the list of supported runtimes.

#### Configuration
Users can specify the runtime in their profile configuration:
```yaml
runtimes:
  podman:
    type: podman
```
<!-- feedback, our initialized default settings.yaml should include this as an option for discoverability -->

## Testing Strategy
- **Unit Tests**: Create `pkg/runtime/podman_test.go` using a mockable command runner to verify argument construction and JSON parsing.
- **Integration Tests**: Verify end-to-end functionality (create, start, attach, stop) on a system with Podman installed.
- **Cross-Platform**: Specifically test on Linux (native) and macOS (Podman Machine).
