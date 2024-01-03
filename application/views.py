#-----------All endpoints for multiple operations--------------------

import datetime, json
from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, login_user, current_user
from .models import db, User, Category, Manager_requests, Products, Cart, Orders
from .sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
import flask_excel as excel
from .tasks import create_product_csv
from celery.result import AsyncResult
import numpy as np
import matplotlib.pyplot as plt
import ast


@app.get('/')
def home():
    return render_template("index.html")


@app.post("/user-signup")
def user_signup():
    data = request.get_json()
    fullname = data.get('fullname')
    if not fullname:
        return jsonify({"message":"Please enter name!"}), 400
    email = data.get('email')
    if not email:
        return jsonify({"message":"Please enter email!"}), 400
    password = data.get('password')
    if not password:
        return jsonify({"message":"Please enter password!"}), 400
    roles = data.get('role')
    if not roles:
        return jsonify({"message":"Please select role!"}), 400
    mobile_no = data.get('mobile_no')
    if not mobile_no:
        return jsonify({"message":"Please enter mobile number!"}), 400
    address = data.get('address')
    if not address:
        return jsonify({"message":"Please enter your full address!"}), 400
    if roles == "buyer":
        active = True
    else:
        active = False
    if not datastore.find_user(email = email):
        datastore.create_user(fullname=fullname, email=email, mobile_no=mobile_no, address=address, password=generate_password_hash(password), roles=[roles], active = active)
        db.session.commit()
        return jsonify({"message" : "User created!"})
    else:
        return jsonify({"message" : "User is there with given email-id. Please use different one."}), 400


@app.post("/user-login")
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message" : "Email not provided!"}), 400
    password = data.get('password')
    if not password:
        return jsonify({"message" : "Password not provided!"}), 400
    user1 = datastore.find_user(email=email)
    if not user1:
        return jsonify({"message" : "User not found!"}), 404
    if user1:
        active = user1.active
        if active == True: 
            if check_password_hash(user1.password, data.get('password')):
                login_user(user1, remember=True)
                return jsonify({"email" : user1.email, "token" : user1.get_auth_token(), "role" : user1.roles[0].name})
            else:
                return jsonify({"message" : "Wrong password!"}), 400
        else:
            return jsonify({"message" : "Please wait for the approval from Admin side. Thanks!"}), 404

user_fields = {
    "id" : fields.Integer,
    "fullname" : fields.String,
    "email" : fields.String,
    "roles" : fields.String,
    "active" : fields.Boolean,
}


@app.get('/managers')
@auth_required('token')
@roles_required('admin')
def all_users():
    users = User.query.all()
    if len(users)==0:
        return jsonify({"message" : "No user found!"}), 404
    return marshal(users, user_fields)

@app.get('/activate/manager/<int:manager_id>')
@auth_required("token")
@roles_required("admin")
def activate_manager(manager_id):
    manager = User.query.get(manager_id)
    if not manager or "manager" not in manager.roles:
        return jsonify({"message" : "Manager not found!!"}), 404
    manager.active = True
    db.session.commit()
    return jsonify({"message" : "Manager account activated!!"})

@app.get('/deactivate/manager/<int:manager_id>')
@auth_required("token")
@roles_required("admin")
def deactivate_manager(manager_id):
    manager = User.query.get(manager_id)
    if not manager or "manager" not in manager.roles:
        return jsonify({"message" : "Manager not found!!"}), 404
    manager.active = False
    db.session.commit()
    return jsonify({"message" : "Manager account deactivated!!"})


cat_fields = {
    "id" : fields.Integer,
    "name" : fields.String,
    "description" : fields.String,
    "is_approved" : fields.Boolean,
}


@app.get('/all-sections')
@auth_required('token')
@roles_required('admin')
def all_sections():
    sections = Category.query.all()
    if len(sections)==0:
        return jsonify({"message" : "No section/category found!"}), 404
    return marshal(sections, cat_fields)

@app.get('/all-man-sections')
@auth_required('token')
@roles_required('manager')
def all_man_sections():
    sections = Category.query.filter_by(is_approved=True).all()
    if len(sections)==0:
        return jsonify({"message" : "No section/category found!"}), 404
    return marshal(sections, cat_fields)

@app.get('/all-user-sections')
@auth_required('token')
@roles_required('buyer')
def all_user_sections():
    sections = Category.query.filter_by(is_approved=True).all()
    if len(sections)==0:
        return jsonify({"message" : "No section/category found!"}), 404
    return marshal(sections, cat_fields)

