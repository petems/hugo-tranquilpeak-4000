# Reusable Workflows Testing Documentation

This directory contains test workflows to validate all reusable workflows before migration.

## Test Workflows

### Individual Component Tests

1. **`test-shared-setup.yml`** - Tests the shared setup workflow
   - Tests default parameters
   - Tests custom Hugo/Node.js versions
   - Tests minimal setup (skip optional steps)

2. **`test-hugo-test.yml`** - Tests the Hugo testing workflow
   - Tests single Hugo version
   - Tests multiple Hugo versions with matrix
   - Tests minimal build configuration

3. **`test-security-scan.yml`** - Tests the security scanning workflow
   - Tests permissive mode (warnings only)
   - Tests strict mode (fail on vulnerabilities)
   - Tests custom scan paths

4. **`test-e2e-base.yml`** - Tests the E2E base workflow
   - Tests basic E2E setup
   - Tests visual regression setup
   - Tests all browsers installation

### Comprehensive Integration Test

**`test-all-reusable-workflows.yml`** - Comprehensive validation
- Runs all reusable workflows with safe parameters
- Generates integration test report
- Creates validation summary with pass/fail status
- Uploads detailed validation report as artifact

## How to Run Tests

### Manual Testing via GitHub UI

1. Go to **Actions** tab in GitHub repository
2. Select the test workflow you want to run
3. Click **Run workflow**
4. Configure input parameters if needed
5. Click **Run workflow** to execute

### Recommended Testing Sequence

Before proceeding with Phase 3 (Critical Workflow Migration):

1. **Run individual tests first:**
   ```
   test-shared-setup.yml → test-hugo-test.yml → test-security-scan.yml → test-e2e-base.yml
   ```

2. **Run comprehensive integration test:**
   ```
   test-all-reusable-workflows.yml
   ```

3. **Verify all tests pass** before proceeding with migration

### Test Parameters

#### Shared Setup Test
- `hugo-version`: Hugo version to test (default: 0.148.1)
- `skip-asset-build`: Skip asset building step (default: false)

#### Hugo Test
- `test-versions`: JSON array of Hugo versions (default: ["0.148.1", "latest"])

#### Security Scan Test  
- `fail-on-vulnerabilities`: Whether to fail on found vulnerabilities (default: false)

#### E2E Base Test
- `test-type`: Type of test (e2e, visual, all)

## Validation Criteria

### ✅ Tests Should Pass When:
- All reusable workflows complete without errors
- Input/output parameters work correctly
- Artifacts are generated as expected
- Error handling works properly

### ❌ Tests Will Fail When:
- Syntax errors in reusable workflows
- Missing required inputs
- Broken action references
- Invalid configuration

## Mock Testing Strategy

To avoid running expensive/long operations during validation:

- **E2E tests**: Use mock Playwright commands instead of actual browser tests
- **Security scans**: Use permissive settings to avoid false failures
- **Hugo builds**: Use minimal configurations for faster execution
- **Artifacts**: Disable or use short retention periods

## Troubleshooting

### Common Issues

1. **Workflow not found errors**
   - Ensure all reusable workflows are committed to the branch
   - Check file paths in `uses:` statements

2. **Permission errors**
   - Verify GITHUB_TOKEN has required permissions
   - Check security-events write permission for security scans

3. **Timeout issues**
   - Increase timeout-minutes for slow operations
   - Use minimal configurations for validation

### Debug Steps

1. Check workflow logs for detailed error messages
2. Review artifact uploads for generated reports
3. Validate input parameters match expected formats
4. Ensure all referenced actions and files exist

## Next Steps

Once all validation tests pass:
1. ✅ Reusable workflows are ready
2. 🚀 Proceed to **Phase 3: Critical Workflow Migration**
3. 📝 Update task list to mark sub-task 2.5 complete