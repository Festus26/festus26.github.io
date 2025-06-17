#!/bin/bash

# Cache busting version updater
# This script updates version numbers in HTML files to force browser cache refresh

# Get current timestamp for unique versioning
TIMESTAMP=$(date +%s)
VERSION="1.2.$TIMESTAMP"

echo "Updating cache busting version to: $VERSION"

# Update version numbers in index.html
sed -i '' "s/\?v=[0-9]\+\.[0-9]\+\.[0-9]\+/?v=$VERSION/g" index.html

echo "✅ Updated version numbers in index.html"
echo "📝 New version: $VERSION"
echo ""
echo "🚀 Your files will now bypass browser cache for all visitors!"
echo "💡 Run this script every time you make changes to CSS/JS files"