@app.post('/create-section')
@auth_required('token')
@roles_required('admin')
def create_section():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({"message" : "Enter category name."}), 400
    description = data.get('description')
    if not description:
        return jsonify({"message" : "Enter category description."}), 400
    cat1 = Category.query.get(name)
    if cat1:
        return jsonify({"message" : "Category is aleady available."}), 404
    category = Category(name=name, description=description, is_approved=True)
    db.session.add(category)
    db.session.commit()
    return jsonify({"message" : "Category created."})

@app.get('/delete-category/<int:cat_id>')
@auth_required('token')
@roles_required('admin')
def delete_cat(cat_id):
    cat1 = Category.query.get(cat_id)
    if not cat1:
        return jsonify({"message":"Category not found."}), 404
    db.session.delete(cat1)
    prods = Products.query.filter_by(category_name=cat1.name).all()
    if prods:
        for prod in prods:
            db.session.delete(prod)
    db.session.commit()
    return jsonify({"message" : "Category removed."})

@app.get('/get-category/<int:cat_id>')
@auth_required('token')
@roles_required('admin')
def get_category(cat_id):
    cat = Category.query.get(cat_id)
    if not cat:
        return jsonify({"message":"Category not found."}), 404
    return marshal(cat, cat_fields)

@app.post('/edit-category/<int:cat_id>')
@auth_required('token')
@roles_required('admin')
def edit_category(cat_id):
    data = request.get_json()
    new_name = data.get('name')
    if not new_name:
        return jsonify({"message" : "Enter category name."}), 400
    new_description = data.get('description')
    if not new_description:
        return jsonify({"message" : "Enter category description."}), 400
    status = data.get('status')
    if not status:
        return jsonify({"message" : "Select status."}), 400
    cat1 = Category.query.get(cat_id)
    if not cat1:
        return jsonify({"message":"Category not found."}), 404
    cat1.name = new_name
    cat1.description = new_description
    if status == "Approve":
        cat1.is_approved = True
    else:
        cat1.is_approved = False
    db.session.commit()
    return jsonify({"message" : "Category Modified."})

@app.get('/activate/category/<int:cat_id>')
@auth_required("token")
@roles_required("admin")
def activate_category(cat_id):
    category = Category.query.get(cat_id)
    if not category:
        return jsonify({"message" : "Category not found!!"}), 404
    category.is_approved = True
    db.session.commit()
    return jsonify({"message" : "Category activated!!"})

@app.get('/deactivate/category/<int:cat_id>')
@auth_required("token")
@roles_required("admin")
def deactivate_category(cat_id):
    category = Category.query.get(cat_id)
    if not category:
        return jsonify({"message" : "Category not found!!"}), 404
    category.is_approved = False
    db.session.commit()
    return jsonify({"message" : "Category deactivated!!"})


@app.post('/manager-request')
@auth_required('token')
@roles_required('manager')
def make_request():
    data = request.get_json()
    man_id = current_user.id
    type = data.get('type')
    if not type:
        return jsonify({"message" : "Select type."}), 400
    detail = data.get('detail')
    if not detail:
        return jsonify({"message" : "Enter request detail."}), 400
    reason = data.get('reason')
    if not reason:
        return jsonify({"message" : "Enter request reason."}), 400
    req = Manager_requests(type=type, man_id=man_id,detail = detail, reason = reason)
    db.session.add(req)
    db.session.commit()
    return jsonify({"message" : "Request Send!"})

request_fields={
    "id" : fields.Integer,
    "man_id":fields.Integer,
    "type" : fields.String,
    "detail" : fields.String,
    "reason" : fields.String, 
    "is_approved" : fields.Boolean,
    "is_solved" : fields.Boolean,
    "admin_comment" : fields.String
}

@app.get('/admin-request-check')
@auth_required('token')
@roles_required('admin')
def get_request_admin():
    requests = Manager_requests.query.all()
    return marshal(requests, request_fields)

@app.get('/manager-request-check')
@auth_required('token')
@roles_required('manager')
def get_request_manager():
    requests = Manager_requests.query.filter_by(man_id=current_user.id).all()
    return marshal(requests, request_fields)

@app.get('/accept-request/<int:req_id>')
@auth_required('token')
@roles_required('admin')
def accept_request(req_id):
    req = Manager_requests.query.filter_by(id=req_id).first()
    if not req:
        return jsonify({"message": "Request not found!"}), 404
    req.is_solved = True
    req.is_approved = True
    req.admin_comment = "Accepted and Made required changes."
    db.session.commit()
    return jsonify({"message":"Request has been accepted by admin."})

