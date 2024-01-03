from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.worker import celery_init_app
import flask_excel as excel
from celery.schedules import crontab
from application.tasks import daily_reminder_project, monthly_report_project
from application.instances import cache

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    excel.init_excel(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import application.views
    return(app)

app = create_app()
celery_app = celery_init_app(app)

@celery_app.on_after_configure.connect
def send_daily_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=12, minute=2),
        daily_reminder_project.s('vedpratap_ds@study.iitm.ac.in', 'Greetings from Ved Grocery store!'),
    )

@celery_app.on_after_configure.connect
def send_monthly_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=12, minute=3),
        monthly_report_project.s('vedpratap_ds_rcv@study.iitm.ac.in', 'Last month details order and expenditure details-Ved Grocery store!'),
    )

if __name__ == '__main__':
    app.run(debug=True)