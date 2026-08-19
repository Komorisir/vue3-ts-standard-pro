## MODIFIED Requirements

### Requirement: Adjust workspace keeps existing tools

While 调整 is selected, the adjacent panel SHALL present three collapsed primary modules labeled 裁剪, 旋转/矫正, and 改尺寸/比例. The panel MUST NOT present the pan tool, canvas selection, free transform, text, or shape tools. Expanding or collapsing those modules MUST NOT destroy or remount the canvas host. Viewport pan MUST remain available through the top bar pan tool while 调整 is selected.

#### Scenario: Pan remains on Adjust
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **WHEN** the user activates the pan tool from the top bar capsule
- **THEN** dragging the canvas pans the view

#### Scenario: Adjust panel lists three modules collapsed
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **WHEN** the user looks at the adjacent panel
- **THEN** the panel shows 裁剪, 旋转/矫正, and 改尺寸/比例
- **AND** all three modules are collapsed
- **AND** the pan tool is not shown in the panel

### Requirement: No canvas free transform in this phase

The editor MUST NOT show a bounding box, resize handles, or a rotation handle on the main image for free move, scale, or rotate. Viewport pan and wheel zoom SHALL remain available through the top bar pan tool, Space, middle mouse button, and wheel zoom.

#### Scenario: Main image has no transform handles
- **GIVEN** a main image is imported
- **AND** 调整 is selected
- **WHEN** the user looks at the drawing surface
- **THEN** no selection bounding box or transform handles are shown
- **AND** the top bar pan tool can still pan the view

## ADDED Requirements

### Requirement: Re-import resets adjust undo history

When a new main image replaces an existing one through import, all committed and pending image-adjust undo history for the previous image MUST be discarded.

#### Scenario: Replace image clears adjust commands
- **GIVEN** the user has committed a crop with a non-empty undo stack
- **WHEN** the user successfully imports a different image
- **THEN** Undo and Redo are disabled
- **AND** the new image has no crop from the previous session
