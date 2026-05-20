# Number Hunter

A colorful local browser game built with Flask, SQLite, HTML, CSS, and JavaScript.

## Game concept

Players click number balloons to match a target value. Correct clicks add score and combo bonuses. A countdown timer creates fast-paced gameplay, and high scores are stored locally in SQLite.

## Features

- Child-friendly game UI with balloon animations
- Target number, score, combo, and timer display
- Combo multiplier for consecutive correct hits
- High scores saved to SQLite database
- JSON API endpoints for high score retrieval and saving
- Clean folder structure for frontend and backend

## Setup instructions

1. Open a terminal in the project folder.
2. Create a Python virtual environment:

   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

3. Install dependencies:

   ```powershell
   pip install -r requirements.txt
   ```

4. Run the Flask app:

   ```powershell
   python app.py
   ```

5. Open a browser and go to:

   ```text
   http://127.0.0.1:5000
   ```

## Project structure

- `app.py` - Flask backend and SQLite persistence
- `templates/index.html` - Main game UI
- `static/css/style.css` - Visual styling and animations
- `static/js/game.js` - Game logic and client-side interaction
- `requirements.txt` - Python dependencies

## Notes

The game creates `scores.db` automatically when started. High scores are stored locally and refreshed on each page load.
