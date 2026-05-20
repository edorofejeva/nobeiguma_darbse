import os
import sqlite3
from flask import Flask, jsonify, render_template, request

# Create the Flask application and set the path for SQLite database.
app = Flask(__name__, static_folder="static", template_folder="templates")
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "scores.db")


def get_db_connection():
    """Open a connection to the SQLite database."""
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize the database and create the high_scores table if needed."""
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS high_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            combo INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()
    conn.close()


@app.route("/")
def index():
    """Render the main game page."""
    return render_template("index.html")


@app.route("/api/highscores", methods=["GET"])
def api_highscores():
    """Return the top high scores as JSON."""
    conn = get_db_connection()
    rows = conn.execute(
        "SELECT player_name, score, combo, created_at FROM high_scores ORDER BY score DESC, combo DESC LIMIT 10"
    ).fetchall()
    conn.close()

    high_scores = [
        {"player_name": row["player_name"], "score": row["score"], "combo": row["combo"], "created_at": row["created_at"]}
        for row in rows
    ]
    return jsonify({"high_scores": high_scores})


@app.route("/api/score", methods=["POST"])
def api_save_score():
    """Save a player's score in the database and return the saved record."""
    data = request.get_json() or {}
    name = data.get("player_name", "Player").strip()[:20] or "Player"
    score = int(data.get("score", 0))
    combo = int(data.get("combo", 0))

    conn = get_db_connection()
    cursor = conn.execute(
        "INSERT INTO high_scores (player_name, score, combo) VALUES (?, ?, ?)",
        (name, score, combo),
    )
    conn.commit()
    inserted_id = cursor.lastrowid
    conn.close()

    return jsonify({"status": "ok", "id": inserted_id, "player_name": name, "score": score, "combo": combo})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
