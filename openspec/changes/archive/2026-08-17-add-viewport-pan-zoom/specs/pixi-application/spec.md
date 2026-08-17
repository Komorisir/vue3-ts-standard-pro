## MODIFIED Requirements

### Requirement: Canvas follows the host size

The drawing canvas SHALL cover the canvas host. When the host size changes while the editor remains visible, the renderer MUST resize so the canvas stays matched to the host. The resize MUST run after the host layout has settled (not only on the window `resize` event).

#### Scenario: Canvas fills the host
- **GIVEN** the editor page is visible and the renderer has started
- **WHEN** the user inspects the canvas host
- **THEN** the drawing canvas width and height match the host client size

#### Scenario: Window resize updates the canvas
- **GIVEN** the editor page is visible with a started renderer
- **WHEN** the user resizes the window and the host dimensions change
- **THEN** the drawing canvas dimensions update to match the host
