# 🎄 Christmas Movie Trivia Game

A beautiful, interactive Christmas movie trivia game with QR code join functionality. Perfect for holiday gatherings!

## Features

- 🎯 **QR Code Join**: Players can scan a QR code to join the game
- 🎬 **Christmas Movie Trivia**: 15 fun questions about classic Christmas movies
- 🎨 **Beautiful UI**: Elegant, vibrant Christmas-themed design with animations
- 📱 **Responsive**: Works perfectly on mobile and desktop
- ⚡ **Real-time**: Live scoring and answer tracking
- 🏆 **Leaderboard**: See who wins at the end!

## Getting Started

### Prerequisites

Before you begin, make sure you have:
- **Node.js 18 or higher** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- A code editor (VS Code recommended)

### Step-by-Step: Running Locally

#### Step 1: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd` or `powershell`, press Enter
- **Mac/Linux**: Open Terminal from Applications

#### Step 2: Navigate to Project Directory
```bash
cd C:\Users\preet\Desktop\games\christmas-trivia
```
*(Replace with your actual project path if different)*

#### Step 3: Install Dependencies
```bash
npm install
```
This will install all required packages. Wait for it to complete (may take 1-2 minutes).

#### Step 4: Start Development Server
```bash
npm run dev
```

You should see output like:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
- Ready in 2.3s
```

#### Step 5: Open in Browser
Open your web browser and go to:
```
http://localhost:3000
```

You should see the Christmas Trivia game! 🎄

#### Step 6: Stop the Server
When you're done testing, press `Ctrl + C` in the terminal to stop the server.

---

## Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

#### Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in (create account if needed)
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it `christmas-trivia` (or any name you like)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

#### Step 2: Push Code to GitHub

In your terminal (in the project directory):

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Christmas Trivia Game"

# Add your GitHub repository as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/christmas-trivia.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note**: If you haven't set up Git before, you may need to:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

#### Step 3: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and click **"Sign Up"** or **"Log In"**
2. Sign in with your **GitHub account** (recommended for easy integration)
3. Once logged in, click **"Add New..."** → **"Project"**
4. You'll see a list of your GitHub repositories
5. Find and click **"Import"** next to your `christmas-trivia` repository
6. Vercel will automatically detect it's a Next.js project
7. **Don't change any settings** - the defaults are perfect:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
8. Click **"Deploy"**
9. Wait 1-2 minutes for the build to complete
10. **Success!** 🎉 You'll see a success message with your live URL (e.g., `christmas-trivia.vercel.app`)

#### Step 4: Access Your Live Site

- Your site is now live! Share the URL with anyone
- Vercel will automatically deploy updates when you push to GitHub
- You can find your project anytime at [vercel.com/dashboard](https://vercel.com/dashboard)

---

### Method 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate.

#### Step 3: Deploy
In your project directory:
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No (first time)
- **What's your project's name?** → `christmas-trivia` (or press Enter)
- **In which directory is your code located?** → `./` (press Enter)

#### Step 4: Production Deploy
For production deployment:
```bash
vercel --prod
```

Your site will be live at a URL like: `christmas-trivia.vercel.app`

---

## Troubleshooting

### Local Development Issues

**Problem**: `npm install` fails
- **Solution**: Make sure Node.js 18+ is installed. Check with `node --version`

**Problem**: Port 3000 already in use
- **Solution**: Kill the process using port 3000 or use a different port:
  ```bash
  npm run dev -- -p 3001
  ```

**Problem**: Build errors
- **Solution**: Delete `node_modules` and `.next` folder, then:
  ```bash
  npm install
  npm run dev
  ```

### Vercel Deployment Issues

**Problem**: Build fails on Vercel
- **Solution**: Check the build logs in Vercel dashboard. Common issues:
  - Missing dependencies (check `package.json`)
  - TypeScript errors (run `npm run build` locally first)

**Problem**: Site shows 404
- **Solution**: Make sure you pushed all files to GitHub, especially the `app` folder

**Problem**: QR code doesn't work
- **Solution**: Make sure you're accessing the site via HTTPS (Vercel provides this automatically)

---

## Updating Your Deployed Site

After making changes:

1. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

2. **Vercel automatically deploys** - wait 1-2 minutes and your changes will be live!

---

## Need Help?

- Check Vercel docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)

## How to Play

1. Open the game on a shared screen (TV, projector, etc.)
2. Players scan the QR code with their phones
3. Players enter their names to join
4. Host clicks "Start Game"
5. Answer questions and see scores in real-time
6. Winner is announced at the end!

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **QRCode.react** - QR code generation

## License

MIT
