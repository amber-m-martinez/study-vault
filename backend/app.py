from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

DATABASE = 'dsa_tracker.db'

def get_db():
    """Get database connection"""
    db = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

def init_db():
    """Initialize database with tables"""
    db = get_db()
    cursor = db.cursor()

    # Problems table - stores both lesson exercises and user-added problems
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS problems (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            description TEXT,
            platform TEXT,
            is_lesson_exercise INTEGER DEFAULT 0,
            lesson_id TEXT,
            starter_code TEXT,
            solution TEXT,
            test_cases TEXT,
            time_complexity TEXT,
            space_complexity TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # User progress table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            problem_id TEXT NOT NULL,
            user_code TEXT,
            completed INTEGER DEFAULT 0,
            completed_at TIMESTAMP,
            last_attempted TIMESTAMP,
            FOREIGN KEY (problem_id) REFERENCES problems(id)
        )
    ''')

    # Lessons completion tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS lesson_completion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lesson_id TEXT NOT NULL UNIQUE,
            completed_at TIMESTAMP
        )
    ''')

    db.commit()
    db.close()

# Initialize database on startup
init_db()

def seed_exercises_from_file():
    """Automatically seed exercises from lesson-data.json if not already seeded"""
    lesson_data_path = os.path.join(os.path.dirname(__file__), '../dsa-study/src/components/lesson-data.json')

    if not os.path.exists(lesson_data_path):
        print(f"Warning: lesson-data.json not found at {lesson_data_path}")
        return

    with open(lesson_data_path, 'r') as f:
        lesson_data = json.load(f)

    db = get_db()
    cursor = db.cursor()

    count = 0
    for category, lessons in lesson_data.items():
        for lesson in lessons:
            if 'exercise' in lesson:
                exercise = lesson['exercise']
                problem_id = f"{lesson['id']}-exercise"

                # Check if already exists
                cursor.execute('SELECT id FROM problems WHERE id = ?', (problem_id,))
                if cursor.fetchone():
                    continue

                cursor.execute('''
                    INSERT INTO problems (
                        id, title, category, difficulty, description,
                        is_lesson_exercise, lesson_id, starter_code,
                        solution, test_cases
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    problem_id,
                    exercise.get('title', lesson['title']),
                    category,
                    exercise.get('difficulty', lesson['difficulty']),
                    exercise.get('description'),
                    1,
                    lesson['id'],
                    exercise.get('starterCode'),
                    exercise.get('solution'),
                    json.dumps(exercise.get('testCases', []))
                ))
                count += 1

    db.commit()
    db.close()

    if count > 0:
        print(f"✓ Seeded {count} lesson exercises")

# Auto-seed on startup
seed_exercises_from_file()

# ==================== PROBLEMS ENDPOINTS ====================

@app.route('/api/problems', methods=['GET'])
def get_problems():
    """Get all problems (both exercises and user-added)"""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('''
        SELECT p.*, up.completed, up.completed_at, up.user_code, up.last_attempted
        FROM problems p
        LEFT JOIN user_progress up ON p.id = up.problem_id
        ORDER BY p.created_at DESC
    ''')

    problems = []
    for row in cursor.fetchall():
        problem = dict(row)
        # Parse JSON fields
        if problem['test_cases']:
            problem['test_cases'] = json.loads(problem['test_cases'])
        problems.append(problem)

    db.close()
    return jsonify(problems)

@app.route('/api/problems/<problem_id>', methods=['GET'])
def get_problem(problem_id):
    """Get a specific problem"""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('''
        SELECT p.*, up.completed, up.completed_at, up.user_code, up.last_attempted
        FROM problems p
        LEFT JOIN user_progress up ON p.id = up.problem_id
        WHERE p.id = ?
    ''', (problem_id,))

    row = cursor.fetchone()
    db.close()

    if row:
        problem = dict(row)
        if problem['test_cases']:
            problem['test_cases'] = json.loads(problem['test_cases'])
        return jsonify(problem)
    return jsonify({'error': 'Problem not found'}), 404

@app.route('/api/problems', methods=['POST'])
def create_problem():
    """Create a new problem"""
    data = request.json
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute('''
            INSERT INTO problems (
                id, title, category, difficulty, description, platform,
                is_lesson_exercise, lesson_id, starter_code, solution,
                test_cases, time_complexity, space_complexity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('id', str(datetime.now().timestamp())),
            data['title'],
            data['category'],
            data['difficulty'],
            data.get('description'),
            data.get('platform'),
            data.get('is_lesson_exercise', 0),
            data.get('lesson_id'),
            data.get('starter_code'),
            data.get('solution'),
            json.dumps(data.get('test_cases', [])),
            data.get('time_complexity'),
            data.get('space_complexity')
        ))

        db.commit()
        problem_id = data.get('id', str(datetime.now().timestamp()))
        db.close()

        return jsonify({'id': problem_id, 'message': 'Problem created'}), 201
    except Exception as e:
        db.close()
        return jsonify({'error': str(e)}), 400

