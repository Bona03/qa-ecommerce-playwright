# QA Shop - E-Commerce QA Portfolio

A dummy e-commerce application created as a QA Engineering portfolio project.

This project demonstrates practical QA testing across the application, API, and database layers, with selected UI test scenarios planned for automation using Playwright.

---

## Project Overview

QA Shop is a simple e-commerce application that allows users to:

- View available products
- Add products to the shopping cart
- Manage product quantities
- Remove products from the cart
- Proceed to checkout
- Enter customer information
- Select a payment method
- Place an order
- View order confirmation

The application consists of a frontend, backend API, and SQLite database.

---

## Tech Stack

### Application

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- SQLite

### Testing

- Manual Testing
- API Testing
- Database Testing
- UI Automation with Playwright

### Tools

- Visual Studio Code
- Git
- GitHub
- Browser Developer Tools

---

## Application Architecture

```text
QA Shop
   |
   +-------------------+
   |                   |
Frontend             Backend API
:3000                  :3001
   |                   |
   +-------- HTTP -----+
                       |
                    SQLite
                    Database


## Database Relationships
Customers
    |
    v
Orders
    |
    +----> Order Items ----> Products
    |
    +----> Payments


## Project Structure
qa-ecommerce-playwright/
│
├── app/
│   ├── index.html
│   ├── script.js
│   ├── checkout.html
│   ├── checkout.js
│   ├── confirmation.html
│   ├── confirmation.js
│   └── style.css
│
├── backend/
│   └── server.js
│
├── database/
│   ├── ecommerce.db
│   ├── init.js
│   ├── seed.js
│   └── check.js
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

----------------------------------------------------------
##Testing Scope
The project covers testing at multiple levels 

Manual Testing 
Manual Testing focuses on functional behaviour and user flows, including :
- Product listing 
- Shopping cart
- Product Quantity
- Checkout Validation
- Payment scenarios 
- Order creation
- Order confirmation

API Testing 
API Testing covers :
- Product retrieval
- Product detail
- Order creation 
- Order validation 
- Multiple product orders 
- Stock validation 
- Order detail 
- Payment information 

Database Testing 
Database testing validates :
- Customer and order relationships
- Order and order item relationships 
- Product stock changes 
- Payment orders 
- Orders totals
- Data consistency across related tables 

UI Automation 
Selected critical, repeatable and predictable test scenarios  will be automated using Playwright 

The automation scope is intentionally limited to important business flow rather than automating every manual test case.

API Endpoints

Get Products 
</>http
GET /api/products
Returns the available products 

Get Product Detail 
</>http
GET /api/products/:id 
Returns details for a specific product

Create Order 
</>http
POST /api/orders
Creates a new order and payment records
ex :
</>json 
{
    "customer_name": "bona",
    "customer_email": "bona@gmail.com"
    "items":[
        {
            "product_id": 1,
            "quantity":2
        }
    ],
    "payment_method": "TEST_PAYMENT_VALID"
}


Get Order Detail
</>http
GET /api/orders/:id
Returns order, customer, product, and payment information


-----------------------------------------------------------
###How to Run the Application 
1. Install Dependencies 
From the project root: npm install

2. Start Backend 
with command : node backend/server.js
Backend access : http://localhost:3001

3. Start Frontend 
Open another terminal :
cd app
npx http-server -p 3000

---------------------------------------------------------

###Database 
The application uses SQLite 
Database :
database/ecommerce.db
Main table :
- customers
- products 
- orders 
- order_items
- payments 

---------------------------------------------------------
###QA Testing Approach 
The overall testing workflow follows :

Requirements 
    |
    v
Acceptance Criteria
    |
    v
Manual Test Cases
    |   
    v
Application Development 
    |
    v
Manual Testing 
    |
    v
Defect Indentification
    |
    v
API Testing 
    |
    v
Database Testing 
    |
    v
UI Automation
    |
    v
Test Execution & Reporting

-----------------------------------------------------------
###Defect Testing
The project includes intentionally simulated defect scenarios to demonstrate the defect identification and reporting process.

Defects are evaluated based on ;
- Severity
- Priority
- Expected Result 
- Actual Result 
- Step reproduce
- Impact 

-----------------------------------------------------------
###Project Status
Area                   |  Status 
____________________________________________
Application Dev         | Completed 
Frontend Testing        | Completed
API Testing             | Completed 
Database Testing        | Completed
UI Automation           | Inprogress

---------------------------------------------------------

###Purpose 
This project is designed as a QA Engineering portofolio demonstartate practical experience :
- Functional Testing 
- Test Case Design 
- API Testing 
- Database Testing 
- SQL Validation 
- Defect Identification
- E2E Testing 
- UI Automation 
- GIT & GITHUB

-----------------------------------------------------------

###Author 
Bona Juliana Simanullang

