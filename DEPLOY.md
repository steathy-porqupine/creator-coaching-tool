# 🚀 Deployment Guide - Netlify

## Step 1: Push to GitHub

### Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Name it: `creator-coaching-tool` (or any name you prefer)
4. Make it **Public** (required for free Netlify)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Push Your Code
Run these commands in your terminal (you're already in the project folder):

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace:
- `YOUR_USERNAME` with your GitHub username
- `YOUR_REPO_NAME` with your repository name

---

## Step 2: Deploy to Netlify

### Option A: Connect GitHub (Recommended - Auto Deploy)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up or log in (you can use GitHub to sign in)
3. Click **"Add new site"** → **"Import an existing project"**
4. Click **"Deploy with GitHub"**
5. Authorize Netlify to access your GitHub
6. Select your repository (`creator-coaching-tool`)
7. Netlify will auto-detect:
   - **Build command:** (leave empty - no build needed)
   - **Publish directory:** `./` (root)
8. Click **"Deploy site"**
9. Wait ~30 seconds for deployment
10. **Your site is live!** You'll get a URL like: `https://random-name-123.netlify.app`

### Option B: Drag & Drop (Quick Test)
1. Go to [app.netlify.com](https://app.netlify.com)
2. Sign up or log in
3. Drag your entire project folder onto the Netlify dashboard
4. Your site deploys instantly!

---

## Step 3: Customize Your Site Name

After deployment:
1. Go to **Site settings** → **Change site name**
2. Choose a custom name (e.g., `creator-coaching-tool`)
3. Your new URL: `https://creator-coaching-tool.netlify.app`

---

## Step 4: Custom Domain (Optional)

1. In Netlify: **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Follow the DNS setup instructions

---

## ✅ Your Site is Live!

Once deployed, you'll have:
- ✅ Live website URL
- ✅ HTTPS (SSL) automatically enabled
- ✅ Auto-deploy on every GitHub push (if using GitHub method)
- ✅ Free hosting forever

---

## Quick Commands Reference

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Netlify will auto-deploy on push!
```

---

## Need Help?

- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **GitHub Docs:** [docs.github.com](https://docs.github.com)
