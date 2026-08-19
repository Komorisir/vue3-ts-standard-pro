## MODIFIED Requirements

### Requirement: Four-region editor chrome

The editor page SHALL present a top bar, a left workspace (category tabs plus the adjacent workspace panel), a central canvas region, and a right side panel at the same time. The top bar SHALL be arranged in three regions from left to right: document, history, and deliver. The top bar Open action SHALL import a local image. The top bar Fit action SHALL fit the main image in the view. The Adjust workspace SHALL expose the pan tool that pans the view. Undo and Redo SHALL reverse or re-apply committed image-adjust commands when that stack is not empty. History and Save MAY remain placeholders that do not perform file or layer actions.

#### Scenario: First visit shows all four regions
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the top bar, left workspace, canvas region, and right panel are all visible
- **AND** the Open action is available
- **AND** the Fit action is available
- **AND** the Adjust workspace is selected
- **AND** the pan tool is available in the Adjust panel
- **AND** History and Save MAY stay inactive

#### Scenario: Top bar has three regions
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the top bar shows a document region with the brand name and Open
- **AND** the top bar shows a history region with History, Undo, and Redo
- **AND** the top bar shows a deliver region with Fit and Save
- **AND** Save is presented as the primary action

### Requirement: Adjust workspace keeps existing tools

While 调整 is selected, the adjacent panel SHALL keep the pan tool usable and SHALL present three collapsed primary modules labeled 裁剪, 旋转/矫正, and 改尺寸/比例. The panel MUST NOT present canvas selection, free transform, text, or shape tools. Expanding or collapsing those modules MUST NOT destroy or remount the canvas host.

#### Scenario: Pan remains on Adjust
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **WHEN** the user activates the pan tool
- **THEN** dragging the canvas pans the view

#### Scenario: Adjust panel lists three modules collapsed
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **WHEN** the user looks at the adjacent panel
- **THEN** the panel shows 裁剪, 旋转/矫正, and 改尺寸/比例
- **AND** all three modules are collapsed
- **AND** the pan tool is still available
