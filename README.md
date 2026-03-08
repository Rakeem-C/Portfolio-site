# Rakeem Chapman - Coming Soon Page

A modern, responsive "coming soon" page for [rakeemchapman.com](https://rakeemchapman.com).

## Features

- 🎨 **Modern Design**: Clean, professional design with gradient accents
- 📱 **Fully Responsive**: Works on all devices from mobile to desktop
- ⏱️ **Interactive Countdown**: 30-day countdown timer with smooth animations
- 📧 **Email Notification Form**: Collect email addresses for launch notifications
- 🔗 **Social Links**: GitHub, LinkedIn, Twitter, and Email
- 🎯 **Performance Optimized**: Fast loading with minimal dependencies
- 🌙 **Dark Theme**: Easy on the eyes with subtle gradients
- ⚡ **Animated Tech Visualization**: Custom SVG with animated circuits, data flows, and tech symbols
- 🎭 **Interactive Elements**: Hover effects, animations, and smooth transitions

## Deployment to GitHub Pages

### Option 1: Manual Deployment
1. Create a new repository on GitHub (e.g., `rakeemchapman.com`)
2. Push these files to the `main` branch
3. Go to Repository Settings → Pages
4. Set source to "Deploy from a branch" → `main` branch → `/ (root)`
5. Save and wait for deployment (usually 1-2 minutes)

### Option 2: Using GitHub CLI
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit: Coming soon page"

# Create repository and push
gh repo create rakeemchapman.com --public --source=. --remote=origin --push
```

### Option 3: Using Existing Repository
If you already have a repository for rakeemchapman.com:
```bash
git clone https://github.com/yourusername/rakeemchapman.com.git
cd rakeemchapman.com
# Copy files from this directory
cp -r /root/rakeemchapman-coming-soon/* .
git add .
git commit -m "Add coming soon page"
git push
```

## Customization

### Change Countdown Date
Edit the JavaScript in `index.html`:
```javascript
// Change this line (currently 30 days from now)
launchDate.setDate(launchDate.getDate() + 30);
```

### Update Social Links
Edit the social links section in `index.html`:
```html
<a href="https://github.com/Rakeem-C" class="social-link" target="_blank">
```

### Change Colors
Edit the CSS variables at the top of the `<style>` section:
```css
:root {
    --primary: #2563eb;      /* Main blue */
    --primary-dark: #1d4ed8; /* Darker blue */
    --secondary: #7c3aed;    /* Purple accent */
    --dark: #0f172a;         /* Background dark */
    --light: #f8fafc;        /* Text light */
}
```

### Tech Visualization Features
The page includes a custom animated SVG visualization that represents technology and innovation:

- **Animated Circuit Board**: Central hexagon with connecting lines
- **Data Flow Animation**: Moving lines showing data transmission
- **Floating Particles**: Animated dots with vertical movement
- **Tech Symbols**: Chip, code brackets, and AI brain icons
- **Binary Code Background**: Subtle moving binary text
- **Glow Effects**: Soft glow on interactive elements
- **Responsive Design**: Scales perfectly on all devices

All animations are done with pure SVG and CSS, no JavaScript required for the visualization.

### Add Custom Domain
1. After deploying to GitHub Pages, go to Repository Settings → Pages
2. Under "Custom domain", enter `rakeemchapman.com`
3. Add the DNS records as instructed by GitHub:
   - A records pointing to GitHub's IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or CNAME record: `rakeemchapman.com` → `yourusername.github.io`

## Files Structure
```
├── index.html          # Main coming soon page
├── README.md           # This documentation
└── (optional)
    ├── CNAME           # For custom domain (if using)
    ├── .nojekyll       # Disable Jekyll processing
    └── favicon.ico     # Site favicon
```

## Next Steps

1. **Set up email collection** (recommended services):
   - [Mailchimp](https://mailchimp.com/) - Free for up to 2,000 subscribers
   - [ConvertKit](https://convertkit.com/) - Great for creators
   - [Buttondown](https://buttondown.email/) - Simple email newsletters

2. **Add analytics** (optional):
   - [Plausible](https://plausible.io/) - Privacy-focused
   - [Google Analytics](https://analytics.google.com/) - Traditional
   - [Fathom](https://usefathom.com/) - Simple and clean

3. **Custom domain setup**:
   - Update DNS records at your domain registrar
   - Wait for propagation (up to 48 hours)
   - Enable HTTPS in GitHub Pages settings

## Testing Locally

You can test the page locally by opening `index.html` in a browser, or using a simple HTTP server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## License

This coming soon page is free to use and modify for personal or commercial projects.