@app.route('/api/problems/<problem_id>', methods=['PUT'])
def update_problem(problem_id):
    """Update a problem"""
    data = request.json
    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute('''
            UPDATE problems
            SET title = ?, category = ?, difficulty = ?, description = ?,
                platform = ?, solution = ?, time_complexity = ?, space_complexity = ?
            WHERE id = ?
        ''', (
            data['title'],
            data['category'],
            data['difficulty'],
            data.get('description'),
            data.get('platform'),
            data.get('solution'),
            data.get('time_complexity'),
            data.get('space_complexity'),
            problem_id
        ))

        db.commit()
        db.close()

        return jsonify({'message': 'Problem updated'})
    except Exception as e:
        db.close()
        return jsonify({'error': str(e)}), 400

@app.route('/api/problems/<problem_id>', methods=['DELETE'])
def delete_problem(problem_id):
    """Delete a problem"""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('DELETE FROM problems WHERE id = ?', (problem_id,))
    cursor.execute('DELETE FROM user_progress WHERE problem_id = ?', (problem_id,))

    db.commit()
    db.close()

    return jsonify({'message': 'Problem deleted'})

# ==================== PROGRESS ENDPOINTS ====================

@app.route('/api/progress/<problem_id>', methods=['POST'])
def update_progress(problem_id):
    """Update progress for a problem"""
    data = request.json
    db = get_db()
    cursor = db.cursor()

    # Check if progress exists
    cursor.execute('SELECT id FROM user_progress WHERE problem_id = ?', (problem_id,))
    existing = cursor.fetchone()

    if existing:
        cursor.execute('''
            UPDATE user_progress
            SET user_code = ?, completed = ?, completed_at = ?, last_attempted = ?
            WHERE problem_id = ?
        ''', (
            data.get('user_code'),
            data.get('completed', 0),
            data.get('completed_at'),
            datetime.now().isoformat(),
            problem_id
        ))
    else:
        cursor.execute('''
            INSERT INTO user_progress (problem_id, user_code, completed, completed_at, last_attempted)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            problem_id,
            data.get('user_code'),
            data.get('completed', 0),
            data.get('completed_at'),
            datetime.now().isoformat()
        ))

    db.commit()
    db.close()

    return jsonify({'message': 'Progress updated'})

@app.route('/api/progress', methods=['GET'])
def get_all_progress():
    """Get all user progress"""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT * FROM user_progress')
    progress = [dict(row) for row in cursor.fetchall()]

    db.close()
    return jsonify(progress)

# ==================== LESSONS ENDPOINTS ====================

@app.route('/api/lessons/complete/<lesson_id>', methods=['POST'])
def mark_lesson_complete(lesson_id):
    """Mark a lesson as complete"""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT id FROM lesson_completion WHERE lesson_id = ?', (lesson_id,))
    if not cursor.fetchone():
        cursor.execute('''
            INSERT INTO lesson_completion (lesson_id, completed_at)
            VALUES (?, ?)
        ''', (lesson_id, datetime.now().isoformat()))

        db.commit()

    db.close()
    return jsonify({'message': 'Lesson marked complete'})

@app.route('/api/lessons/completed', methods=['GET'])
def get_completed_lessons():
    """Get all completed lessons"""
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT * FROM lesson_completion')
    lessons = [dict(row) for row in cursor.fetchall()]

    db.close()
    return jsonify(lessons)

# ==================== SEED DATA ====================

@app.route('/api/seed-lesson-exercises', methods=['POST'])
def seed_lesson_exercises():
    """Seed database with exercises from lesson-data.json"""
    lesson_data = request.json
    db = get_db()
    cursor = db.cursor()

    count = 0
    for category, lessons in lesson_data.items():
        for lesson in lessons:
            if 'exercise' in lesson:
                exercise = lesson['exercise']
                problem_id = f"{lesson['id']}-exercise"

                # Check if already exists
                cursor.execute('SELECT id FROM problems WHERE id = ?', (problem_id,))
                if not cursor.fetchone():
                    cursor.execute('''
                        INSERT INTO problems (
                            id, title, category, difficulty, description,
                            is_lesson_exercise, lesson_id, starter_code,
                            solution, test_cases
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        problem_id,
                        exercise.get('title', lesson['title']),
                        category,
                        exercise.get('difficulty', lesson['difficulty']),
                        exercise.get('description'),
                        1,
                        lesson['id'],
                        exercise.get('starterCode'),
                        exercise.get('solution'),
                        json.dumps(exercise.get('testCases', []))
                    ))
                    count += 1

    db.commit()
    db.close()

    return jsonify({'message': f'Seeded {count} exercises'})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
