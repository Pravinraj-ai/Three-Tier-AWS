from flask import Flask, request, jsonify
import mysql.connector
app = Flask(__name__)


db_config = {
    'host': 'db-server.c3siewoosk21.eu-north-1.rds.amazonaws.com',
    'user': 'admin',
    'password': 'admin123',
    'database': 'user_data'
}
def get_db_connection():
    return mysql.connector.connect(**db_config)

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    name, email, age = data['name'], data['email'], data['age']
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name, email, age) VALUES (%s, %s, %s)", (name, email, age))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'message': 'User added successfully'}), 201

@app.route('/get_users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
