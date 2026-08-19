## ADDED Requirements

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
