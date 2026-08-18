## MODIFIED Requirements

### Requirement: Renderer uses WebGL and a dark empty stage

This change SHALL create a WebGL drawing context (not WebGPU). Until a document image exists, the stage MAY be empty aside from the renderer background. The background MUST match the canvas host fill `#ebebeb` so the empty stage does not flash a default white frame or a leftover dark frame over the light host. The background MUST NOT be the chrome accent color.

#### Scenario: Empty editor shows a dark canvas
- **GIVEN** the editor page has no imported image
- **WHEN** the renderer has started
- **THEN** the canvas shows an empty surface whose background matches the light host `#ebebeb`
- **AND** the empty surface is not the chrome accent color
- **AND** no document image is required for this change to succeed

### Requirement: Stage hosts a layered scene

After the renderer has started, the drawing surface SHALL contain a viewport group that holds a world group, and the world SHALL contain background, content, and overlay groups. Imported pictures MUST be added under content, not under overlay or chrome.

#### Scenario: Scene is ready before the first import
- **GIVEN** the editor page is visible and the renderer has started
- **WHEN** the user has not imported an image
- **THEN** the drawing surface still shows a light empty view that matches the host
- **AND** a later import MUST be able to place a picture in the content group
