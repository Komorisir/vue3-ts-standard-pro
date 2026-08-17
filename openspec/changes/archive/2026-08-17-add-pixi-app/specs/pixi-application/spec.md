## Purpose

Owns the editor drawing surface on the existing canvas host: create it after the host is ready, keep it matched to the host size, and tear it down when the user leaves so a later visit does not leak a second surface.

## ADDED Requirements

### Requirement: Drawing surface appears on the canvas host

When the editor page is visible and the canvas host has a non-zero size, the system SHALL attach exactly one drawing canvas as a descendant of that host. The canvas MUST NOT be inserted before initialization of the renderer has finished. Chrome outside the host MUST NOT create a drawing context.

#### Scenario: First visit shows one canvas
- **GIVEN** a user opens the editor location in a desktop-sized window
- **WHEN** the canvas host has a measurable size and the renderer has finished starting
- **THEN** the host contains exactly one canvas element
- **AND** that canvas is visible inside the central canvas region

#### Scenario: Canvas is not mounted before the renderer is ready
- **GIVEN** the editor page has started loading
- **WHEN** the renderer has not finished starting
- **THEN** the host MUST NOT contain a drawing canvas from this renderer

### Requirement: Canvas follows the host size

The drawing canvas SHALL cover the canvas host. When the host size changes while the editor remains visible, the renderer MUST resize so the canvas stays matched to the host.

#### Scenario: Canvas fills the host
- **GIVEN** the editor page is visible and the renderer has started
- **WHEN** the user inspects the canvas host
- **THEN** the drawing canvas width and height match the host client size

#### Scenario: Window resize updates the canvas
- **GIVEN** the editor page is visible with a started renderer
- **WHEN** the user resizes the window and the host dimensions change
- **THEN** the drawing canvas dimensions update to match the host

### Requirement: Renderer uses WebGL and a dark empty stage

This change SHALL create a WebGL drawing context (not WebGPU). Until a document image exists, the stage MAY be empty aside from the renderer background. The background MUST be dark so it does not flash a default white frame over the host.

#### Scenario: Empty editor shows a dark canvas
- **GIVEN** the editor page has no imported image
- **WHEN** the renderer has started
- **THEN** the canvas shows a dark empty surface
- **AND** no document image is required for this change to succeed

### Requirement: Leaving the editor tears down the renderer

When the editor view is unmounted, the system MUST destroy the renderer, remove its canvas from the host, and release renderer resources. A later visit MUST attach exactly one new canvas. If the user leaves before start finishes, the in-flight start MUST still end in a destroyed renderer and no leftover canvas.

#### Scenario: Leave and return shows a single canvas
- **GIVEN** the editor page has a started renderer
- **WHEN** the user navigates away and then returns to the editor location
- **THEN** the host contains exactly one canvas
- **AND** the previous canvas is no longer in the document

#### Scenario: Leave during start does not leak a canvas
- **GIVEN** the editor page has begun starting the renderer
- **AND** start has not finished
- **WHEN** the user navigates away
- **THEN** after the in-flight start settles, the host MUST NOT contain a leftover canvas from that start

### Requirement: Missing host fails without blanking the app

If the canvas host element cannot be found, the system MUST NOT throw an uncaught exception that replaces the application with a blank page. The four-region chrome MAY remain visible.

#### Scenario: Host element is absent
- **GIVEN** the editor view mounts without a canvas host element
- **WHEN** the lifecycle attempts to start the renderer
- **THEN** no uncaught exception blanks the application
- **AND** no drawing canvas is attached
