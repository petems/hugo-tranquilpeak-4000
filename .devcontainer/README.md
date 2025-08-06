# Hugo Tranquilpeak 4000 DevContainer

This devcontainer provides a complete development environment for the Hugo Tranquilpeak 4000 theme with all necessary tools pre-installed.

## 🚀 What's Included

### Core Tools
- **Node.js 20** - JavaScript runtime
- **Hugo 0.148.2** - Static site generator
- **Playwright** - End-to-end testing framework
- **Git** - Version control
- **GitHub CLI** - GitHub integration

### Development Tools
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Grunt** - Task runner (via npm)

### VS Code Extensions
- Playwright Test Runner
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- ESLint
- SCSS support
- HTML/CSS support
- Markdown support

## 🎯 Getting Started

### Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop/)
- [VS Code](https://code.visualstudio.com/)
- [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Quick Start
1. Clone this repository
2. Open the project in VS Code
3. When prompted, click "Reopen in Container"
4. Wait for the container to build and start
5. The development environment will be ready!

### Manual Start
If you're not prompted automatically:
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Dev Containers: Reopen in Container"
3. Select the command and wait for the container to start

## 📋 Available Commands

Once inside the devcontainer, you can use these commands:

### Development
```bash
hugo-dev      # Start Hugo development server
dev           # Start development mode with watch
build         # Build theme for production
```

### Testing
```bash
test-visual   # Run visual regression tests
test-e2e      # Run end-to-end tests
test-all      # Run all tests (unit + e2e)
test          # Run unit tests only
```

### Code Quality
```bash
lint          # Run ESLint
```

### Playwright
```bash
npx playwright test --ui          # Open Playwright UI
npx playwright test --headed      # Run tests with visible browser
npx playwright show-report        # Show test report
```

## 🌐 Ports

The following ports are automatically forwarded:

- **1313** - Hugo development server
- **3000** - Development server (if used)
- **3001** - Playwright UI

## 🏗️ Project Structure

```
hugo-tranquilpeak-4000/
├── .devcontainer/          # DevContainer configuration
│   ├── devcontainer.json   # Main configuration
│   ├── Dockerfile         # Container image
│   ├── setup.sh           # Setup script
│   └── README.md          # This file
├── assets/                # Theme assets (SCSS, JS)
├── layouts/               # Hugo templates
├── static/                # Static files
├── e2e/                   # End-to-end tests
│   ├── visual-regression.spec.js
│   ├── visual-test-config.js
│   └── screenshot-stabilization.css
├── exampleSite/           # Example Hugo site
└── package.json           # Node.js dependencies
```

## 🎨 Visual Regression Testing

The devcontainer includes an improved visual regression testing setup with:

- **Flexible tolerance levels** for different environments
- **CSS stabilization** to hide volatile elements
- **Environment-specific configurations** (CI vs local)
- **Better page stabilization** techniques

### Running Visual Tests
```bash
# Basic visual regression tests
test-visual

# Update reference screenshots
npm run test:visual:update

# Run with CI tolerance (more lenient)
npm run test:visual:ci

# Run with development tolerance (very lenient)
npm run test:visual:dev
```

## 🔧 Customization

### Adding New Tools
Edit `.devcontainer/devcontainer.json` to add:
- New VS Code extensions
- Additional features
- Custom settings

### Modifying the Environment
Edit `.devcontainer/Dockerfile` to:
- Install additional system packages
- Configure environment variables
- Add custom scripts

### Updating Hugo Version
Change the `HUGO_VERSION` variable in:
- `.devcontainer/Dockerfile`
- `.devcontainer/setup.sh`

## 🐛 Troubleshooting

### Container Won't Start
1. Ensure Docker is running
2. Check Docker has enough resources (4GB RAM recommended)
3. Try rebuilding the container: `Dev Containers: Rebuild Container`

### Hugo Server Issues
1. Check if Hugo is installed: `hugo version`
2. Ensure you're in the exampleSite directory: `cd exampleSite`
3. Try running Hugo manually: `hugo server --bind 0.0.0.0`

### Playwright Issues
1. Install browsers: `npx playwright install`
2. Check system dependencies are installed
3. Run with headed mode to see what's happening: `npx playwright test --headed`

### Performance Issues
1. Increase Docker resources (CPU, RAM)
2. Use volume mounts for node_modules
3. Consider using Docker Compose for additional services

## 📚 Resources

- [Hugo Documentation](https://gohugo.io/documentation/)
- [Playwright Documentation](https://playwright.dev/)
- [Dev Containers Documentation](https://containers.dev/)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)

## 🤝 Contributing

When contributing to this project:

1. Use the devcontainer for consistent development
2. Run tests before submitting changes
3. Update visual regression snapshots if UI changes are intentional
4. Follow the existing code style and conventions

## 📄 License

This devcontainer configuration is part of the Hugo Tranquilpeak 4000 project and follows the same license terms. 