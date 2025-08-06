#!/bin/bash

# Exit on any error
set -e

echo "🚀 Setting up Hugo Tranquilpeak 4000 development environment..."

# Update package lists
echo "📦 Updating package lists..."
sudo apt-get update

# Install Hugo
echo "📚 Installing Hugo..."
if ! command -v hugo &> /dev/null; then
    # Download and install Hugo
    HUGO_VERSION="0.148.2"
    HUGO_ARCH="Linux-64bit"
    HUGO_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_${HUGO_ARCH}.tar.gz"
    
    echo "Downloading Hugo ${HUGO_VERSION}..."
    wget -q "$HUGO_URL" -O hugo.tar.gz
    tar -xzf hugo.tar.gz
    sudo mv hugo /usr/local/bin/
    rm hugo.tar.gz
    
    echo "✅ Hugo installed successfully"
else
    echo "✅ Hugo already installed"
fi

# Install additional system dependencies
echo "🔧 Installing system dependencies..."
sudo apt-get install -y \
    wget \
    curl \
    git \
    build-essential \
    libfontconfig1 \
    libfreetype6 \
    libjpeg62-turbo \
    libpng16-16 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xvfb

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

# Build theme assets
echo "🏗️ Building theme assets..."
npm run build

# Create cache directory
echo "📁 Creating cache directory..."
mkdir -p .devcontainer/cache

# Set up Git configuration
echo "⚙️ Configuring Git..."
git config --global init.defaultBranch main
git config --global pull.rebase false

# Create helpful aliases
echo "🔗 Creating helpful aliases..."
cat >> ~/.bashrc << 'EOF'

# Hugo Tranquilpeak 4000 aliases
alias hugo-dev='cd exampleSite && hugo server --buildDrafts --buildFuture --disableFastRender --bind 0.0.0.0'
alias hugo-build='npm run build'
alias test-visual='npm run test:visual'
alias test-e2e='npm run test:e2e'
alias test-all='npm run test:all'

# Development shortcuts
alias dev='npm run start'
alias build='npm run build'
alias lint='npm run lint'
alias test='npm run test'

echo "🎉 Hugo Tranquilpeak 4000 development environment is ready!"
echo ""
echo "📋 Available commands:"
echo "  hugo-dev     - Start Hugo development server"
echo "  hugo-build   - Build theme assets"
echo "  test-visual  - Run visual regression tests"
echo "  test-e2e     - Run end-to-end tests"
echo "  test-all     - Run all tests"
echo "  dev          - Start development mode"
echo "  build        - Build for production"
echo "  lint         - Run ESLint"
echo "  test         - Run unit tests"
echo ""
echo "🌐 Hugo server will be available at: http://localhost:1313"
echo "🎭 Playwright UI will be available at: http://localhost:3001"
echo ""

EOF

# Make the script executable
chmod +x .devcontainer/setup.sh

echo "✅ Development environment setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Reopen the project in the devcontainer"
echo "  2. Run 'hugo-dev' to start the Hugo server"
echo "  3. Run 'test-visual' to test the visual regression improvements"
echo "" 