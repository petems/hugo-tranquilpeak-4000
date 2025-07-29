# Hugo Tranquilpeak 4000

[![Test Theme](https://github.com/petems/hugo-tranquilpeak-4000/workflows/Test%20Theme/badge.svg)](https://github.com/petems/hugo-tranquilpeak-4000/actions?query=workflow%3A%22Test+Theme%22)
[![Lint and Quality Checks](https://github.com/petems/hugo-tranquilpeak-4000/workflows/Lint%20and%20Quality%20Checks/badge.svg)](https://github.com/petems/hugo-tranquilpeak-4000/actions?query=workflow%3A%22Lint+and+Quality+Checks%22)

A modernized fork of the [hugo-tranquilpeak-theme](https://github.com/kakawait/hugo-tranquilpeak-theme) with the goal of bringing this beautiful theme into the modern era.

## Project Goals

### Primary Objectives

1. **Cherry-pick Community Fixes**: Review and integrate the best open pull requests from the original repository to fix bugs and improve functionality
2. **Modernize the Codebase**: Update dependencies, build tools, and code patterns to current standards
3. **Latest Hugo Compatibility**: Ensure full compatibility with the latest Hugo static site generator
4. **Personal Website Revival**: Get my personal website back up and running with a modern, maintained theme

### Secondary Goals

- **Community Revival**: If the modernization is successful, potentially gain traction to create a maintained version that others can use
- **Performance Improvements**: Optimize for modern web standards and faster loading times
- **Security Updates**: Address any security vulnerabilities in dependencies
- **Documentation**: Improve and update documentation for modern Hugo usage

## Current Status

✅ **Theme Successfully Modernized!** 

The theme is now fully compatible with Hugo v0.148.1 and working. Key fixes include:

- ✅ Updated pagination config for Hugo v0.128+
- ✅ Fixed deprecated Google Analytics templates
- ✅ Updated all `.Site.Author` references to `.Site.Params.Author`
- ✅ Fixed Disqus configuration for modern Hugo
- ✅ Added Goldmark renderer configuration
- ✅ Replaced deprecated gist shortcode
- ✅ Updated minimum Hugo version requirement to 0.128

The theme is ready for use with modern Hugo installations.

## Quick Start

To use this modernized theme:

1. **Clone this repository** into your Hugo site's `themes` directory:
   ```bash
   cd themes
   git clone https://github.com/petems/hugo-tranquilpeak-4000.git
   ```

2. **Configure your site** by copying the example configuration:
   ```bash
   cp themes/hugo-tranquilpeak-4000/exampleSite/config.toml .
   ```

3. **Update the config** to use the modernized theme:
   ```toml
   theme = "hugo-tranquilpeak-4000"
   ```

4. **Run Hugo**:
   ```bash
   hugo server
   ```

## GitHub Actions

This repository includes comprehensive GitHub Actions workflows for testing and quality assurance:

### 🤖 **Automated Testing**

- **Multi-version Hugo testing**: Tests against Hugo 0.128.0, 0.140.0, 0.148.1, and 0.149.0
- **Latest version monitoring**: Weekly tests against the latest Hugo versions
- **Build validation**: Ensures the theme builds successfully with the example site
- **Asset compilation**: Validates that all CSS/JS assets compile correctly

### 🔍 **Quality Checks**

- **ESLint**: JavaScript code quality and style checking
- **Security audits**: npm security vulnerability scanning
- **Theme structure validation**: Ensures all required directories and files exist
- **Configuration validation**: Verifies theme.toml and example site configuration

### 📋 **Workflow Files**

- `.github/workflows/test.yml` - Main testing workflow
- `.github/workflows/lint.yml` - Code quality and structure checks
- `.github/workflows/test-latest.yml` - Latest Hugo version testing
- `.github/workflows/validate-actions.yml` - GitHub Actions syntax validation

## Contributing

If you're interested in helping further improve this theme:

1. Check the [original repository's open issues and PRs](https://github.com/kakawait/hugo-tranquilpeak-theme/issues)
2. Look for pull requests that fix bugs or add useful features
3. Test changes against the latest Hugo version
4. Ensure backward compatibility where possible
5. All changes are automatically tested via GitHub Actions

## License

This project maintains the same GPL-3.0 license as the original theme.

## Acknowledgments

- Original theme by [Thibaud Leprêtre (kakawait)](https://github.com/kakawait) and [Louis Barranqueiro](https://github.com/LouisBarranqueiro)
- All contributors to the original repository whose fixes we're incorporating
- The Hugo community for maintaining such an excellent static site generator 