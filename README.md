# REST API SERVER BOUTIQUE APPLE [Under Renovation]

> The REST API to Server-Boutique app is described below.

## Introduction

HTTP requests follow RESTful methods such as GET, POST, PUT, and DELETE, which represent retrieving, creating,
updating, and deleting resources. Our system also can handle errors flexibly, with status codes and error messages returned clearly.

## Tech Stack

-   NodeJS & ExpressJS
-   Express-Session
-   MongoDB
-   Socket.io
-   Multer
-   Husky/Prettier/ESLint
-   Vercel

### GET/POST/PUT/DELETE

root: `/api/v2/`

| Header Routes | GET        | POST | PUT    | DELETE |
| ------------- | ---------- | ---- | ------ | ------ |
| products      | `/`,`/:id` | `/`  | `/:id` | `/:id` |
| auth          | `/`,`/:id` |      | `/:id` | `/:id` |
| admin         |            |      |        |        |
| message       | `/`,`/:id` | `/`  | `/:id` | `/:id` |

<ul>
    <li>Filter Values: housing=true&averageCost[lte]=100</li>
    <li>Query Properties: select=name&sort=-name</li>
    <li>Limit Items: page=2&limit=10</li>
</ul>

### Description

Project Overview:

-   User authentication
-   Display data on Home Page
-   Users can create orders
-   There is an email sent to the user when creating an order
-   Create Admin page to manage data
-   There is a mechanism to upload photos to the Server
-   Livechat function between customers and consultants
-   Deploy the product

### Get list of Products

## Quick Start

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

-   Git
-   Node.js
-   npm (Node Package Manager)

**Installation**

Install the project dependencies using npm:

```javascript
yarn

// Automated create database of MongoDB
node seeder -i // create
node seeder -d // delete
```

Running the Project

```javascript
yarn dev
```
