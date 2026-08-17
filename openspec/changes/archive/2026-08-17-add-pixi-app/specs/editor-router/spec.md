## ADDED Requirements

### Requirement: Editor page hosts the application shell

The editor location SHALL render the application shell. Routing MUST NOT own renderer creation or destruction.

#### Scenario: Editor route shows the shell
- **GIVEN** the application is running
- **WHEN** a user opens or refreshes the editor location
- **THEN** the application shell is visible

## REMOVED Requirements

### Requirement: Editor page hosts the shell without a renderer

**Reason**: The editor page now attaches a drawing surface. A route-level ban on WebGL/WebGPU would block feat-005.

**Migration**: The editor location still shows the application shell (see ADDED “Editor page hosts the application shell”). Renderer lifecycle is specified under pixi-application.
