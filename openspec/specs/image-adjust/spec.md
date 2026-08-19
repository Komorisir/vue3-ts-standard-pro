# image-adjust Specification

## Purpose

Lets the user adjust the imported main image from the Adjust workspace: ratio crop, rotate and flip, and display-size change, without canvas free transform.

## Requirements

### Requirement: Exclusive accordion modules

The Adjust workspace SHALL offer exactly three primary modules: 裁剪, 旋转/矫正, and 改尺寸/比例. All three SHALL start collapsed. Clicking a collapsed module SHALL expand it. Clicking the expanded module SHALL collapse it. At most one module SHALL be expanded at a time. Expanding a different module SHALL collapse the one that was open.

#### Scenario: First visit has all modules collapsed
- **GIVEN** the editor page is visible
- **AND** 调整 is selected
- **WHEN** the user looks at the Adjust panel
- **THEN** 裁剪, 旋转/矫正, and 改尺寸/比例 are all collapsed

#### Scenario: Opening one module expands only that module
- **GIVEN** all three modules are collapsed
- **WHEN** the user clicks 裁剪
- **THEN** the crop interface is visible
- **AND** 旋转/矫正 and 改尺寸/比例 remain collapsed

#### Scenario: Opening another module collapses the current one
- **GIVEN** 裁剪 is expanded
- **WHEN** the user clicks 旋转/矫正
- **THEN** the rotate interface is visible
- **AND** 裁剪 is collapsed

### Requirement: Each module uses the current canvas image

Each primary Adjust module is independent. Expanding a module MUST use the image currently visible on the canvas as the baseline, including any already applied crop, rotation, flip, or display size. Rotation MUST spin around the center of that visible image, not the center of the original uncropped texture. After rotate or flip, the viewport MUST fit that visible image into the canvas and center it.

#### Scenario: Crop then rotate uses the cropped image center
- **GIVEN** a crop has been applied to the left half of the main image
- **WHEN** the user expands 旋转/矫正 and chooses right 90°
- **THEN** the visible cropped image rotates around its own center
- **AND** the viewport fits the rotated cropped image into the canvas

#### Scenario: Rotate then crop uses the rotated image
- **GIVEN** the main image has been rotated
- **WHEN** the user expands 裁剪
- **THEN** the crop box covers the current rotated visible image

### Requirement: Collapse commits used edits

When the user has changed the expanded module, collapsing it or switching to another module SHALL keep those changes on the main image. When the user opened a module and made no change, collapsing it SHALL leave the main image unchanged. An explicit cancel in the crop module SHALL restore the crop that existed before that session.

#### Scenario: Collapse after a crop session keeps the crop
- **GIVEN** a main image is imported
- **AND** the crop module is expanded
- **AND** the user has chosen a ratio and positioned the crop box
- **WHEN** the user collapses the crop module
- **THEN** the main image remains cropped to that box

#### Scenario: Collapse without edits does not change the image
- **GIVEN** a main image is imported
- **AND** the crop module is expanded
- **AND** the user has not changed the crop
- **WHEN** the user collapses the crop module
- **THEN** the main image looks the same as before the module opened

#### Scenario: Cancel crop restores the previous crop
- **GIVEN** a main image is imported
- **AND** the crop module is expanded
- **AND** the user has moved the crop box
- **WHEN** the user cancels the crop session
- **THEN** the main image uses the crop that existed before that session

### Requirement: Ratio crop with overlay

While the crop module is expanded and a main image exists, the drawing surface SHALL show a crop box on the image and a dimmed mask outside the box. The dimmed mask MUST stay inside the canvas host and MUST NOT cover the left panel, top bar, or the rest of the page. The crop box MUST provide four corner handles and four rectangular edge-midpoint handles (top, bottom, left, right). Dragging an edge-midpoint handle MUST move only that edge and MUST NOT change the opposite edge or the other dimension. Dragging a corner handle MUST keep the chosen ratio. A rule-of-thirds grid MUST appear only while the user is dragging the box or a handle, and MUST hide when the pointer is released. The user SHALL be able to choose one of these ratios: 原比例, 1:1, 4:3, 3:4, 16:9, 9:16, 3:2, 2:3. The crop box MUST stay inside the current visible image. Applying the crop MUST fit the cropped main image into the visible canvas and center it. Opening crop again after a crop has been applied MUST start with a box that covers the entire current visible (cropped) image. Crop SHALL be non-destructive: the original imported pixels remain available. This phase MUST NOT offer size-preset crop, free unconstrained crop from the ratio chips, or shape crop.

#### Scenario: Choosing a ratio constrains the box
- **GIVEN** a main image is imported
- **AND** the crop module is expanded
- **WHEN** the user chooses 4:3
- **THEN** the crop box is visible on the image
- **AND** the box aspect is 4:3
- **AND** the area outside the box is dimmed
- **AND** the dimmed area stays inside the canvas host

#### Scenario: Dragging the box stays inside the image
- **GIVEN** a 4:3 crop box is visible
- **WHEN** the user drags the box toward an image edge
- **THEN** the box remains fully inside the image
- **AND** the box aspect remains 4:3

#### Scenario: Edge handles resize one side
- **GIVEN** a crop box is visible
- **WHEN** the user drags the top-edge midpoint handle
- **THEN** only the height of the box changes
- **AND** the bottom edge stays in place
- **AND** the width does not change

#### Scenario: Rule-of-thirds grid only while dragging
- **GIVEN** a crop box is visible
- **WHEN** the user drags the box or a handle
- **THEN** a rule-of-thirds grid is visible on the box
- **AND** the grid hides when the pointer is released

