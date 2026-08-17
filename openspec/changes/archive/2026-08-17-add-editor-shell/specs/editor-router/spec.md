## REMOVED Requirements

### Requirement: Editor page is mountable without canvas chrome
**Reason**: The editor page now hosts four-region chrome. The no-renderer rule moves to `editor-shell` and the replacement requirement below.
**Migration**: Use Requirement: Editor page hosts the shell without a renderer

## ADDED Requirements

### Requirement: Editor page hosts the shell without a renderer

The editor location SHALL render the application shell. Visiting the editor MUST NOT require a drawing surface to be present.

#### Scenario: Editor route shows the shell
- **GIVEN** the application is running
- **WHEN** a user opens or refreshes the editor location
- **THEN** the application shell is visible
- **AND** the page MUST NOT initialize a WebGL or WebGPU renderer
