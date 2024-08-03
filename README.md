# REST API SERVER BOUTIQUE APPLE

> REST API for the Boutique Apple e-commerce platform, including client and admin interfaces.

## Introduction

This project consists of a complete e-commerce solution with a REST API backend and separate client and admin interfaces. The system uses HTTP requests with RESTful methods like GET, POST, PUT, and DELETE for resource management. Error handling is managed with clear status codes and messages.

## Tech Stack

- **Backend:** NodeJS, ExpressJS
- **Database:** MongoDB
- **Session Management:** Express-Session
- **Real-time Communication:** Socket.io
- **File Uploads:** Multer
- **Code Quality Tools:** Husky, Prettier, ESLint
- **Deployment:** Vercel

## Project Structure

1. **Server:** NodeJS backend running on Port 5000.
2. **Client App:** ReactJS frontend for user interactions running on Port 3000.
3. **Admin App:** ReactJS frontend for administrative tasks running on Port 3001.

## API Endpoints

### Base URL

`/api/v2/`

### Routes

| Header Routes | GET        | POST | PUT    | DELETE |
| ------------- | ---------- | ---- | ------ | ------ |
| products      | `/`, `/:id` | `/`  | `/:id` | `/:id` |
| auth          | `/`, `/:id` |      | `/:id` | `/:id` |
| admin         |            |      |        |        |
| message       | `/`, `/:id` | `/`  | `/:id` | `/:id` |

## Features

- **User Authentication:** Secure login and registration with password encryption.
- **Home Page Data:** Display data dynamically fetched from the API.
- **Order Management:** Users can place orders, with order details saved and displayed.
- **Email Confirmation:** Automatic email sent to users upon order creation using Nodemailer.
- **Admin Management:** Admins can manage product data and view analytics.
- **Photo Upload:** Support for uploading images to the server.
- **Livechat:** Real-time chat functionality between customers and consultants using Socket.io.
- **Deployment:** Instructions for deploying the application.

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Git
- Node.js
- npm (or yarn)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Set up MongoDB database:

   ```bash
   node seeder -i  # Create database
   node seeder -d  # Delete database (if needed)
   ```

4. Run the project:

   ```bash
   yarn dev
   ```

### Running the Project

- **Server:** Port 5000
- **Client App:** Port 3000
- **Admin App:** Port 3001

## Deployment

For deploying the client and admin applications, follow the instructions provided in previous coursework. For deploying the backend server, refer to Vercel deployment guides and ensure MongoDB is properly connected.

## Project Summary

#### Overview

This project involves developing a complete e-commerce website with three main components:

1. **Server (Backend):** NodeJS with ExpressJS, running on Port 5000.
2. **Client App (Frontend for users):** ReactJS, running on Port 3000.
3. **Admin App (Frontend for administrators):** ReactJS, running on Port 3001.

#### 1. Create Components

- **Server:** Handles data-related operations and storage using MongoDB.
- **Client App:** User interface for viewing products, placing orders, and managing accounts.
- **Admin App:** Admin interface for managing products, orders, and users.

#### 2. Create Database Models

- **User:** Represents user data, including account information and access rights.
- **Product:** Represents product data, including description, price, and images.
- **Order:** Represents order data, including customer information, products, and order status.
- **Session:** Represents chat session data with users, if using chat functionality.

#### 3. (Client) Account Authentication

- Hash passwords during registration and verify passwords during login.
- Use cookies to store login information and validate actions that require access rights.

#### 4. (Client) View Homepage Information

- Create APIs to fetch data for the homepage and display featured products and related information.

#### 5. (Client) View Specific Product Information

- Fetch detailed information of individual products based on ID and display it on the interface.

#### 6. (Client) Order Placement Functionality

- Create APIs to save order information when users place orders and notify users of the result.

#### 7. (Client) Send Order Confirmation Email

- Send an order confirmation email to the customer with details about the order using Nodemailer.

#### 8. (Client) View Placed Orders

- Create an interface for users to view a list of their orders and their statuses.

#### 9. (Admin) Access Control

- Define user roles: Customer, Consultant, and Admin.
- Add a `role` field in the `User` model to manage roles and check access rights.

#### 10. (Admin) View Product List

- Display a list of products and search functionality in the Admin interface.

#### 11. Deploy the Product

- Deploy the entire application online, including Client, Admin, and Server components.
- Set up an online MongoDB database and update code paths accordingly.

#### 12. (Advanced) (Admin + Client) Live Chat Functionality

- Implement real-time chat between customers and consultants using Socket.io.
- Manage chat rooms and send/receive messages per room.

#### 13. (Advanced) (Admin) Create Admin Dashboard

- Build an Admin Dashboard with key business information and recent order lists.

#### 14. (Advanced) (Admin) Add New Product

- Provide an interface to add new products, including data validation and image upload.

#### 15. (Advanced) (Admin) Edit and Delete Products

- Provide functionality to update and delete products, including interface and backend data handling.

#### 16. (Advanced) Manage Product Inventory

- Add a `stock` field to the `Product` model to manage inventory levels and update quantities when orders are placed.
