## ADDED Requirements

### Requirement: Stage hosts a layered scene

After the renderer has started, the drawing surface SHALL contain a viewport group that holds a world group, and the world SHALL contain background, content, and overlay groups. Imported pictures MUST be added under content, not under overlay or chrome.

#### Scenario: Scene is ready before the first import
- **GIVEN** the editor page is visible and the renderer has started
- **WHEN** the user has not imported an image
- **THEN** the drawing surface still shows a dark empty view
- **AND** a later import MUST be able to place a picture in the content group