@app.get('/reject-request/<int:req_id>')
@auth_required('token')
@roles_required('admin')
def reject_request(req_id):
    req = Manager_requests.query.filter_by(id=req_id).first()
    if not req:
        return jsonify({"message": "Request not found!"}), 404
    req.is_solved = True
    req.is_approved = False
    req.admin_comment = "Rejected by admin."
    db.session.commit()
    return jsonify({"message":"Request has been rejected by admin."})

@app.get('/delete-request/<int:req_id>')
@auth_required('token')
@roles_required('admin')
def delete_req(req_id):
    req = Manager_requests.query.filter_by(id=req_id).first()
    if not req:
        return jsonify({"message":"Request not found."}), 404
    db.session.delete(req)
    db.session.commit()
    return jsonify({"message" : "Request removed."})


@app.post('/create-product')
@auth_required('token')
@roles_required('manager')
def create_product():
    data = request.get_json()
    import datetime
    man_id = current_user.id
    timestamp = datetime.datetime.now()
    name = data.get('name')
    if not name:
        return jsonify({"message":"Enter product name!"}), 400
    description = data.get('description')
    if not description:
        return jsonify({"message":"Enter product description!"}), 400
    category_name = data.get('category_name')
    if not category_name:
        return jsonify({"message":"Select category name!"}), 400
    rate = data.get('rate')
    if not rate:
        return jsonify({"message":"Enter product rate!"}), 400
    unit = data.get('unit')
    if not unit:
        return jsonify({"message":"Enter product unit!"}), 400
    man_date = data.get('man_date')
    if not man_date:
        return jsonify({"message":"Select manufacture date!"}), 400
    exp_date = data.get('exp_date')
    if not exp_date:
        return jsonify({"message":"Select expiry date!"}), 400
    avl_quantity = data.get('quantity')
    if not avl_quantity:
         return jsonify({"message":"Enter available quantity"}), 400
    prod = Products.query.get(name)
    if prod:
        return jsonify({"message":"Product is already there!"}), 404
    cat = Category.query.filter_by(name=category_name).first()
    cat_id = cat.id
    if float(avl_quantity) > 0:
        in_stock = True
    else:
        in_stock = False
    prod = Products(man_id=man_id, timestamp=timestamp, name=name, description=description, cat_id=cat_id, category_name=category_name, rate=rate, unit=unit, man_date=man_date, expire_date=exp_date, in_stock = in_stock, avl_quantity=avl_quantity)
    db.session.add(prod)
    db.session.commit()
    return jsonify({"message":"Product has been created."})

@app.get('/delete-product/<int:prod_id>')
@auth_required('token')
@roles_required('manager')
def delete_product(prod_id):
    prod = Products.query.filter_by(id = prod_id).first()
    if not prod:
        return jsonify({"message":"Product not found."}), 404
    db.session.delete(prod)
    db.session.commit()
    return jsonify({"message" : "Product removed."})

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
    "avl_quantity" : fields.Float,
    "sold_unit" : fields.Float,
}

@app.get('/get-product/<int:prod_id>')
@auth_required('token')
def get_product_by_id(prod_id):
    prod = Products.query.filter_by(id = prod_id).first()
    if not prod:
        return jsonify({"message":"Product not found!"}), 404
    return marshal(prod, items_field)


@app.post('/edit-product/<int:prod_id>')
@auth_required('token')
@roles_required('manager')
def edit_product(prod_id):
    data = request.get_json()
    import datetime
    man_id = current_user.id
    timestamp = datetime.datetime.now()
    name = data.get('name')
    if not name:
        return jsonify({"message":"Enter product name!"}), 400
    description = data.get('description')
    if not description:
        return jsonify({"message":"Enter product description!"}), 400
    category_name = data.get('category_name')
    if not category_name:
        return jsonify({"message":"Select category name!"}), 400
    rate = data.get('rate')
    if not rate:
        return jsonify({"message":"Enter product rate!"}), 400
    unit = data.get('unit')
    if not unit:
        return jsonify({"message":"Enter product unit!"}), 400
    man_date = data.get('man_date')
    if not man_date:
        return jsonify({"message":"Select manufacture date!"}), 400
    exp_date = data.get('exp_date')
    if not exp_date:
        return jsonify({"message":"Enter expiry date!"}), 400
    avl_quantity = data.get('quantity')
    if not avl_quantity:
         return jsonify({"message":"Enter available quantity"}), 400
    cat = Category.query.filter_by(name=category_name).first()
    cat_id = cat.id
    if float(avl_quantity) > 0:
        in_stock = True
    else:
        in_stock = False
    prod = Products.query.filter_by(id=prod_id).first()
    prod.name = name
    prod.description = description
    prod.category_name = category_name
    prod.cat_id = cat_id
    prod.rate = rate
    prod.unit = unit
    prod.man_date = man_date
    prod.expire_date = exp_date
    prod.in_stock = in_stock
    prod.avl_quantity = avl_quantity
    db.session.commit()
    return jsonify({"message":"Product has been Modified."})


