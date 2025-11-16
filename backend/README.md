# DSA Tracker Backend

Python Flask backend for the DSA Study application.

## Setup

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/<id>` - Get specific problem
- `POST /api/problems` - Create new problem
- `PUT /api/problems/<id>` - Update problem
- `DELETE /api/problems/<id>` - Delete problem

### Progress
- `POST /api/progress/<problem_id>` - Update user progress
- `GET /api/progress` - Get all progress

### Lessons
- `POST /api/lessons/complete/<lesson_id>` - Mark lesson complete
- `GET /api/lessons/completed` - Get completed lessons

### Seed Data
- `POST /api/seed-lesson-exercises` - Seed exercises from lesson data
