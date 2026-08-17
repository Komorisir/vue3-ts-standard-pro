## Purpose

Governs how agents and developers agree on behavior before writing product code, using one OpenSpec change per feature.

## ADDED Requirements

### Requirement: Change exists before product code

The project SHALL require an active OpenSpec change before an agent implements a `feature_list.json` item that changes product behavior.

#### Scenario: Agent starts a feature with no change
- **GIVEN** a `not-started` feature in `feature_list.json`
- **AND** `openspec/changes/` has no matching active change
- **WHEN** an agent is asked to implement that feature
- **THEN** the agent MUST create or resume an OpenSpec change and finish its planning artifacts before editing product source

#### Scenario: One change maps to one feature
- **GIVEN** an active OpenSpec change
- **WHEN** the agent applies it
- **THEN** the apply MUST cover exactly one `feature_list.json` item
- **AND** MUST NOT mark a second feature done in the same apply

### Requirement: Product docs stay source material

Existing product documents SHALL remain background material. The project MUST NOT bulk-convert the full editor plan into main specs in a single change.

#### Scenario: Plan documents remain in docs
- **GIVEN** `docs/pixijs-editor-plan.md` and `docs/pixijs-editor-dev-scheme.md` exist
- **WHEN** SDD is initialized
- **THEN** those files remain the product background
- **AND** `openspec/specs/` only gains capabilities from archived changes

### Requirement: Archive merges completed behavior

After a change is implemented and verified, the project SHALL archive it so delta requirements become the main spec source of truth.

#### Scenario: Completed change is archived
- **GIVEN** an applied change whose tasks are complete and verification passed
- **WHEN** the change is archived
- **THEN** its ADDED or MODIFIED requirements appear under `openspec/specs/`
- **AND** the change folder is no longer listed as active
