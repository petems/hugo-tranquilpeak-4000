# GitHub Actions CI/CD Pipeline Architecture Refactoring Tasks

## Relevant Files

- `.github/workflows/test.yml` - Main Hugo testing workflow with version matrix (needs migration to reusable components)
- `.github/workflows/lint.yml` - Code quality and linting workflow (needs consolidation with shared setup)
- `.github/workflows/test-latest.yml` - Latest Hugo version testing workflow (needs migration to shared components)
- `.github/workflows/e2e-tests.yml` - End-to-end Playwright testing workflow (236 lines with 90% duplication between jobs)
- `.github/workflows/build.yml` - Theme asset building workflow (duplicate functionality with hugo-build.yml)
- `.github/workflows/hugo-build.yml` - Hugo site building workflow (duplicate functionality with build.yml)
- `.github/workflows/security.yml` - Security scanning workflow with npm audit and Trivy (needs shared setup)
- `.github/workflows/preview.yml` - Preview deployment workflow for pull requests (needs migration)
- `.github/workflows/link-check.yml` - Link validation workflow (needs shared setup)
- `.github/workflows/setup-hugo.yml` - Standalone Hugo setup workflow (redundant after refactoring)
- `.github/workflows/setup-node.yml` - Standalone Node.js setup workflow (redundant after refactoring)
- `.github/workflows/validate-actions.yml` - GitHub Actions validation workflow (needs shared setup)
- `.github/actions/setup-hugo/action.yml` - Custom Hugo installation action (well-designed, keep)
- `.github/actions/hugo-build/action.yml` - Custom Hugo build action (well-designed, keep)
- `.github/actions/setup-theme/action.yml` - Custom theme setup action (well-designed, keep)
- `.github/actions/setup-node/action.yml` - Unnecessary 3-line wrapper around actions/setup-node@v4 (remove)
- `.github/actions/install-deps/action.yml` - Overly verbose 55-line wrapper for npm ci (simplify or remove)
- `.github/actions/build-assets/action.yml` - Simple asset building action (evaluate and potentially merge)
- `CLAUDE.md` - Project documentation severely outdated (lists 4 workflows, should list final count)
- `package.json` - Contains npm scripts and dependencies used by workflows
- `backup/workflows/` - Complete backup of all 13 original workflow files for rollback capability
- `backup/actions/` - Complete backup of all 6 original custom action directories for rollback capability
- `backup/README.md` - Documentation of backup contents and restoration procedures
- `.github/workflows/_shared-setup.yml` - Reusable workflow for common setup (Node.js, Hugo, dependencies, asset building)
- `.github/workflows/_hugo-test.yml` - Reusable workflow for Hugo build testing with configurable version matrix
- `.github/workflows/_security-scan.yml` - Reusable workflow for security scanning (npm audit, Trivy, TruffleHog)
- `.github/workflows/_e2e-base.yml` - Reusable workflow for E2E testing with Playwright setup and browser management
- `.github/workflows/test-shared-setup.yml` - Test workflow for validating shared setup workflow
- `.github/workflows/test-hugo-test.yml` - Test workflow for validating Hugo test workflow  
- `.github/workflows/test-security-scan.yml` - Test workflow for validating security scan workflow
- `.github/workflows/test-e2e-base.yml` - Test workflow for validating E2E base workflow
- `.github/workflows/test-all-reusable-workflows.yml` - Comprehensive integration test for all reusable workflows
- `.github/workflows/README-testing.md` - Documentation for running reusable workflow validation tests

## Tasks

- [ ] 1.0 Foundation and Assessment
  - [x] 1.1 Create backup branch `refactor/github-actions` and copy all current workflows to `backup/` directory

- [x] 2.0 Create Reusable Workflow Components
  - [x] 2.1 Create `.github/workflows/_shared-setup.yml` reusable workflow with inputs for Hugo version, Node.js setup with npm cache, dependency installation, and asset building
  - [x] 2.2 Create `.github/workflows/_hugo-test.yml` reusable workflow for Hugo build testing with configurable version matrix and build validation
  - [x] 2.3 Create `.github/workflows/_security-scan.yml` reusable workflow combining npm audit, Trivy filesystem scanning, and TruffleHog secret detection
  - [x] 2.4 Create `.github/workflows/_e2e-base.yml` reusable workflow for Playwright setup, browser installation, and common E2E test execution steps
  - [x] 2.5 Test all reusable workflows independently with sample caller workflows to ensure proper input/output handling and error reporting

