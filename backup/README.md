# Backup Directory

This directory contains backups of the original GitHub Actions workflows and custom actions before refactoring.

## Contents

- `workflows/` - Original workflow files from `.github/workflows/`
- `actions/` - Original custom action files from `.github/actions/`

## Backup Date

Thu  7 Aug 2025 04:39:40 BST

## Purpose

These files serve as a rollback point during the GitHub Actions refactoring project. If any issues arise during the migration to reusable workflows, these original files can be restored.

## Restoration Process

To restore from backup:
1. `cp -r backup/workflows/* .github/workflows/`
2. `cp -r backup/actions/* .github/actions/`
3. `git add .`
4. `git commit -m "restore: rollback to original workflows from backup"`

