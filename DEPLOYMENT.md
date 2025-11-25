# 🚀 Quick Deployment Guide

## Running Locally (3 Steps)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Go to: http://localhost:3000
```

## Deploying to Vercel (5 Steps)

### Option A: Via GitHub (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/christmas-trivia.git
   git push -u origin main
   ```

2. **Go to vercel.com** → Sign in with GitHub

3. **Click "New Project"** → Import your repository

4. **Click "Deploy"** (settings are auto-detected)

5. **Done!** Your site is live 🎉

### Option B: Via CLI

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Production deploy
vercel --prod
```

## Your Live URL

After deployment, Vercel will give you a URL like:
- `https://christmas-trivia.vercel.app`
- Or a custom domain if you set one up

## Testing the QR Code

1. Open your live Vercel URL on a computer/tablet
2. Display it on a screen (TV, projector, etc.)
3. Players scan the QR code with their phones
4. Everyone joins and plays!

---

**Need more details?** See [README.md](./README.md) for complete instructions.

