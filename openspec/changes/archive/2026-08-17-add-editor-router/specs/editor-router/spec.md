## Purpose

Gives the image editor a stable, refreshable default URL so later layout and canvas work have a single entry page.

## ADDED Requirements

### Requirement: Default location is the editor

The application SHALL present the editor page as the default location. Visiting the site root MUST end on the editor location.

#### Scenario: Open the site root
- **GIVEN** the application is running
- **WHEN** a user opens the root location
- **THEN** they land on the editor page
- **AND** they MUST NOT see the previous Vite starter demo

#### Scenario: Open the editor location directly
- **GIVEN** the application is running
- **WHEN** a user opens or refreshes the editor location
- **THEN** they remain on the editor page

### Requirement: Unknown locations return to the editor

The application SHALL send unrecognized locations to the editor page.

#### Scenario: Unknown path
- **GIVEN** the application is running
- **WHEN** a user opens a location that is not the editor
- **AND** that location is not the site root
- **THEN** they land on the editor page

### Requirement: Editor page is mountable without canvas chrome

The editor page SHALL render as a dedicated view that can later host layout and canvas. This change MUST NOT require a drawing surface or tool panels to be present.

#### Scenario: First visit after routing is enabled
- **GIVEN** a user reaches the editor page
- **WHEN** the view finishes loading
- **THEN** a dedicated editor view is visible
- **AND** the page MUST NOT initialize a WebGL or WebGPU renderer
