# Grocery app v2.0
## Submitted by : Ved Pratap (21f1000886)

### Steps to run the app
- Download the source code as a zip file and extract it in a folder.
- Create Python virtual enviroment in main folder.
- Activate the virtual environment.
- Install all the packages listed in file `requirements.txt` in the above created virtual environment.
    - Run `pip install -r requirements.txt` in terminal.
    - In addition to above install `numpy`, `matplotlib`
- If database folder is not present first create it.
    - Run `python initial_data.py` in terminal.
- Start `redis-server` in your system (WSL for window user)
    - `sudo service redis-sever start` 
- Start `celery` for batch jobs
    - `pip install eventlet`
    - `celery -A main:celery_app beat --loglevel INFO -P eventlet`
- Install `mailHog` in your system to check email delivery. [click here](https://github.com/mailhog/MailHog) 
- Run `mailHog` in your system
    - `~/go/bin/MailHog`   
    - UI for `mailHog` [click here after running mailHog](http://localhost:8025/)
- Run `celery -A main:celery_app beat --loglevel INFO` for scheduled jobs.
- Run `python main.py` in terminal.
- App will be active at http://127.0.0.1:5000






