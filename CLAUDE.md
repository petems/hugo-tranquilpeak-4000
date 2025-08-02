# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hugo Tranquilpeak 4000 is a modernized fork of the hugo-tranquilpeak-theme. It's a responsive Hugo theme with modern build processes and comprehensive GitHub Actions workflows for testing and quality assurance.

## Development Commands

### Build and Development
- `npm run start` - Build theme once and rebuild after each change (development mode)
- `npm run build` - Same as start (development build)
- `npm run prod` - Build theme for production with optimizations (concat, minify)
- `hugo server` - Run Hugo development server (requires Hugo to be installed)

### Code Quality
- `npm run lint` - Run ESLint for JavaScript code style checking
- `npm run grunt` - Run Grunt task runner directly

### Build Tools
The project uses Grunt for asset processing:
- CSS compilation from SCSS
- JavaScript concatenation and minification
- Asset synchronization and optimization

## Architecture

### Core Structure
- **layouts/**: Hugo template files (partials, shortcodes, single/list templates)
- **assets/**: Source SCSS and JavaScript files
- **static/**: Final compiled CSS/JS assets 
- **i18n/**: Internationalization files for 15+ languages
- **exampleSite/**: Demo site with example configuration

### Theme Configuration
- `config.toml` in exampleSite shows all available theme parameters
- Minimum Hugo version: 0.128 (specified in theme.toml)
- Uses Goldmark renderer with unsafe HTML enabled

### Asset Pipeline
- SCSS follows 7-1 pattern architecture
- JavaScript is modular with separate files for each feature (sidebar, header, galleries, etc.)
- Grunt handles compilation and optimization
- Development vs production builds with different asset linking

### Key Features
- Responsive design with configurable sidebar behavior
- Multi-language support (15+ languages)
- Syntax highlighting with highlight.js
- Image galleries and cover images
- Social sharing options
- Comment integration (Disqus, Gitalk)
- Google Analytics integration

## Testing and CI/CD

The project has comprehensive GitHub Actions workflows:
- **Multi-version Hugo testing**: Tests against Hugo 0.128.0, 0.140.0, 0.148.1, and 0.149.0
- **Code quality checks**: ESLint, security audits, theme structure validation
- **Latest version monitoring**: Weekly tests against latest Hugo versions
- **Asset compilation validation**: Ensures CSS/JS assets compile correctly

Main workflow files:
- `.github/workflows/test.yml` - Main testing workflow
- `.github/workflows/lint.yml` - Code quality and structure checks  
- `.github/workflows/test-latest.yml` - Latest Hugo version testing

## Development Guidelines

### Code Style
- JavaScript follows Google ESLint configuration
- SCSS follows 7-1 pattern with organized component structure
- Hugo templates use standard Hugo templating conventions

### Theme Development
1. Source files are in `assets/` and `layouts/`
2. Use `npm run start` for development with auto-rebuild
3. Run `npm run lint` before committing changes
4. Test with `hugo server` using the exampleSite
5. Use `npm run prod` for production builds

### Modern Hugo Compatibility
This fork specifically addresses modern Hugo compatibility:
- Updated pagination config for Hugo v0.128+
- Fixed deprecated Google Analytics templates
- Updated all `.Site.Author` references to `.Site.Params.Author`
- Fixed Disqus configuration
- Added Goldmark renderer configuration