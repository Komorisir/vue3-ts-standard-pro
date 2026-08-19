## MODIFIED Requirements

### Requirement: Four-region editor chrome

The editor page SHALL present a top bar, a left workspace (category tabs plus the adjacent workspace panel), a central canvas region, and a right side panel at the same time. The top bar SHALL be arranged in three regions from left to right: document, capsule, and deliver. The document region SHALL show the brand name and an icon Import action. The capsule region SHALL show a single pill-shaped toolbar with, in order: the pan tool labeled 抓手, Undo, Redo, Compare Original, and Fit. The deliver region SHALL show an icon Export action presented as the primary action. The top bar Import action SHALL import a local image. The top bar Fit action SHALL fit the main image in the view. The top bar pan tool SHALL pan the view when toggled on. Undo and Redo SHALL reverse or re-apply committed image-adjust commands when that stack is not empty. Export MAY remain a disabled placeholder that does not perform file export.

#### Scenario: First visit shows all four regions
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the top bar, left workspace, canvas region, and right panel are all visible
- **AND** the Import action is available
- **AND** the Fit action is available in the capsule
- **AND** the pan tool is available in the capsule
- **AND** the Adjust workspace is selected
- **AND** Export MAY stay inactive

#### Scenario: Top bar has three regions
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the top bar shows a document region with the brand name and Import
- **AND** the top bar shows a capsule region with 抓手, Undo, Redo, Compare Original, and Fit
- **AND** the top bar shows a deliver region with Export
- **AND** Export is presented as the primary action

#### Scenario: Capsule controls use icons with tooltips
- **GIVEN** the editor page is visible
- **WHEN** the user hovers a capsule icon control
- **THEN** a tooltip shows the control label (抓手, 撤销, 重做, 对比原图, or 适配)
- **AND** the capsule does not show text buttons except where the brand name appears outside the capsule

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

## ADDED Requirements

### Requirement: Toolbar capsule grouping

The capsule toolbar SHALL group controls as: 抓手, then Undo and Redo, then Compare Original, then Fit. Vertical dividers SHALL separate those groups. When no main image exists, 抓手, Undo, Redo, Compare Original, and Fit MUST be disabled. Import MUST stay available. Export MUST stay disabled until export is implemented.

#### Scenario: No image disables capsule actions
- **GIVEN** the editor page has no imported image
- **WHEN** the user looks at the capsule
- **THEN** 抓手, Undo, Redo, Compare Original, and Fit are disabled
- **AND** Import is available

#### Scenario: Pan tool toggles from the capsule
- **GIVEN** a main image is imported
- **WHEN** the user activates 抓手 in the capsule
- **THEN** dragging the canvas pans the view
- **AND** activating 抓手 again turns the pan tool off

### Requirement: Compare original preview

While the user holds Compare Original or the backslash key, the editor SHALL show the imported bitmap as a view-only preview. The preview MUST use the same world anchor as the current visible image center. It MUST omit crop, rotation, flip, and resize scale from the committed document. The viewport MUST NOT change. The document MUST NOT change. No command MUST be pushed to the undo stack. While comparing, the DOM crop overlay MUST be hidden. Viewport pan, wheel zoom, Space pan, and middle-button pan MUST remain available. When the user releases Compare Original or the backslash key, the committed document appearance MUST return. When an editable text field has focus, the backslash shortcut MUST NOT start comparing.

#### Scenario: Hold Compare Original shows the import bitmap
- **GIVEN** a main image is imported
- **AND** the image has a committed crop or rotation
- **WHEN** the user presses and holds Compare Original
- **THEN** the full imported bitmap is shown at the current visible center
- **AND** the committed crop and rotation are not shown
- **AND** the document layers are unchanged

#### Scenario: Backslash compares while no input is focused
- **GIVEN** a main image is imported
- **AND** no editable text field is focused
- **WHEN** the user presses and holds `\`
- **THEN** the same compare preview is shown as when holding Compare Original
- **AND** releasing `\` restores the committed appearance

#### Scenario: Compare hides the crop overlay
- **GIVEN** a main image is imported
- **AND** the crop module is expanded with a visible crop overlay
- **WHEN** the user holds Compare Original
- **THEN** the crop overlay is not visible
- **AND** releasing Compare Original shows the crop overlay again

#### Scenario: Viewport gestures work while comparing
- **GIVEN** a main image is imported
- **AND** the user is holding Compare Original
- **WHEN** the user pans or zooms the viewport
- **THEN** the viewport updates
- **AND** the compare preview stays aligned to the visible center rule

### Requirement: Re-import clears adjust history

When the user successfully imports a new image while a main image already exists, the image-adjust command stack MUST be cleared. Any active compare preview MUST end.

#### Scenario: Second import clears undo stack
- **GIVEN** the user has committed an adjust change with a non-empty undo stack
- **WHEN** the user successfully imports another image
- **THEN** only the new image is visible
- **AND** Undo and Redo are disabled until new adjust commands are committed
