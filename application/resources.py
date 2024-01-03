#-----------All APIs----------------------------

from flask_restful import Resource, Api, reqparse, marshal_with, fields, marshal
from .models import Products, db
from flask_security import auth_required
from flask import jsonify
from flask_security import current_user
from sqlalchemy import desc
from .instances import cache

api = Api(prefix ='/api')


items_field = {
    "id": fields.Integer,
    "man_id":fields.Integer,
    "timestamp" : fields.String,
    "name": fields.String,
    "description": fields.String,
    "cat_id": fields.Integer,
    "category_name":fields.String,
    "rate": fields.String,
    "unit": fields.String,
    "man_date": fields.String,
    "expire_date": fields.String,
    "in_stock" : fields.Boolean,
    "avl_quantity" : fields.Float,
    "sold_unit" : fields.Float,
}

class Items(Resource):
    @auth_required('token')
    #@cache.cached(timeout=50)
    def get(self):
        all_products = db.session.query(Products).order_by(desc(Products.timestamp)).all()
        if not all_products:
            return {"message":"No products found!."}, 404
        return marshal(all_products, items_field)

api.add_resource(Items, '/products')