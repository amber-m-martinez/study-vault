# DSA Study App Setup Guide

This guide will help you set up the DSA Study application with the Python backend.

## Architecture

The application now has two parts:
1. **Frontend**: React app (port 3000)
2. **Backend**: Python Flask API (port 5000)

The backend stores:
- Lesson exercises (automatically imported from lesson-data.json)
- Custom problems you add
- Progress tracking (which problems are completed, when, and your code)

## Setup Steps

### 1. Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Seed the database with lesson exercises
python seed_exercises.py

# Start the backend server
python app.py
```

The backend will start on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to frontend folder
cd dsa-study

# Install dependencies (if not already done)
npm install

# Start the React app
npm start
```

The frontend will start on `http://localhost:3000`

## Features

### Problems Page
- View all problems (both lesson exercises and custom problems)
- Filter by:
  - All problems
  - Lesson Exercises only
  - Custom Problems only
  - Completed problems
- Statistics showing total, exercises, custom, and completed counts
- Mark problems as complete
- Edit/Delete custom problems (lesson exercises cannot be deleted)

### Lessons Page
- Browse lessons by category
- Complete interactive exercises
- Code gets saved when you complete exercises
- Progress is synced with the Problems page

### Data Synchronization
- When you complete an exercise in a lesson, it automatically appears as completed in the Problems page
- Progress is stored in SQLite database
- All your code submissions are saved

## Database Schema

### Tables

**problems**
- Stores both lesson exercises and custom problems
- Fields: id, title, category, difficulty, description, platform, is_lesson_exercise, lesson_id, starter_code, solution, test_cases, time_complexity, space_complexity

**user_progress**
- Tracks completion status and user code
- Fields: problem_id, user_code, completed, completed_at, last_attempted

**lesson_completion**
- Tracks which lessons are completed
- Fields: lesson_id, completed_at

## API Endpoints

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/<id>` - Get specific problem
- `POST /api/problems` - Create new problem
- `PUT /api/problems/<id>` - Update problem
- `DELETE /api/problems/<id>` - Delete problem

### Progress
- `POST /api/progress/<problem_id>` - Update progress
- `GET /api/progress` - Get all progress

### Lessons
- `POST /api/lessons/complete/<lesson_id>` - Mark lesson complete
- `GET /api/lessons/completed` - Get completed lessons

## Troubleshooting

### Backend won't start
- Make sure you have Python 3.7+ installed
- Check that Flask and flask-cors are installed: `pip list | grep -i flask`

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check for CORS errors in browser console
- Verify `API_BASE_URL` in `src/services/api.js` is correct

### No exercises showing in Problems page
- Make sure you ran `python seed_exercises.py` to populate the database
- Check that `dsa_tracker.db` file exists in the backend folder

## Development Notes

- The app falls back to localStorage if the backend is unavailable
- Lesson exercises are marked with a blue "Lesson Exercise" badge
- Custom problems can be edited/deleted, lesson exercises cannot
