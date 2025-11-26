# 🧪 Local Testing Guide

## Quick Start

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
Open [http://localhost:3000](http://localhost:3000) in your browser

---

## Testing the Full Flow

### Option 1: Test on Same Computer (Single Device)

1. **Open the app** in your browser: `http://localhost:3000`
2. **Click "Host a Game"** button
3. **See the QR code** - it will show `http://localhost:3000?mode=player`
4. **Open a new incognito/private window** (to simulate a different device)
5. **Manually type the URL**: `http://localhost:3000?mode=player`
6. **Enter your name** and join
7. **Go back to the host window** - you should see the player in the leaderboard
8. **Click "Start Game"** to begin

### Option 2: Test Across Devices (Recommended)

#### On Your Computer (Host):

1. **Find your local IP address**:
   - **Windows**: Open Command Prompt and type `ipconfig`
     - Look for "IPv4 Address" (e.g., `192.168.1.100`)
   - **Mac/Linux**: Open Terminal and type `ifconfig` or `ip addr`
     - Look for your network IP (usually starts with `192.168.x.x`)

2. **Start the dev server with network access**:
   ```bash
   npm run dev
   ```
   
   Or if that doesn't work, try:
   ```bash
   npx next dev -H 0.0.0.0
   ```

3. **Open in browser**: `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

4. **Click "Host a Game"**
5. **Check the QR code URL** - it should show `http://YOUR_IP_ADDRESS:3000?mode=player`

#### On Your Phone (Player):

1. **Make sure your phone is on the same WiFi network** as your computer
2. **Scan the QR code** from the host screen
   - Or manually type: `http://YOUR_IP_ADDRESS:3000?mode=player`
3. **Enter your name** and click "Join Game"
4. **Wait for host to start**

---

## Testing Checklist

### ✅ Landing Page
- [ ] Shows "Host a Game" button
- [ ] Button is clickable
- [ ] Christmas animations work

### ✅ Host View
- [ ] QR code displays correctly
- [ ] URL below QR code shows correct address
- [ ] Leaderboard shows "No players joined yet"
- [ ] "Start Game" button is disabled initially

### ✅ Player View (via QR scan)
- [ ] Opens directly to name input (not landing page)
- [ ] Can enter name and click "Join Game"
- [ ] Shows welcome message after joining
- [ ] Shows waiting message
- [ ] No "Start Game" button (only host can start)

### ✅ Shared State
- [ ] Player appears in host's leaderboard after joining
- [ ] Multiple players can join
- [ ] All players visible to host
- [ ] Players only see their own info

### ✅ Game Flow
- [ ] Host can start game
- [ ] Questions appear for all players
- [ ] Timer counts down
- [ ] Players can answer questions
- [ ] Scores update correctly
- [ ] Leaderboard shows at end

---

## Troubleshooting

### QR Code Points to Wrong URL
- **Check the URL displayed below the QR code**
- Make sure it shows your local IP (not `localhost`)
- If testing on same device, use `localhost:3000?mode=player`

### Can't Access from Phone
- **Check firewall**: Windows/Mac firewall might block port 3000
- **Check network**: Phone and computer must be on same WiFi
- **Try different IP**: Use `0.0.0.0` binding: `npx next dev -H 0.0.0.0`

### Players Don't Appear in Leaderboard
- **Check browser console** for errors (F12)
- **Verify API is working**: Check Network tab in DevTools
- **Refresh both pages** to sync state

### Port Already in Use
```bash
# Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill
```

---

## Quick Test Commands

```bash
# Install dependencies
npm install

# Start dev server (local only)
npm run dev

# Start dev server (network accessible)
npx next dev -H 0.0.0.0

# Build for production
npm run build

# Start production server
npm start
```

---

## Testing Tips

1. **Use Incognito/Private Windows**: Test as different users
2. **Clear localStorage**: Reset state between tests
   ```javascript
   // In browser console:
   localStorage.clear()
   ```
3. **Check Console**: Look for errors in browser DevTools (F12)
4. **Network Tab**: Verify API calls are working
5. **Mobile Emulation**: Use Chrome DevTools device emulation for quick testing

---

## Next Steps

Once local testing works, deploy to Vercel for real-world testing with actual QR codes!

