#!/bin/bash
# Deployment script for rakeemchapman.com coming soon page

set -e

echo "🚀 Deploying rakeemchapman.com coming soon page to GitHub Pages"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if gh CLI is installed (optional, but helpful)
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI detected"
    GITHUB_CLI=true
else
    echo "⚠️  GitHub CLI not installed. Using git only."
    GITHUB_CLI=false
fi

# Initialize git repository if not already
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Coming soon page for rakeemchapman.com"
else
    echo "📦 Updating existing git repository..."
    git add .
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
fi

# Ask for repository URL
read -p "Enter GitHub repository URL (e.g., https://github.com/Rakeem-C/rakeemchapman.com.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No repository URL provided. Exiting."
    exit 1
fi

# Add remote and push
echo "🔗 Adding remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "$REPO_URL"

echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/$(echo $REPO_URL | sed 's|.*github.com/||' | sed 's|.git$||')/settings/pages"
echo "2. Configure GitHub Pages:"
echo "   - Source: Deploy from a branch"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "3. Under 'Custom domain', enter: rakeemchapman.com"
echo "4. Save and wait 1-2 minutes for deployment"
echo ""
echo "Your site will be available at: https://rakeemchapman.com"
echo ""
echo "Note: You may need to update DNS records at your domain registrar:"
echo "  - Add A records pointing to:"
echo "    185.199.108.153"
echo "    185.199.109.153"
echo "    185.199.110.153"
echo "    185.199.111.153"
echo "  - Or add CNAME: rakeemchapman.com → yourusername.github.io"