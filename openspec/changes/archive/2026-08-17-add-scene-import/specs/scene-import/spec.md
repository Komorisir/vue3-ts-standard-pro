## Purpose

Lets the user import a local image onto a layered drawing surface so the picture appears centered, while invalid files are rejected with a visible error and the empty-state hint goes away once a picture exists.

## ADDED Requirements

### Requirement: User can import a local image

The editor SHALL let the user add a local JPEG, PNG, or WebP image by choosing a file from the top bar Open action, by choosing a file from the empty canvas host, or by dropping a file onto the canvas host. A successfully imported image MUST appear centered on the visible drawing surface.

#### Scenario: Open from the top bar
- **GIVEN** the editor page is visible
- **WHEN** the user uses the Open action and picks a JPEG, PNG, or WebP file
- **THEN** that image is visible near the center of the drawing surface

#### Scenario: Drop onto the canvas host
- **GIVEN** the editor page is visible
- **WHEN** the user drops a JPEG, PNG, or WebP file onto the canvas host
- **THEN** that image is visible near the center of the drawing surface

#### Scenario: Click the empty host to choose a file
- **GIVEN** the editor page has no imported image
- **WHEN** the user clicks the canvas host and picks a JPEG, PNG, or WebP file
- **THEN** that image is visible near the center of the drawing surface

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

The document SHALL hold at most one main image. That picture MUST be drawn in the content group of the scene. The viewport group MUST exist and MUST remain at identity transform in this change. Overlay decorations MUST NOT be required for import to succeed.

#### Scenario: Second import replaces the main image
- **GIVEN** the editor already shows one imported image
- **WHEN** the user successfully imports another JPEG, PNG, or WebP file
- **THEN** only the newly imported image is visible
- **AND** the previous main image is no longer on the drawing surface

### Requirement: Empty hint hides after an image exists

When the document contains at least one imported image, the canvas host MUST NOT show the empty-document hint.

#### Scenario: Hint gone after import
- **GIVEN** the editor page had no imported image
- **WHEN** an image is successfully imported
- **THEN** the hint to drop or open is no longer visible
