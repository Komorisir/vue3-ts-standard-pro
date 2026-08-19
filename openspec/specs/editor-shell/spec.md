## Purpose

Provides the editor's four-region application chrome and a stable canvas host so a renderer can attach later without the page collapsing.

## Requirements

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

### Requirement: Stable canvas host

The canvas region SHALL expose a dedicated host element that keeps a non-zero width and height while the window is visible, and SHALL resize when the window size changes. Switching the left workspace tab MUST NOT destroy or remount that host, and the host MUST keep a non-zero width and height after the switch. Changing chrome colors or top-bar layout MUST NOT destroy or remount that host.

#### Scenario: Host has measurable size
- **GIVEN** the editor page is visible in a desktop-sized window
- **WHEN** the layout completes
- **THEN** the canvas host has a non-zero width and a non-zero height

#### Scenario: Host follows window resize
- **GIVEN** the editor page is visible
- **WHEN** the user resizes the window
- **THEN** the canvas host dimensions update to remain inside the central region

#### Scenario: Switching workspace keeps the host
- **GIVEN** the editor page is visible with an attached drawing surface
- **WHEN** the user selects a different left workspace tab
- **THEN** the same canvas host remains in the central region
- **AND** the host still has a non-zero width and a non-zero height
- **AND** the drawing surface is still attached to that host

#### Scenario: Restyling chrome keeps the host
- **GIVEN** the editor page is visible with an attached drawing surface
- **WHEN** the chrome uses the light shell and three-region top bar
- **THEN** the same canvas host remains in the central region
- **AND** the drawing surface is still attached to that host

### Requirement: Empty-document hint on the host

When no document image is shown, the canvas host SHALL display a hint that the user can drop an image or choose to open one. After a drawing surface is attached and the document is still empty, the hint MUST remain visible above that surface. After at least one image is imported, the hint MUST be hidden. Clicking the empty host or dropping a file onto it SHALL start import, except when the pan tool is active or the pointer is performing a pan gesture.

#### Scenario: Empty host copy
- **GIVEN** the editor page has no imported image
- **WHEN** the user looks at the canvas host
- **THEN** they see the hint to drop an image or click to open

#### Scenario: Hint remains after the canvas is attached
- **GIVEN** the editor page has no imported image
- **AND** the drawing canvas is attached to the host
- **WHEN** the user looks at the canvas host
- **THEN** the hint is still visible

#### Scenario: Hint hides after an image is imported
- **GIVEN** the editor page has at least one imported image
- **WHEN** the user looks at the canvas host
- **THEN** the empty-document hint is not visible

#### Scenario: Pan tool does not open the file picker
- **GIVEN** the editor page has no imported image
- **AND** the pan tool is active
- **WHEN** the user clicks the canvas host
- **THEN** the file picker does not open

### Requirement: Chrome regions do not create a renderer

The top bar, left workspace (category tabs and workspace panel), and right side panel SHALL NOT initialize a WebGL or WebGPU renderer. Only the canvas host MAY display a drawing surface created by the engine lifecycle.

#### Scenario: Panels stay free of a drawing context
- **GIVEN** a user opens the editor page
- **WHEN** the view finishes loading
- **THEN** the top bar, left workspace, and right panel contain no canvas created by this editor
- **AND** any drawing canvas is inside the canvas host

### Requirement: Left workspace category tabs

The left workspace SHALL show a vertical category tab list with exactly these labels in this order: 调整, 滤镜调色, 人像, 抠图, 画笔, 素材. Exactly one tab SHALL be selected at a time. The first visit SHALL select 调整. Selecting a tab SHALL show only that category's adjacent panel.

#### Scenario: Six tabs are listed
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the left workspace lists 调整, 滤镜调色, 人像, 抠图, 画笔, and 素材 in that order
- **AND** 调整 is selected

#### Scenario: Switching a tab changes only the adjacent panel
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **WHEN** the user selects 滤镜调色
- **THEN** 滤镜调色 is the only selected tab
- **AND** the adjacent panel shows the 滤镜调色 workspace
- **AND** the 调整 tools are not visible in that panel

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

### Requirement: Unimplemented workspaces show placeholders

When 滤镜调色, 人像, 抠图, 画笔, or 素材 is selected, the adjacent panel SHALL show that workspace's title and a not-yet-available placeholder. Those panels MUST NOT apply filters, portrait edits, cutouts, brush strokes, or material placement.

#### Scenario: Placeholder for an unimplemented workspace
- **GIVEN** the editor page is visible
- **WHEN** the user selects 人像
- **THEN** the adjacent panel shows the 人像 title
- **AND** the panel shows that the workspace is not yet available
- **AND** no portrait edit is applied to the document

### Requirement: Light Meitu-style chrome

The editor chrome SHALL use a light shell: a white top bar, a light-gray tab column, a light canvas host, and dark readable text on panels. Selected workspace tabs and the Save action SHALL share one pink-red accent color. The canvas host background SHALL be `#ebebeb`. The drawing stage MUST NOT use the accent color as its empty background. Chrome MUST NOT include membership badges, account avatars, or cloud-optimize actions.

#### Scenario: Light shell and shared accent
- **GIVEN** a user opens the editor location
- **WHEN** the page finishes loading
- **THEN** the top bar has a white background
- **AND** the canvas host background is `#ebebeb`
- **AND** the selected left tab uses the same accent color as the Save action
- **AND** the chrome does not show a membership badge or account avatar

#### Scenario: Empty stage is not pink
- **GIVEN** the editor page has no imported image
- **AND** the renderer has started
- **WHEN** the user looks at the canvas host
- **THEN** the empty stage matches the light host background
- **AND** the empty stage is not the accent color

### Requirement: Compact chrome controls

The editor chrome SHALL present form controls at compact density. Buttons, text fields, and selects in the top bar and workspace panels MUST share that compact density. Modal dialogs and brief status toasts MAY keep the component-library default density.

#### Scenario: Size fields match compact toolbar buttons
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **AND** 改尺寸/比例 is expanded
- **WHEN** the user compares the width field with a top-bar button
- **THEN** the width field is compact rather than the library default taller control
- **AND** the unit select is also compact

### Requirement: Light chrome ignores system dark preference

When the operating system prefers a dark color scheme, the editor chrome MUST remain a light shell: a white top bar, dark readable text on light panels, a light-gray tab column, and canvas host `#ebebeb`. The page MUST NOT invert into light-on-dark global text or a dark empty canvas from leftover default styles.

#### Scenario: Dark OS preference keeps the light editor
- **GIVEN** the user's system prefers a dark color scheme
- **WHEN** the editor page finishes loading
- **THEN** the top bar remains white
- **AND** panel text remains dark on a light surface
- **AND** the canvas host background remains `#ebebeb`

### Requirement: Adjust accordion uses icon disclosure

Each primary adjust module header SHALL indicate expanded or collapsed state with an outline icon. The headers MUST NOT use the characters `>` or `∨` as the disclosure mark.

#### Scenario: Collapsed module shows an icon chevron
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **AND** all three modules are collapsed
- **WHEN** the user looks at the 裁剪 header
- **THEN** the header shows an outline disclosure icon
- **AND** the header does not show the character `>` as the disclosure mark
