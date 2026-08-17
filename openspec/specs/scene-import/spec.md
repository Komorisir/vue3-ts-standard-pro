## Purpose

Lets the user import a local image onto a layered drawing surface so the picture appears centered, while invalid files are rejected with a visible error and the empty-state hint goes away once a picture exists.

## Requirements

### Requirement: User can import a local image

The editor SHALL let the user add a local JPEG, PNG, or WebP image by choosing a file from the top bar Open action, by choosing a file from the empty canvas host, or by dropping a file onto the canvas host. A successfully imported image MUST be fitted into the canvas host so the whole picture is visible.

#### Scenario: Open from the top bar
- **GIVEN** the editor page is visible
- **WHEN** the user uses the Open action and picks a JPEG, PNG, or WebP file
- **THEN** that image is visible inside the canvas host
- **AND** the whole picture fits in the host

#### Scenario: Drop onto the canvas host
- **GIVEN** the editor page is visible
- **WHEN** the user drops a JPEG, PNG, or WebP file onto the canvas host
- **THEN** that image is visible inside the canvas host
- **AND** the whole picture fits in the host

#### Scenario: Click the empty host to choose a file
- **GIVEN** the editor page has no imported image
- **WHEN** the user clicks the canvas host and picks a JPEG, PNG, or WebP file
- **THEN** that image is visible inside the canvas host
- **AND** the whole picture fits in the host

### Requirement: Invalid files are rejected with a visible error

The system MUST reject an empty file, a non-image type, or a file that fails to load as an image. The user MUST see an error. The document MUST NOT gain a picture from that file.

#### Scenario: Non-image file
- **GIVEN** the editor page is visible
- **WHEN** the user opens or drops a file that is not JPEG, PNG, or WebP
- **THEN** a visible error is shown
- **AND** no new picture appears on the drawing surface

#### Scenario: Load failure
- **GIVEN** the editor page is visible
- **WHEN** the user opens a file whose type looks like an image but loading fails
- **THEN** a visible error is shown
- **AND** no new picture appears on the drawing surface

### Requirement: Imported pictures live in document content

The document SHALL hold at most one main image. That picture MUST be drawn in the content group of the scene. The viewport group MUST exist. Viewport pan and zoom MAY change the viewport transform and MUST NOT be written into the image's document transform. Overlay decorations MUST NOT be required for import to succeed. A successfully imported image MUST be fitted into the canvas host so the whole picture is visible (same Fit used by the toolbar).

#### Scenario: Second import replaces the main image
- **GIVEN** the editor already shows one imported image
- **WHEN** the user successfully imports another JPEG, PNG, or WebP file
- **THEN** only the newly imported image is visible
- **AND** the previous main image is no longer on the drawing surface

#### Scenario: Import fits the main image into the host
- **GIVEN** the canvas host has a known size
- **WHEN** the user successfully imports a JPEG, PNG, or WebP file
- **THEN** the whole imported image is visible inside the canvas host
- **AND** the image's document transform is not used to store the viewport pan or zoom

#### Scenario: Import after pan still fits the host
- **GIVEN** the user has panned or zoomed the drawing view
- **WHEN** the user successfully imports a JPEG, PNG, or WebP file
- **THEN** the newly imported image is fitted into the canvas host
- **AND** the image's document transform is not used to store the viewport pan or zoom

### Requirement: Empty hint hides after an image exists

When the document contains at least one imported image, the canvas host MUST NOT show the empty-document hint.

#### Scenario: Hint gone after import
- **GIVEN** the editor page had no imported image
- **WHEN** an image is successfully imported
- **THEN** the hint to drop or open is no longer visible