#### Scenario: Applying crop fits the result in the canvas
- **GIVEN** the user has positioned a crop box
- **WHEN** the user applies the crop
- **THEN** the cropped main image fits inside the visible canvas
- **AND** the cropped image is centered

#### Scenario: Recrop starts from the current visible image
- **GIVEN** a crop has been applied and fitted to the canvas
- **WHEN** the user opens crop again
- **THEN** the crop box covers the entire current visible image
- **AND** the previous crop is replaced only after this session commits

#### Scenario: Opening crop after rotate remaps the box
- **GIVEN** the main image has been rotated
- **AND** the rotate module is collapsed
- **WHEN** the user expands the crop module
- **THEN** the crop box is laid out on the rotated main image
- **AND** the box stays inside the visible image

### Requirement: Rotate and flip the main image

The rotate module SHALL provide left 90°, right 90°, horizontal flip, vertical flip, and a custom angle in degrees. Each 90° turn or flip SHALL apply immediately to the main image. After a 90° turn, flip, or a valid custom-angle preview, the viewport MUST fit the rotated or flipped main image into the visible canvas and center it. Custom angle input SHALL accept positive, negative, and values outside 0–360, and MUST normalize the stored angle into the 0°–360° range. Empty, non-numeric, NaN, and infinite angle values MUST be rejected and MUST leave the previous valid angle in place. Flip MUST not rewrite the stored rotation value.

#### Scenario: Right 90 rotates the image
- **GIVEN** a main image is imported with rotation 0°
- **AND** the rotate module is expanded
- **WHEN** the user chooses right 90°
- **THEN** the main image is rotated 90° clockwise
- **AND** the viewport fits the rotated image into the visible canvas and centers it

#### Scenario: Consecutive 90° turns accumulate
- **GIVEN** the main image rotation is 90°
- **WHEN** the user chooses right 90° again
- **THEN** the main image rotation is 180°

#### Scenario: Horizontal flip mirrors the image
- **GIVEN** a main image is imported
- **WHEN** the user chooses horizontal flip
- **THEN** the main image is mirrored left to right
- **AND** the stored rotation is unchanged

#### Scenario: Custom angle 450 normalizes to 90
- **GIVEN** the rotate module is expanded
- **WHEN** the user commits a custom angle of 450
- **THEN** the main image rotation is 90°

#### Scenario: Invalid angle is rejected
- **GIVEN** the current angle is 30°
- **WHEN** the user enters a non-numeric angle and commits
- **THEN** the main image rotation remains 30°

### Requirement: Resize display size with locked ratio and units

The resize module SHALL offer width and height fields, a lock-ratio control that starts locked, and a unit of pixels, inches, or centimeters. Changing width while locked MUST update height to keep the current aspect. Changing height while locked MUST update width the same way. Unlocking MUST let width and height change independently. Internal size MUST be stored in pixels. Switching the displayed unit MUST NOT change the actual pixel size. Resize SHALL change the main image display size and MUST NOT change the canvas host size. Zero, negative, non-numeric, non-finite, and oversized values MUST be rejected and MUST leave the previous valid size in place. Typing MUST preview a valid size; a resize command SHALL be committed on blur, Enter, or module collapse, not on every keystroke.

#### Scenario: Locked width change updates height
- **GIVEN** a main image is 1200 by 800 pixels
- **AND** ratio lock is on
- **WHEN** the user changes width to 600 pixels and commits
- **THEN** the displayed height is 400 pixels
- **AND** the canvas host size is unchanged

#### Scenario: Unit switch keeps pixel size
- **GIVEN** the main image width is 1200 pixels
- **WHEN** the user switches the unit to centimeters and back to pixels
- **THEN** the width is still 1200 pixels

#### Scenario: Invalid size is rejected
- **GIVEN** the main image width is 1200 pixels
- **WHEN** the user enters 0 or a negative width and commits
- **THEN** the width remains 1200 pixels

#### Scenario: Rapid typing commits once
- **GIVEN** the resize module is expanded
- **WHEN** the user types a new width and then blurs the field
- **THEN** a single resize change is committed
- **AND** undoing once restores the size from before that edit

### Requirement: Operations require a main image

When no main image is imported, the three modules MAY be opened, but crop, rotate, flip, and resize MUST NOT change the document.

#### Scenario: Rotate with no image does nothing
- **GIVEN** the editor has no imported image
- **AND** the rotate module is expanded
- **WHEN** the user chooses right 90°
- **THEN** no picture appears
- **AND** the document still has no main image

### Requirement: Adjust commands can be undone

Each committed crop, 90° rotate, flip, custom-angle rotate, or resize SHALL be a separate undoable change. Undo SHALL restore the document to the state before that change. Redo SHALL re-apply it. Incomplete crop sessions and in-progress resize typing MUST NOT push undo entries until they commit.

#### Scenario: Undo a right-90 then a flip
- **GIVEN** the user has committed right 90° and then horizontal flip
- **WHEN** the user undoes twice
- **THEN** the main image matches the state before those two actions

#### Scenario: Undo a committed crop
- **GIVEN** the user has committed a 1:1 crop
- **WHEN** the user undoes
- **THEN** the main image is no longer cropped to that 1:1 box

### Requirement: No canvas free transform in this phase

The editor MUST NOT show a bounding box, resize handles, or a rotation handle on the main image for free move, scale, or rotate. Viewport pan and wheel zoom SHALL remain available.

#### Scenario: Main image has no transform handles
- **GIVEN** a main image is imported
- **AND** 调整 is selected
- **WHEN** the user looks at the drawing surface
- **THEN** no selection bounding box or transform handles are shown
- **AND** the pan tool can still pan the view