@app.post('/add-to-cart/<int:prod_id>')
@auth_required('token')
@roles_required('buyer')
def add_to_cart(prod_id):
    data = request.get_json()
    name = data.get('name')
    category_name = data.get('category_name')
    quantity = data.get('quantity')
    if not quantity:
        return jsonify({"message":"Enter quantity to buy."}), 400
    prod = Products.query.filter_by(id=prod_id).first()
    if float(quantity) > float(prod.avl_quantity):
           return jsonify({"message":"Enter quantity less than or equal to available stock."}), 400
    rate = data.get('rate')
    total_amount = float(rate)*float(quantity)
    prod = Cart.query.filter_by(prod_id=prod_id, user_id=current_user.id).first()
    if prod:
            print(total_amount)
            prod.quantity += float(quantity)
            prod.total_amount += total_amount
            db.session.commit()
            return jsonify({"message":"Product added to cart."})
    else:
        added_prod = Cart(user_id = current_user.id, prod_id=prod_id, name=name, category_name=category_name, quantity = quantity, rate = rate, total_amount=total_amount)
        db.session.add(added_prod)
        db.session.commit()
        return jsonify({"message":"Product added to cart."})
    

cart_items_field = {
    "id": fields.Integer,
    "user_id": fields.Integer,
    "prod_id": fields.Integer,
    "name": fields.String,
    "category_name":fields.String,
    "rate": fields.Float,
    "quantity": fields.Float,
    "total_amount": fields.Float,
}

@app.get('/cart-items')
@auth_required('token')
@roles_required('buyer')
def cart_items():
    items = Cart.query.filter_by(user_id=current_user.id).all()
    if not items:
        return jsonify({"message":"Cart is Empty!"}), 404
    return marshal(items, cart_items_field)

