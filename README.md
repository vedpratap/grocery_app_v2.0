# Grocery app v2.0
## Submitted by : 
`Ved Pratap` 

`Roll Number : 21f1000886` 

`Indian Institute of Technology, Madras`

### About App

Grocery Store v2 a multi-user app (one required `admin` and other users [`Store Managers` & `Buyers`]) used for buying and selling products.

### Features

- Login & Logout
- There is only one admin.
    - Email : `admin@gmail.com`
    - Password : `admin` 
- Signup [With role `Store Manager` & `Buyer`]
    -  By default, Only user with role `buyers` will be approved for login where as `Store Managers` will be approved by admin.
- Separate dashboard for `admin`, `store managers` and `buyers`.
- **`Admin`**
    - Dashboard (Users data, Requests from store managers regarding categories/sections)
    - Approve store managers
    - Create categories/sections
    - Edit/Modify existing categories
    - Delete Existing categories
    - Handle request from store managers regarding the CRUD operation with categories with confirmation/rejection message
    - Explore all categories and products
- **`Store Managers`**
    - Dashboard (Products details, Export CSV button)
    - Create products under categories approved by the admin. (A category can have many number of products.)
    - Edit/Modify existing products
    - Delete Existing products
    - Send requests to admin dashboard regarding the CRUD operation with categories with proper reason
- **`Buyers`**
    - Dashboard (Recently added products, All Products)
    - Explore products with their details (Name, Category, Rate, In Stock or not....)
    - Add multiple in stock items to cart
    - Order from cart
    - Orders details (Can download report as PDF)
    - User Profile
- There are filters menu on every pages to filter data on some conditions.
- **`Batch/Scheduled Jobs`**
    - Daily reminders to customers for visiting the website
    - Monthly report to customers with their order details
       

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






