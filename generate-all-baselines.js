#!/usr/bin/env node

/**
 * Script to generate baseline snapshots for visual regression tests
 * This script will run the visual regression tests and create baseline snapshots
 * for different environments (CI, local, etc.)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generating baseline snapshots for visual regression tests...');

// Function to clean up existing snapshots
function cleanupSnapshots() {
  const snapshotDir = path.join(__dirname, 'e2e', 'visual-regression.spec.js-snapshots');
  
  if (fs.existsSync(snapshotDir)) {
    console.log('🧹 Cleaning up existing snapshots...');
    fs.rmSync(snapshotDir, { recursive: true, force: true });
  }
}

// Function to run tests and generate snapshots
function generateSnapshots(environment = 'local') {
  console.log(`📸 Generating snapshots for ${environment} environment...`);
  
  const env = environment === 'ci' ? 'CI=true' : '';
  const command = `${env} npx playwright test e2e/visual-regression.spec.js --update-snapshots`;
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: __dirname,
      env: { ...process.env, CI: environment === 'ci' ? 'true' : undefined }
    });
    console.log(`✅ Successfully generated snapshots for ${environment} environment`);
  } catch (error) {
    console.error(`❌ Failed to generate snapshots for ${environment} environment:`, error.message);
    process.exit(1);
  }
}

// Function to copy snapshots for different platforms
function copySnapshotsForPlatforms() {
  const snapshotDir = path.join(__dirname, 'e2e', 'visual-regression.spec.js-snapshots');
  
  if (!fs.existsSync(snapshotDir)) {
    console.log('❌ No snapshots found to copy');
    return;
  }
  
  console.log('📋 Copying snapshots for different platforms...');
  
  const files = fs.readdirSync(snapshotDir);
  const platforms = ['linux', 'darwin', 'win32'];
  
  files.forEach(file => {
    if (file.endsWith('.png')) {
      // Extract the base name and browser
      const match = file.match(/^(.+)-(.+)-(.+)\.png$/);
      if (match) {
        const [, baseName, browser, platform] = match;
        
        // Copy for other platforms
        platforms.forEach(targetPlatform => {
          if (targetPlatform !== platform) {
            const sourcePath = path.join(snapshotDir, file);
            const targetPath = path.join(snapshotDir, `${baseName}-${browser}-${targetPlatform}.png`);
            
            if (!fs.existsSync(targetPath)) {
              try {
                fs.copyFileSync(sourcePath, targetPath);
                console.log(`  📄 Copied ${file} to ${baseName}-${browser}-${targetPlatform}.png`);
              } catch (error) {
                console.warn(`  ⚠️  Failed to copy ${file} to ${targetPlatform}:`, error.message);
              }
            }
          }
        });
      }
    }
  });
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const environment = args[0] || 'local';
  
  console.log(`🎯 Target environment: ${environment}`);
  
  // Only clean up if not running in Docker (avoid EBUSY errors)
  if (!process.env.DOCKER_CONTAINER) {
    console.log('🧹 Cleaning up existing snapshots...');
    cleanupSnapshots();
  } else {
    console.log('🐳 Running in Docker container - skipping cleanup to avoid EBUSY errors');
  }
  
  // Generate snapshots for the specified environment
  generateSnapshots(environment);
  
  // Copy snapshots for other platforms if needed
  if (environment === 'ci') {
    copySnapshotsForPlatforms();
  }
  
  console.log('🎉 Baseline snapshot generation completed!');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = {
  cleanupSnapshots,
  generateSnapshots,
  copySnapshotsForPlatforms
};
