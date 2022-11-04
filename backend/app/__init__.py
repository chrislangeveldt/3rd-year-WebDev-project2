from flask import Flask
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from datetime import timedelta

app = Flask(__name__)
CORS(app)

ACCESS_EXPIRES = timedelta(minutes=30)

app.config['SECRET_KEY'] = 'b3f57e06d27c79f0aaaf21a2a42079be'
app.config["ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:@localhost/Spot'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
ma = Marshmallow(app)

from .crud import create, read, update, delete