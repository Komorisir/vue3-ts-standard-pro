## Purpose

Provides the editor's four-region application chrome and a stable canvas host so a renderer can attach later without the page collapsing.

## ADDED Requirements

### Requirement: Four-region editor chrome

The editor page SHALL present a top bar, a left tool rail, a central canvas region, and a right side panel at the same time.

#### Scenario: First visit shows all four regions
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the top bar, left rail, canvas region, and right panel are all visible
- **AND** the top bar and side rails MAY be placeholders that do not perform file or layer actions

### Requirement: Stable canvas host

The canvas region SHALL expose a dedicated host element that keeps a non-zero width and height while the window is visible, and SHALL resize when the window size changes.

#### Scenario: Host has measurable size
- **GIVEN** the editor page is visible in a desktop-sized window
- **WHEN** the layout completes
- **THEN** the canvas host has a non-zero width and a non-zero height

#### Scenario: Host follows window resize
- **GIVEN** the editor page is visible
- **WHEN** the user resizes the window
- **THEN** the canvas host dimensions update to remain inside the central region

### Requirement: Empty-document hint on the host

When no document image is shown, the canvas host SHALL display a hint that the user can drop an image or choose to open one. This change MUST NOT perform the open or drop action.

#### Scenario: Empty host copy
- **GIVEN** the editor page has no imported image
- **WHEN** the user looks at the canvas host
- **THEN** they see the hint to drop an image or click to open
- **AND** clicking or dropping MUST NOT be required to succeed in this change

### Requirement: Shell does not start a renderer

The application shell SHALL NOT initialize a WebGL or WebGPU renderer.

#### Scenario: Layout without a drawing surface
- **GIVEN** a user opens the editor page after the shell is enabled
- **WHEN** the view finishes loading
- **THEN** the four regions are visible
- **AND** no WebGL or WebGPU context is created by this page
