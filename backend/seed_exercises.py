"""
Seed script to populate the database with lesson exercises from lesson-data.json
"""

import json
import sqlite3
from datetime import datetime

DATABASE = 'dsa_tracker.db'

def seed_exercises():
    # Load lesson data
    with open('../dsa-study/src/components/lesson-data.json', 'r') as f:
        lesson_data = json.load(f)

    db = sqlite3.connect(DATABASE)
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
                    print(f"Skipping {problem_id} - already exists")
                    continue

                # Insert the exercise as a problem
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
                    1,  # is_lesson_exercise
                    lesson['id'],
                    exercise.get('starterCode'),
                    exercise.get('solution'),
                    json.dumps(exercise.get('testCases', []))
                ))
                count += 1
                print(f"Added: {exercise.get('title', lesson['title'])}")

    db.commit()
    db.close()

    print(f"\n✓ Successfully seeded {count} exercises!")

if __name__ == '__main__':
    seed_exercises()
