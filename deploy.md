# Deployment Guide

## Quick Deployment Options

### 1. Vercel (Recommended - Free Tier)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# VITE_OPENAI_API_KEY=your_key_here
```

### 2. Netlify (Free Tier)

```bash
# Build the project
npm run build

# Drag and drop the `dist/` folder to netlify.com/drop
# Or use Netlify CLI:
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. GitHub Pages

1. Push to GitHub repository
2. Go to Settings > Pages
3. Select "GitHub Actions" as source
4. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 4. Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

## Environment Variables Required

Set these in your deployment platform:

- `VITE_OPENAI_API_KEY` - Your OpenAI API key (Required)
- `VITE_RAPIDAPI_KEY` - RapidAPI key (Optional, for enhanced data)

## Build Configuration

The project builds to static files in `dist/` directory:

- `npm run build` - Creates production build
- `npm run preview` - Preview production build locally

## Domain Setup

Once deployed, you can:

1. Use the provided subdomain (e.g., `your-app.vercel.app`)
2. Connect your custom domain
3. Enable HTTPS (most platforms do this automatically)

## Performance Tips

- The build is optimized and includes tree-shaking
- Gzip compressed: ~123KB for JS, ~9KB for CSS
- Uses code splitting for better loading
- All dependencies are bundled efficiently
