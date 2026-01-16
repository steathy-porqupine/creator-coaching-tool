# Deployment Instructions

## Quick Deploy to Netlify

### Option 1: Drag & Drop (Easiest)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up or log in
3. Drag and drop your project folder onto the Netlify dashboard
4. Your site will be live instantly with a URL like `your-site-name.netlify.app`

### Option 2: GitHub + Netlify (Recommended)
1. Push this project to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

2. Connect to Netlify:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select your repository
   - Netlify will auto-detect settings (no build command needed for static sites)
   - Click "Deploy site"

3. Your site will be live at `your-site-name.netlify.app`

## Project Structure
- `index.html` - Main HTML file
- `styles.css` - All styling
- `script.js` - Interactive functionality
- No build process needed - ready to deploy!

## Custom Domain (Optional)
After deployment, you can add a custom domain in Netlify settings.