- [ ] 3.0 Migrate Critical Workflows
  - [ ] 3.1 Refactor `test.yml` to use `_shared-setup.yml` and `_hugo-test.yml`, maintaining the Hugo version matrix (0.128.0, 0.140.0, 0.148.1)
  - [ ] 3.2 Consolidate `build.yml` and `hugo-build.yml` into single `build-and-test.yml` workflow using shared components
  - [ ] 3.3 Update `test-latest.yml` to use shared components while preserving latest/latest-dev Hugo version testing and issue creation on failure
  - [ ] 3.4 Refactor `security.yml` to use `_shared-setup.yml` and `_security-scan.yml` while maintaining all security scanning tools and SARIF upload functionality
  - [ ] 3.5 Consolidate `e2e-tests.yml` by merging `e2e-tests` and `visual-regression` jobs using `_shared-setup.yml` and `_e2e-base.yml` to eliminate 90% duplication
  - [ ] 3.6 Update `lint.yml` to use shared setup components and remove redundant Node.js/npm setup steps

- [ ] 4.0 Migrate Non-Critical Workflows and Cleanup
  - [ ] 4.1 Refactor `preview.yml` to use `_shared-setup.yml` while preserving GitHub Pages deployment and PR comment functionality
  - [ ] 4.2 Update `link-check.yml` to use shared components and maintain Hugo site building for link validation
  - [ ] 4.3 Evaluate and update `validate-actions.yml` to use shared setup components where applicable
  - [ ] 4.4 Remove redundant custom actions: delete `.github/actions/setup-node/` (3-line wrapper) after confirming no remaining usage
  - [ ] 4.5 Simplify `.github/actions/install-deps/action.yml` by removing excessive debug logging and reducing to essential npm ci functionality
  - [ ] 4.6 Remove or consolidate redundant standalone workflows: `setup-hugo.yml` and `setup-node.yml` after confirming they're no longer needed
  - [ ] 4.7 Archive replaced workflows to `backup/legacy-workflows/` with dated backup for historical reference

- [ ] 5.0 Update Documentation and Configuration
  - [ ] 5.1 Update `CLAUDE.md` to accurately document all remaining workflows (currently lists 4, actual count will be reduced after consolidation)
  - [ ] 5.2 Create `.github/workflow-config.yml` or similar centralized configuration file for Hugo versions, Node.js version, and artifact retention policies
  - [ ] 5.3 Document new reusable workflow architecture with usage examples and input parameter descriptions
  - [ ] 5.4 Update development commands guidance in `CLAUDE.md` to reflect any changes in build/test processes
  - [ ] 5.5 Add workflow maintenance procedures and troubleshooting guide for common issues with reusable workflows
  - [ ] 5.6 Create governance documentation to prevent future workflow duplication and enforce use of shared components

- [ ] 6.0 Testing, Validation and Deployment
  - [ ] 6.1 Run comprehensive test suite on all refactored workflows: test all Hugo versions, trigger conditions (push, PR, schedule, workflow_dispatch), and artifact generation
  - [ ] 6.2 Validate E2E tests and visual regression tests work correctly with new shared components, including Playwright browser setup and screenshot generation
  - [ ] 6.3 Test preview deployment functionality and GitHub Pages integration to ensure no functionality was lost in migration
  - [ ] 6.4 Measure and document actual code reduction achieved (target: 60-70%) by comparing total lines of workflow code before and after refactoring
  - [ ] 6.5 Monitor workflow execution times and resource usage (runner minutes) to ensure performance hasn't degraded
  - [ ] 6.6 Verify rollback mechanism works by testing restoration from backup workflows to ensure emergency recovery capability
  - [ ] 6.7 Create final success validation report documenting code reduction metrics, functionality preservation, and maintenance improvements achieved
  - [ ] 6.8 Merge refactored workflows from `refactor/github-actions` branch to main branch and monitor first production runs of all workflows
  - [ ] 6.9 Schedule 30-day follow-up review to assess ongoing maintenance effectiveness and identify any additional optimization opportunities