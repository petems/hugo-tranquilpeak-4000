# Visual Regression Testing with Playwright

This directory contains improved visual regression tests that are more tolerant of minor pixel differences while still catching significant visual regressions.

## Overview

The visual regression tests have been enhanced with:

1. **Flexible tolerance levels** based on environment and test type
2. **CSS stabilization** to hide volatile elements
3. **Better page stabilization** techniques
4. **Environment-specific configurations** for CI vs local development

## Files

- `visual-regression.spec.js` - Main visual regression test suite
- `visual-test-config.js` - Configuration system for different tolerance levels
- `screenshot-stabilization.css` - CSS to hide volatile elements during screenshots
- `README-visual-tests.md` - This documentation

## Tolerance Levels

The system provides different tolerance levels for different scenarios:

### Strict (1% pixel difference)
- **Use case**: Critical UI elements, logos, buttons
- **Settings**: 100 maxDiffPixels, 1% maxDiffPixelRatio
- **Example**: Footer components, navigation elements

### Normal (3% pixel difference)
- **Use case**: Most UI components
- **Settings**: 500 maxDiffPixels, 3% maxDiffPixelRatio
- **Example**: Homepage sections, sidebar components

### Relaxed (5% pixel difference)
- **Use case**: Full pages, complex layouts
- **Settings**: 1000 maxDiffPixels, 5% maxDiffPixelRatio
- **Example**: Blog posts, full page screenshots

### Very Relaxed (10% pixel difference)
- **Use case**: Cross-browser testing, CI environments
- **Settings**: 2000 maxDiffPixels, 10% maxDiffPixelRatio
- **Example**: Cross-browser consistency checks

### Development (20% pixel difference)
- **Use case**: Local development with frequent changes
- **Settings**: 5000 maxDiffPixels, 20% maxDiffPixelRatio
- **Example**: During active development

## Environment-Specific Behavior

### Local Development
- Uses "normal" tolerance by default
- More strict to catch issues early
- Faster feedback loop

### CI Environment
- Uses "very relaxed" tolerance by default
- Accounts for different rendering environments
- More tolerant of minor differences

### Production Testing
- Uses "relaxed" tolerance
- Balanced approach for production validation

## Running Tests

### Basic visual regression tests
```bash
npm run test:visual
```

### Update reference screenshots
```bash
npx playwright test visual-regression.spec.js --update-snapshots
```

### Run with specific environment
```bash
NODE_ENV=development npm run test:visual
NODE_ENV=production npm run test:visual
```

### Run in CI mode (more tolerant)
```bash
CI=true npm run test:visual
```

## Configuration

### Global Configuration (playwright.config.js)
The global configuration sets default values for all screenshot comparisons:

```javascript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 1000,
    maxDiffPixelRatio: 0.05,
    animations: 'disabled',
    caret: 'hide',
  },
}
```

### Test-Specific Configuration
Each test can use different tolerance levels:

```javascript
const config = process.env.CI ? getCIConfig('homepage') : getVisualTestConfig('homepage');

await expect(page).toHaveScreenshot('homepage.png', {
  ...config,
});
```

## CSS Stabilization

The `screenshot-stabilization.css` file hides volatile elements that can cause inconsistent screenshots:

- Animations and transitions
- Loading spinners
- Dynamic timestamps
- Social media widgets
- Advertisements
- Notification badges

## Best Practices

1. **Use appropriate tolerance levels** for each test type
2. **Update snapshots** when making intentional UI changes
3. **Run tests locally first** before pushing to CI
4. **Review failed screenshots** to understand what changed
5. **Use the stabilization CSS** for consistent results

## Troubleshooting

### Tests failing due to minor differences
- Increase tolerance levels for that specific test
- Check if new dynamic content was added
- Update the stabilization CSS if needed

### Inconsistent results across environments
- Use CI-specific configurations
- Ensure consistent browser versions
- Check for environment-specific CSS

### Performance issues
- Reduce the number of full-page screenshots
- Use viewport screenshots when possible
- Optimize the stabilization CSS

## Customization

### Adding new tolerance levels
Edit `visual-test-config.js`:

```javascript
const toleranceLevels = {
  // ... existing levels
  custom: {
    maxDiffPixels: 750,
    maxDiffPixelRatio: 0.04,
  }
};
```

### Adding new test configurations
```javascript
const testConfigs = {
  // ... existing configs
  customTest: {
    ...baseConfig,
    ...toleranceLevels.custom,
  }
};
```

### Customizing stabilization CSS
Edit `screenshot-stabilization.css` to hide additional volatile elements specific to your application.

## Migration from Old Tests

If you're migrating from the old visual regression tests:

1. The old `threshold: 0.3` setting has been replaced with more precise `maxDiffPixels` and `maxDiffPixelRatio`
2. The new system is more tolerant by default but more configurable
3. Use `--update-snapshots` to generate new reference images
4. Adjust tolerance levels if tests become too strict or too lenient 