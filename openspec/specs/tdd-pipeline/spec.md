## Purpose

Provides a Vitest-backed red-green path for pure logic so agents cannot claim a logic feature done without automated tests.

## Requirements

### Requirement: Automated tests are runnable

The project SHALL provide a non-watch test command that exits non-zero when any spec fails.

#### Scenario: Passing suite
- **GIVEN** the repository has at least one spec file
- **AND** all specs pass
- **WHEN** the standard test command is run
- **THEN** the command exits with status 0

#### Scenario: Failing spec blocks the suite
- **GIVEN** a spec whose assertion does not hold
- **WHEN** the standard test command is run
- **THEN** the command exits with a non-zero status

### Requirement: Verification includes tests

The standard project verification path SHALL run the automated test suite, not only lint and type-check.

#### Scenario: Full verification runs tests
- **GIVEN** a developer or agent runs the standard startup verification
- **WHEN** verification executes
- **THEN** the automated test suite is included
- **AND** a failing suite fails the whole verification

### Requirement: Pure logic follows red-green

New pure-logic behavior (document model, commands, numeric helpers, export helpers) SHALL be specified by a failing automated test before production code makes that test pass.

#### Scenario: New helper is added
- **GIVEN** a new pure function is required
- **WHEN** an agent implements it
- **THEN** a colocated spec MUST exist first and fail for the missing behavior
- **AND** the subsequent implementation MUST make that spec pass

#### Scenario: Canvas frames are out of unit scope
- **GIVEN** a change that only affects PixiJS WebGL rendering
- **WHEN** the agent chooses verification
- **THEN** the agent MUST NOT add a unit spec that boots a WebGL renderer
- **AND** MUST record a manual canvas check instead