@app.get('/delete-cart-item/<int:item_id>')
@auth_required('token')
@roles_required('buyer')
def delete_cart_item(item_id):
    item = Cart.query.filter_by(id=item_id,user_id=current_user.id).first()
    if not item:
        return jsonify({"message":"Item not found!"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message":"Cart item deleted."})


user_profile_items = {
    "fullname" : fields.String,
    "email" : fields.String,
    "mobile_no" : fields.String,
    "address" : fields.String,
}

@app.get('/user-info')
@auth_required('token')
def get_user_details():
    user = User.query.filter_by(id=current_user.id).first()
    if not user:
        return jsonify({"message":"No user found!"}), 404
    return marshal(user, user_profile_items)

@app.get('/place-order')
@auth_required('token')
@roles_required('buyer')
def place_order():
    cartItems = Cart.query.filter_by(user_id=current_user.id).all()
    if not cartItems:
        return jsonify({"message":"No item in cart. Add items in cart then order!"}), 404
    stock_status =[]
    for item in cartItems:
        prod = Products.query.filter_by(id = item.prod_id).first()
        stock_status.append(prod.avl_quantity >= item.quantity)
    all_in_stock = all(i for i in stock_status) 
    if all_in_stock == False:
         return jsonify({"message":"Some item in your cart is out of stock or added quantity is more than available stock. This is the case when you added the item in cart before and now someone else ordered which decreases the stock."})
    allItems = []
    grand_total = 0
    for item in cartItems:
        item_detail = []
        grand_total += item.total_amount
        item_detail.append(item.name)
        item_detail.append(item.category_name)
        item_detail.append(item.rate)
        item_detail.append(item.quantity)
        item_detail.append(item.total_amount)
        allItems.append(item_detail)
    user_id = current_user.id    
    timestamp = datetime.datetime.now()
    orderedItems = json.dumps(allItems)
    total_amount = grand_total
    order = Orders(user_id = user_id, timestamp=timestamp, orderedItems=orderedItems, total_amount=total_amount, shipping_add=current_user.address, mobile_no=current_user.mobile_no)
    db.session.add(order)
    db.session.commit()
    for item in cartItems:
        prod = Products.query.filter_by(id = item.prod_id).first()
        prod.avl_quantity -= item.quantity
        prod.sold_unit += item.quantity
        prod.in_stock = (prod.avl_quantity > 0)
        db.session.delete(item)
        db.session.commit()
    return jsonify({"message":"Order placed"})

order_fields = {
    "id":fields.Integer,
    "timestamp": fields.String,
    "user_id" : fields.Integer,
    "orderedItems" : fields.String,
    "total_amount": fields.Float,
    "shipping_add": fields.String,
    "mobile_no": fields.String,
    "status": fields.String,
    "payment_status":fields.Boolean,
}

@app.get('/get-orders')
@auth_required('token')
@roles_required('buyer')
def get_orders():
    orders = Orders.query.filter_by(user_id=current_user.id).all()
    if not orders:
        return jsonify({"message":"No orders found. Order now!"}), 404
    return marshal(orders, order_fields)

@app.get('/get-orders-items')
@auth_required('token')
@roles_required('buyer')
def get_orders_items():
    orders = Orders.query.filter_by(user_id=current_user.id).all()
    if not orders:
        return jsonify({"message":"No orders found. Order now!"}), 404
    order_id = []
    items = []
    for order in orders:
        order_id.append(order.id)
        items.append(ast.literal_eval(str(order.orderedItems)))
    dict1 = {}
    for i in range(len(order_id)):
        dict1[order_id[i]] = items[i]
    return jsonify(dict1)

@app.get('/download-csv')
@auth_required('token')
@roles_required('manager')
def download_csv():
    task = create_product_csv.delay()
    return jsonify({"task_id":task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True)
    else:
        return jsonify({"message":"Task is Pending.."}), 404 

@app.get('/manager-summary-1')
@auth_required('token')
@roles_required('manager')
def summary_01():
    categories = Category.query.all()
    cat_list = []
    if not categories:
        return jsonify({"message":"No category found!"}), 404
    for category in categories:
        cat_list.append(category.name)
    cat_product_count = [0 for i in range(len(cat_list))]
    products = Products.query.all()
    if products:
        for i in range(len(cat_list)):
            for product in products: 
                if product.category_name == cat_list[i]:
                   cat_product_count[i]+=1
    font = {'family':'serif','color':'black','size':13}
    plt.figure(figsize=(8,5), dpi=400)
    plt.bar(np.array(cat_list),np.array(cat_product_count), color="green")
    plt.xticks(rotation = 90)
    plt.xlabel("Category Name", fontdict=font)
    plt.ylabel("Number of Products", fontdict=font)
    plt.savefig('./static/images/summary1.jpg' ,bbox_inches='tight')
    return "Summary-01 created"

@app.get('/manager-summary-2')
@auth_required('token')
@roles_required('manager')
def summary_02():
    products = Products.query.all()
    if not products:
        return jsonify({"message":"No products found!"}), 404
    product_list = []
    product_avl_stock = []
    for product in products:
        product_list.append(product.name)
        product_avl_stock.append(product.avl_quantity)
    font = {'family':'serif','color':'black','size':13}
    plt.figure(figsize=(8,5), dpi=400)
    plt.bar(np.array(product_list),np.array(product_avl_stock), color="green")
    plt.xticks(rotation = 90)
    plt.xlabel("Products Name", fontdict=font)
    plt.ylabel("Available Stock", fontdict=font)
    plt.savefig('./static/images/summary2.jpg' ,bbox_inches='tight')
    return "Summary-02 created"

@app.get('/manager-summary-3')
@auth_required('token')
@roles_required('manager')
def summary_03():
    products = Products.query.all()
    if not products:
        return jsonify({"message":"No products found!"}), 404
    product_list = []
    product_sold_stock = []
    for product in products:
        product_list.append(product.name)
        product_sold_stock.append(product.sold_unit)
    font = {'family':'serif','color':'black','size':13}
    plt.figure(figsize=(8,5), dpi=400)
    plt.bar(np.array(product_list),np.array(product_sold_stock), color="#CC7722")
    plt.xticks(rotation = 90)
    plt.xlabel("Products Name", fontdict=font)
    plt.ylabel("Sold Stock", fontdict=font)
    plt.savefig('./static/images/summary3.jpg' ,bbox_inches='tight')
    return "Summary-03 created"
