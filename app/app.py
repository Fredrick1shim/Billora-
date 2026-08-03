import os
import sys
from flask import Flask, jsonify, request, session, render_template
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
from threading import Timer
import webbrowser

# ------------------------------
# Paths for exe distribution
# ------------------------------
def get_base_dir():
    return getattr(sys, '_MEIPASS', os.path.abspath(os.path.dirname(__file__)))

BASE_DIR = get_base_dir()
db_path = os.path.join(BASE_DIR, "bills.db")
template_dir = os.path.join(BASE_DIR, "templates")
static_dir = os.path.join(BASE_DIR, "static")

# ------------------------------
# Flask App Setup
# ------------------------------
app = Flask(__name__, template_folder=template_dir, static_folder=static_dir)
app.config['SECRET_KEY'] = 'Fredrick_really_is_him'
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_path}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db = SQLAlchemy(app)

# ------------------------------
# Initialize DB once
# ------------------------------
with app.app_context():
    db.create_all()

# ------------------------------
# Models
# ------------------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def to_dict(self):
        return {"id": self.id, "email": self.email}

class Bill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(80), nullable=False)
    due_date = db.Column(db.String(20), nullable=False)
    frequency = db.Column(db.String(40), nullable=False)
    is_paid = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "amount": self.amount,
            "category": self.category,
            "due_date": self.due_date,
            "frequency": self.frequency,
            "is_paid": self.is_paid
        }

# ------------------------------
# Auth Decorator
# ------------------------------
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({"error": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function

# ------------------------------
# API Routes
# ------------------------------
@app.route('/api/bills', methods=['GET'])
def get_bills():
    bills = Bill.query.all()
    return jsonify([bill.to_dict() for bill in bills])

@app.route('/api/bills', methods=['POST'])
def add_bill():
    data = request.json
    bill = Bill(
        name=data.get('name'),
        amount=data.get('amount'),
        category=data.get('category'),
        due_date=data.get('due_date'),
        frequency=data.get('frequency'),
        is_paid=data.get('is_paid', False)
    )
    db.session.add(bill)
    db.session.commit()
    return jsonify(bill.to_dict()), 201


@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    hashed_pw = generate_password_hash(data['password'])
    user = User(email=data['email'], password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.to_dict()), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        session['user_id'] = user.id
        return jsonify({"message": "Login successful", "user": user.to_dict()})
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/bills/<int:bill_id>', methods=['DELETE'])
@login_required
def delete_bill(bill_id):
    bill = Bill.query.get_or_404(bill_id)
    db.session.delete(bill)
    db.session.commit()
    return '', 204

# ------------------------------
# Page Routes
# ------------------------------
@app.route('/')
def create_page():
    return render_template("create.html")   # ✅ start with create.html


@app.route('/mainpage')
def mainpage():
    return render_template("mainpage.html")

@app.route('/about_us')
def about_page():
    return render_template("about_us.html")

@app.route('/explore')
def explore_page():
    return render_template("explore.html")

@app.route('/login')
def login_page():
    return render_template("login.html")

@app.route('/the_project')
def project_page():
    return render_template("the_project.html")

@app.route('/pra')
def pra_page():
    return render_template("pra.html")

# ------------------------------
# Run Flask and open / (create.html)
# ------------------------------
def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")

if __name__ == '__main__':
    Timer(1, open_browser).start()
    app.run(host="0.0.0.0", port=5000, debug=False)