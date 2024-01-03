from main import app
from application.sec import datastore
from application.models import db, Role
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    
    datastore.find_or_create_role(name = "admin", description = "User is an Admin.")
    datastore.find_or_create_role(name = "manager", description = "User is a Store Manager.")
    datastore.find_or_create_role(name = "buyer", description = "User is an buyer.")
    db.session.commit()
    if not datastore.find_user(email = "admin@gmail.com"):
        datastore.create_user(email="admin@gmail.com", password=generate_password_hash("admin"), roles=["admin"])
    db.session.commit()