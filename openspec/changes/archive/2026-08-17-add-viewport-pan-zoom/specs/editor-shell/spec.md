## MODIFIED Requirements

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
