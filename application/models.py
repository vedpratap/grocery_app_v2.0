#-------------Defining all the tables------------------------

from flask_sqlalchemy import SQLAlchemy 
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    fullname = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    mobile_no = db.Column(db.String, unique=False)
    address = db.Column(db.String, unique=False)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    #product = db.relationship("Products", backref = "buyer")
    
class Role(db.Model,RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Category(db.Model):
    __tablename__ = 'category'
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))
    is_approved = db.Column(db.Boolean(), default=False)

class Manager_requests(db.Model):
    __tablename__ = 'manager_requests'
    id = db.Column(db.Integer(), primary_key=True)
    man_id = db.Column(db.Integer(), nullable=False)
    type = db.Column(db.String(80))
    detail = db.Column(db.String(255), nullable=False)
    reason = db.Column(db.String(255))
    is_approved = db.Column(db.Boolean(), default=False)
    is_solved = db.Column(db.Boolean(), default=False)
    admin_comment = db.Column(db.String(255), default="Yet to be check.")

class Products(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer(), primary_key=True)
    man_id = db.Column(db.Integer())
    timestamp = db.Column(db.String())
    name = db.Column(db.String(80), unique=True, nullable = False)
    description = db.Column(db.String(255))
    cat_id = db.Column(db.String())
    category_name = db.Column(db.String(), nullable = False)
    rate = db.Column(db.String(), nullable = False)
    unit = db.Column(db.String(255), nullable = False)
    man_date = db.Column(db.String(255), nullable = False)
    expire_date = db.Column(db.String(255), nullable = False)
    in_stock = db.Column(db.Boolean())
    avl_quantity = db.Column(db.Double(255))
    sold_unit = db.Column(db.Double(255), default=0.0)


class Cart(db.Model):
    __tablename__ = "cart"
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    prod_id = db.Column(db.Integer, nullable=False, unique=True)
    name = db.Column(db.String(255), nullable=False)
    category_name = db.Column(db.String(255), nullable=False)
    quantity = db.Column(db.Double(), nullable=False)
    rate = db.Column(db.Double(), nullable=False)
    total_amount = db.Column(db.Double(),nullable=False)

class Orders(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer(), primary_key=True)
    timestamp = db.Column(db.String(255))
    user_id = db.Column(db.Integer())
    orderedItems = db.Column(db.VARCHAR(10000), nullable=False)
    total_amount = db.Column(db.Double(255), nullable=False)
    shipping_add = db.Column(db.String(255))
    mobile_no = db.Column(db.String(255))
    status = db.Column(db.String(), default="Order placed")
    payment_status = db.Column(db.Boolean(), default=True)
    
