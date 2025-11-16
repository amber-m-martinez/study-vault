# Quick Start Guide

## Overview
Your DSA Study app now has a Python backend that:
- Automatically stores all lesson exercises
- Tracks your progress (which exercises you've completed)
- Syncs progress between the Lessons page and Problems page

## How to Run

### 1. Start the Backend (Terminal 1)

```bash
cd /Users/ambermartinez/src/Code/dsa-study/backend

# Install dependencies (first time only)
pip3 install -r requirements.txt

# Start the server
python3 app.py
```

You should see:
```
✓ Seeded 12 lesson exercises
 * Running on http://127.0.0.1:5001
```

**Important:**
- Keep this terminal window open while using the app!
- Port 5001 is used instead of 5000 (which is often used by macOS AirPlay Receiver)

### 2. Start the Frontend (Terminal 2)

```bash
cd /Users/ambermartinez/src/Code/dsa-study/dsa-study

# Start React app
npm start
```

The app will open at `http://localhost:3000`

## How It Works

### Lessons Page
- View lessons by category
- Click on a lesson to see the exercise
- Write your code and run tests
- When all tests pass, the exercise is automatically marked complete

### Problems Page
- Shows all lesson exercises in one place
- Filter by "All Exercises" or "Completed"
- See statistics (total exercises vs completed)
- Track which exercises you've finished

### Progress Syncing
- Complete an exercise in Lessons → automatically shows as complete in Problems
- All progress stored in SQLite database (`backend/dsa_tracker.db`)
- Your code is saved when you complete exercises

## Troubleshooting

**"Backend not running" error?**
- Make sure you started the backend server (`python app.py`)
- Check it's running on port 5000

**No exercises showing?**
- The backend auto-seeds exercises from `lesson-data.json` on startup
- If you see 0 exercises, check the backend terminal for errors

**Progress not syncing?**
- Make sure both frontend and backend are running
- Check browser console for API errors

## Features Removed
- Custom problem adding (simplified to only lesson exercises)
- All problems/exercises are pre-defined from lessons
- Focus is on tracking progress through the curriculum
