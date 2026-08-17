## Purpose

Provides the editor's four-region application chrome and a stable canvas host so a renderer can attach later without the page collapsing.

## Requirements

### Requirement: Four-region editor chrome

The editor page SHALL present a top bar, a left tool rail, a central canvas region, and a right side panel at the same time. The top bar Open action SHALL import a local image. The top bar Fit action SHALL fit the main image in the view. The tool rail pan tool SHALL pan the view. Other chrome controls MAY remain placeholders that do not perform file or layer actions.

#### Scenario: First visit shows all four regions
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the top bar, left rail, canvas region, and right panel are all visible
- **AND** the Open action is available
- **AND** the Fit action is available
- **AND** the pan tool is available
- **AND** undo, redo, export, and the remaining tools MAY stay inactive

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

When no document image is shown, the canvas host SHALL display a hint that the user can drop an image or choose to open one. After a drawing surface is attached and the document is still empty, the hint MUST remain visible above that surface. After at least one image is imported, the hint MUST be hidden. Clicking the empty host or dropping a file onto it SHALL start import, except when the pan tool is active or the pointer is performing a pan gesture.

#### Scenario: Empty host copy
- **GIVEN** the editor page has no imported image
- **WHEN** the user looks at the canvas host
- **THEN** they see the hint to drop an image or click to open

#### Scenario: Hint remains after the canvas is attached
- **GIVEN** the editor page has no imported image
- **AND** the drawing canvas is attached to the host
- **WHEN** the user looks at the canvas host
- **THEN** the hint is still visible

#### Scenario: Hint hides after an image is imported
- **GIVEN** the editor page has at least one imported image
- **WHEN** the user looks at the canvas host
- **THEN** the empty-document hint is not visible

#### Scenario: Pan tool does not open the file picker
- **GIVEN** the editor page has no imported image
- **AND** the pan tool is active
- **WHEN** the user clicks the canvas host
- **THEN** the file picker does not open

### Requirement: Chrome regions do not create a renderer

The top bar, left tool rail, and right side panel SHALL NOT initialize a WebGL or WebGPU renderer. Only the canvas host MAY display a drawing surface created by the engine lifecycle.

#### Scenario: Panels stay free of a drawing context
- **GIVEN** a user opens the editor page
- **WHEN** the view finishes loading
- **THEN** the top bar, left rail, and right panel contain no canvas created by this editor
- **AND** any drawing canvas is inside the canvas host
