# 🎄 Christmas Movie Trivia Game

A beautiful, interactive Christmas movie trivia game with QR code join functionality. Perfect for holiday gatherings!

## Features

- 🎯 **QR Code Join**: Players can scan a QR code to join the game
- 🎬 **Christmas Movie Trivia**: 15 fun questions about classic Christmas movies
- 🎨 **Beautiful UI**: Elegant, vibrant Christmas-themed design with animations
- 📱 **Responsive**: Works perfectly on mobile and desktop
- ⚡ **Real-time**: Live scoring and answer tracking
- 🏆 **Leaderboard**: See who wins at the end!
- ⏱️ **30 Second Timer**: Each question has a 30-second timer
- 💯 **10 Points Per Answer**: Each correct answer earns 10 points

## Game Flow

1. **Lobby**: Host displays QR code, players scan and enter their names
2. **Game Start**: Host clicks "Start Game" when everyone is ready
3. **Questions**: Each question shows for 30 seconds
4. **Scoring**: Correct answers = 10 points, wrong/no answer = 0 points
5. **Results**: After timer, correct answer is revealed
6. **Leaderboard**: Final round shows complete leaderboard with winner

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Method 1: Via GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/christmas-trivia.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project" → Import your repository
   - Click "Deploy" (settings auto-detected)
   - Your site is live! 🎉

### Method 2: Via CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## How to Play

1. **Host**: Open the game on a shared screen (TV, projector, etc.)
2. **Players**: Scan the QR code with their phones
3. **Join**: Players enter their names to join
4. **Start**: Host clicks "Start Game" when everyone is ready
5. **Answer**: Players tap answers on their phones (30 seconds per question)
6. **Results**: See scores after each question
7. **Winner**: Final leaderboard shows the champion!

## Scoring System

- ✅ **Correct Answer**: +10 points
- ❌ **Wrong Answer**: 0 points
- ⏱️ **No Answer (Timer Expires)**: 0 points

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **QRCode.react** - QR code generation

## License

MIT

