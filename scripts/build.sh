#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting build process..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build the app
echo "🔨 Building the app..."
npm run build

# Verify build
echo "✅ Build completed successfully!"
echo "📁 Build directory size: $(du -sh build | cut -f1)"

echo "🎉 Build process completed!"






