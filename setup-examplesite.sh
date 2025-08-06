#!/bin/bash

echo "🚀 Setting up exampleSite for Hugo Tranquilpeak 4000"
echo "=================================================="

# Build assets first
echo "📦 Building assets..."
echo "🔍 Debug: Checking if grunt-cli exists..."
if [ -f "node_modules/grunt-cli/bin/grunt" ]; then
  echo "✅ grunt-cli found"
else
  echo "❌ grunt-cli not found at node_modules/grunt-cli/bin/grunt"
  echo "📋 Contents of node_modules:"
  ls -la node_modules/ | head -10
  exit 1
fi

echo "🔍 Running npm run build with verbose output..."
if ! npm run build -- --verbose; then
  echo "❌ Failed to build assets"
  echo "🔍 Debug: Trying to run grunt directly..."
  if ! ./node_modules/.bin/grunt buildProd --verbose; then
    echo "❌ Direct grunt command also failed"
  fi
  exit 1
fi

# Setup exampleSite theme
echo "🎨 Setting up exampleSite theme..."
cd exampleSite

# Create themes directory
mkdir -p themes

# Remove existing theme if it exists
if [ -d "themes/Tranquilpeak4000" ]; then
  rm -rf themes/Tranquilpeak4000
fi

# Create theme directory
mkdir -p themes/Tranquilpeak4000

# Copy theme files
echo "📋 Copying theme files..."
for dir in layouts assets static archetypes i18n; do
  if [ ! -d "../$dir" ]; then
    echo "❌ Missing required directory: $dir"
    exit 1
  fi
  cp -r "../$dir" "themes/Tranquilpeak4000/" || {
    echo "❌ Failed to copy $dir"
    exit 1
  }
done

if [ ! -f "../theme.toml" ]; then
  echo "❌ Missing theme.toml"
  exit 1
fi
cp ../theme.toml themes/Tranquilpeak4000/ || {
  echo "❌ Failed to copy theme.toml"
  exit 1
}

# Fix public directory permissions
echo "🔧 Fixing permissions..."
rm -rf public
mkdir public
chmod 755 public

echo "✅ exampleSite setup completed!"
echo "🎯 Ready to start Hugo server..." 