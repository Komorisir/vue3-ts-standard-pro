## ADDED Requirements

### Requirement: Chrome regions do not create a renderer

The top bar, left tool rail, and right side panel SHALL NOT initialize a WebGL or WebGPU renderer. Only the canvas host MAY display a drawing surface created by the engine lifecycle.

#### Scenario: Panels stay free of a drawing context
- **GIVEN** a user opens the editor page
- **WHEN** the view finishes loading
- **THEN** the top bar, left rail, and right panel contain no canvas created by this editor
- **AND** any drawing canvas is inside the canvas host

## MODIFIED Requirements

### Requirement: Empty-document hint on the host

When no document image is shown, the canvas host SHALL display a hint that the user can drop an image or choose to open one. After a drawing surface is attached, the hint MUST remain visible above that surface. This change MUST NOT perform the open or drop action.

#### Scenario: Empty host copy
- **GIVEN** the editor page has no imported image
- **WHEN** the user looks at the canvas host
- **THEN** they see the hint to drop an image or click to open
- **AND** clicking or dropping MUST NOT be required to succeed in this change

#### Scenario: Hint remains after the canvas is attached
- **GIVEN** the editor page has no imported image
- **AND** the drawing canvas is attached to the host
- **WHEN** the user looks at the canvas host
- **THEN** the hint is still visible
- **AND** the hint MUST NOT block pointer events meant for a later open or drop feature

## REMOVED Requirements

### Requirement: Shell does not start a renderer

**Reason**: The canvas host now receives a drawing surface from the engine lifecycle (pixi-application). Keeping a page-wide ban would contradict feat-005.

**Migration**: Chrome still must not create its own renderer (see ADDED “Chrome regions do not create a renderer”). Canvas attach, resize, and destroy are specified under pixi-application.
