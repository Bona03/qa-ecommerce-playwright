# QA Shop - E-Commerce QA Portfolio

A dummy e-commerce application created as a QA Engineering portfolio project.

This project demonstrates practical QA testing across the application, API, and database layers, with selected UI test scenarios planned for automation using Playwright.

---

## Live Demo

**Frontend:**  
https://qa-ecommerce-playwright.vercel.app/app/index.html

**API:**  
https://qa-ecommerce-playwright.vercel.app/api/products

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

The application consists of a frontend, backend API, and PostgreSQL database.

---

## Tech Stack

### Application

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- PostgreSQL
- Neon PostgreSQL
- Vercel

### Testing

- Manual Testing
- API Testing
- Database Testing
- UI Automation with Playwright

### Tools

- Visual Studio Code
- Git
- GitHub
- Vercel
- Neon
- Browser Developer Tools

---

## Application Architecture

### Production

```text
Frontend
    |
    v
Vercel
    |
    v
Express API
    |
    v
Neon PostgreSQL
```

### Local Development

```text
Frontend :3000
    |
    v
Backend API :3001
    |
    v
Neon PostgreSQL
```

---

## Database Relationships

```text
Customers
    |
    v
Orders
    |
    +----> Order Items ----> Products
    |
    +----> Payments
```

---

## Project Structure

```text
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
├── api/
│   └── index.js
│
├── backend/
│   └── server.js
│
├── database/
│   ├── init.js
│   ├── seed.js
│   └── check.js
│
├── .gitignore
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

---

## Testing Scope

The project covers testing at multiple levels.

### Manual Testing

Manual Testing focuses on functional behaviour and user flows, including:

- Product listing
- Shopping cart
- Product quantity
- Checkout validation
- Payment scenarios
- Order creation
- Order confirmation

### API Testing

API Testing covers:

- Product retrieval
- Product detail
- Order creation
- Order validation
- Multiple product orders
- Stock validation
- Order detail
- Payment information

### Database Testing

Database testing validates:

- Customer and order relationships
- Order and order item relationships
- Product stock changes
- Payment orders
- Order totals
- Data consistency across related tables

### UI Automation

Selected critical, repeatable and predictable test scenarios will be automated using Playwright.

The automation scope is intentionally limited to important business flows rather than automating every manual test case.

---

## API Endpoints

### Get Products

```http
GET /api/products
```

Returns the available products.

### Get Product Detail

```http
GET /api/products/:id
```

Returns details for a specific product.

### Create Order

```http
POST /api/orders
```

Creates a new order and payment records.

Example:

```json
{
    "customer_name": "bona",
    "customer_email": "bona@gmail.com",
    "items": [
        {
            "product_id": 1,
            "quantity": 2
        }
    ],
    "payment_method": "TEST_PAYMENT_VALID"
}
```

### Get Order Detail

```http
GET /api/orders/:id
```

Returns order, customer, product, and payment information.

---

## How to Run the Application

### 1. Install Dependencies

From the project root:

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
```

### 3. Start Backend

```bash
node backend/server.js
```

Backend access:

```text
http://localhost:3001
```

### 4. Start Frontend

Open another terminal:

```bash
cd app
npx http-server -p 3000
```

Frontend access:

```text
http://localhost:3000
```

---

## Database

The production application uses PostgreSQL hosted on Neon.

Main tables:

- customers
- products
- orders
- order_items
- payments

---

## QA Testing Approach

The overall testing workflow follows:

```text
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
Defect Identification
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
```

---

## Defect Testing

The project includes intentionally simulated defect scenarios to demonstrate the defect identification and reporting process.

Defects are evaluated based on:

- Severity
- Priority
- Expected Result
- Actual Result
- Steps to Reproduce
- Impact

---

## Project Status

| Area | Status |
|---|---|
| Application Development | Completed |
| Frontend Testing | Completed |
| API Testing | Completed |
| Database Testing | Completed |
| Production Deployment | Completed |
| UI Automation | In Progress |

---

## Purpose

This project is designed as a QA Engineering portfolio to demonstrate practical experience in:

- Functional Testing
- Test Case Design
- API Testing
- Database Testing
- SQL Validation
- Defect Identification
- E2E Testing
- UI Automation
- Git & GitHub
- Production Deployment

---

## Author

Bona Juliana Simanullang
