#!/bin/bash

# 🚀 Portfolio Deployment Script
# This script updates version numbers and prepares your site for deployment

echo "🚀 Starting Portfolio Deployment Process..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Generate version based on current date and time
VERSION=$(date +"%Y.%m.%d.%H%M")
TIMESTAMP=$(date +%s)

echo -e "${BLUE}📅 Generated Version: ${VERSION}${NC}"
echo -e "${BLUE}⏰ Timestamp: ${TIMESTAMP}${NC}"
echo ""

# Update version numbers in HTML files
echo -e "${YELLOW}📝 Updating cache busting versions...${NC}"

# Update index.html
if [ -f "index.html" ]; then
    # Update CSS and JS version parameters
    sed -i '' "s/\?v=[0-9]\+\.[0-9]\+\.[0-9]\+\.*[0-9]*/?v=$VERSION/g" index.html
    echo -e "${GREEN}✅ Updated index.html${NC}"
else
    echo -e "${RED}❌ index.html not found${NC}"
fi

# Update any other HTML files
for html_file in *.html; do
    if [ "$html_file" != "index.html" ] && [ -f "$html_file" ]; then
        sed -i '' "s/\?v=[0-9]\+\.[0-9]\+\.[0-9]\+\.*[0-9]*/?v=$VERSION/g" "$html_file"
        echo -e "${GREEN}✅ Updated $html_file${NC}"
    fi
done

echo ""
echo -e "${YELLOW}🔧 Checking file integrity...${NC}"

# Check if important files exist
files_to_check=(
    "css/team-sermath.css"
    "css/style.css"
    "js/main.js"
    "js/space-animation.js"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file exists${NC}"
    else
        echo -e "${RED}❌ $file missing${NC}"
    fi
done

echo ""
echo -e "${YELLOW}📊 File sizes:${NC}"
du -sh css/ js/ images/ 2>/dev/null || echo "Some directories may not exist"

echo ""
echo -e "${GREEN}🎉 Deployment preparation complete!${NC}"
echo -e "${BLUE}📝 Version: ${VERSION}${NC}"
echo -e "${BLUE}🌐 Your website will now bypass browser cache for all visitors${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo "1. Test your website locally"
echo "2. Commit and push to your repository"
echo "3. Deploy to your hosting service"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}"
