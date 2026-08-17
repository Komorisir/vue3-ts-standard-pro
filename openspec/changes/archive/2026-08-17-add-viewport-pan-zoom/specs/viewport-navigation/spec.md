## Purpose

Lets the user pan and zoom the drawing view around a document image, and fit that image back into the visible host, without changing the image's document transform.

## ADDED Requirements

### Requirement: User can pan the viewport

The editor SHALL move the visible drawing view when the user drags with the pan tool, holds Space and drags, or drags with the middle mouse button. Panning MUST change only the view, not the imported image's document position or scale.

#### Scenario: Drag with the pan tool
- **GIVEN** the editor page is visible
- **AND** the pan tool is active
- **WHEN** the user left-drags on the canvas host
- **THEN** the drawing view moves with the pointer
- **AND** the imported image's document position and scale are unchanged

#### Scenario: Space or middle-button pan
- **GIVEN** the editor page is visible
- **WHEN** the user holds Space and left-drags, or drags with the middle mouse button
- **THEN** the drawing view moves with the pointer

### Requirement: User can zoom at the pointer

When the pointer is over the canvas host, the editor SHALL zoom the drawing view about that pointer location in response to the mouse wheel. The page behind the editor MUST NOT scroll as a result. Zoom scale MUST stay finite and positive.

#### Scenario: Wheel zooms about the pointer
- **GIVEN** the editor shows an imported image
- **WHEN** the user scrolls the mouse wheel over the canvas host
- **THEN** the drawing view zooms
- **AND** content under the pointer stays under the pointer
- **AND** the page does not scroll

### Requirement: User can fit the main image in the view

The editor SHALL offer a Fit action that scales and pans the viewport so the entire main image is visible inside the canvas host. If there is no imported image, Fit MUST restore a default unzoomed view.

#### Scenario: Fit frames the main image
- **GIVEN** the editor shows an imported image
- **AND** the user has panned or zoomed the view
- **WHEN** the user uses the Fit action
- **THEN** the whole main image is visible inside the canvas host

#### Scenario: Fit with no image
- **GIVEN** the editor has no imported image
- **WHEN** the user uses the Fit action
- **THEN** the drawing view is at its default unzoomed position and scale

#### Scenario: Import uses the same Fit as the toolbar
- **GIVEN** the canvas host has a known size
- **WHEN** the user successfully imports a JPEG, PNG, or WebP file
- **THEN** the viewport is fitted so the whole main image is visible inside the canvas host
- **AND** the image's document transform is unchanged by that Fit

### Requirement: Viewport follows the host size

When the canvas host size changes while the editor remains visible, the editor SHALL record the new view size. If a main image exists, the viewport MUST be fitted so the whole image stays visible in the host. If the host size did not change, the current pan and zoom MUST be left unchanged.

#### Scenario: Window resize refits the main image
- **GIVEN** the editor shows an imported image
- **AND** the canvas host has a known size
- **WHEN** the user resizes the window and the host dimensions change
- **THEN** the drawing canvas matches the host
- **AND** the whole main image is visible inside the canvas host
- **AND** the image's document transform is unchanged

#### Scenario: Unchanged host size keeps pan and zoom
- **GIVEN** the editor shows an imported image
- **AND** the user has panned or zoomed the view
- **WHEN** the host reports the same width and height again
- **THEN** the viewport pan and zoom are unchanged
