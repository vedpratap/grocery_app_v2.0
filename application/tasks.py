#----------------Defining all the batch/backend jobs--------------

from celery import shared_task
from .models import db, Products, Orders, User
import flask_excel as excel
from .mailservice import send_message
from flask_security import current_user
from jinja2 import Template
from sqlalchemy import desc
import datetime
from dateutil import parser
import ast

@shared_task(ignore_result=False)
def create_product_csv():
    csv_output = excel.make_response_from_a_table(db.session,Products, file_type="csv", status=200, filename="allproducts.csv")
    filename = "allproducts.csv"
    with open(filename, 'wb') as f:
        f.write(csv_output.data)
    return filename

#----Daily mail--------
daily_template = "Hey,{{name}}<br><br>Thanks so much for joining us at our grocery store! We’re excited to have you join our family, and we think you’ll really love our products and their quality. If you haven’t already, make sure to visit once and check out. <br><br>Don’t hesitate to drop us a line if you have any questions or need any help. We’re open from 09:00 AM to 09:00 PM, and you can reach us <cite>grocery_store_info@business.com</cite>. And don’t forget to look at our FAQ page if you need help outside of our regular business hours.<br><br>Thanks again and happy to have you!<br><br>Best Wishes,<br>Ved Grocery Store"

@shared_task(ignore_result=True)
def daily_reminder_project(to, subject):
    users = User.query.all()
    for user in users:
       if user.roles[0].name=='buyer':
            orders = db.session.query(Orders).filter_by(user_id = user.id).order_by(desc(Orders.timestamp)).all()
            if len(orders) == 0:
                    template = Template(daily_template)
                    send_message(user.email, subject, template.render(name=user.fullname))
            else:
                if (datetime.datetime.now()-parser.parse(orders[0].timestamp)).days > 0:
                    template = Template(daily_template)
                    send_message(user.email, subject, template.render(name=user.fullname))
    return "Daily reminder send."


#-----Monthly mail---------------------

monthly_template1 = 'Dear,{{name}}<br><br><b style="color:red;">You have not made any order last month! Please visit and make order.</b><br><br>Best Wishes,<br>Ved Grocery Store'
monthly_template2 = """
Dear,{{name}}<br><br>
<h3>Your orders detail</h3>
<div>
<table class="table">
    <thead>
        <tr>
        <th scope="col">Order ID</th>
        <th scope="col">Timestamp</th>
        <th scope="col">Total Amount</th>
        </tr>
    </thead>
    <tbody>
    {% for order in orders: %}
        <tr>
        <td>{{order.id}}</td>
        <td>{{order.timestamp}}</td>
        <td>{{order.total_amount}}</td>
        </tr>
    {% endfor %}
    </tbody>
</table>
</div>
<p><b>Total_expenditure : </b>{{total_expand}}</p>
<small class="text-muted">Go to Orders tab on our web site for more details.</small><br><br>
Best Wishes,<br>
Ved's Grocery Store
"""

@shared_task(ignore_result=True)
def monthly_report_project(to, subject):
    users = User.query.all()
    for user in users:
       if user.roles[0].name=='buyer':
            orders = Orders.query.filter_by(user_id=user.id).all()
            if len(orders) == 0:
                    template = Template(monthly_template1)
                    send_message(user.email, subject, template.render(name=user.fullname))
            else:
                total_expand = 0
                for order in orders:
                    total_expand += float(order.total_amount)
                template = Template(monthly_template2)
                send_message(user.email, subject, template.render(name=user.fullname, orders=orders, total_expand=total_expand))
    return "Monthly report send!"