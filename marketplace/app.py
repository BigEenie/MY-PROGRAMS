from flask import Flask, request
import sqlite3

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_form():
    username = request.form['username']
    email = request.form['email']
    
    # Save to database
    conn = sqlite3.connect('responses.db')
    cursor = conn.cursor()
    cursor.execute('CREATE TABLE IF NOT EXISTS responses (username TEXT, email TEXT)')
    cursor.execute('INSERT INTO responses (username, email) VALUES (?, ?)', (username, email))
    conn.commit()
    conn.close()
    
    return "Thanks! Your response has been saved."
