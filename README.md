# REST API SERVER BOUTIQUE

## Introduction

HTTP requests follow RESTful methods such as GET, POST, PUT, and DELETE, which represent retrieving, creating,
updating, and deleting resources. Our system also can handle errors flexibly, with status codes and error messages returned clearly.

## Tech Stack

-   NodeJS & ExpressJS
-   Express-Session
-   MongoDB
-   Socket.io
-   Multer
-   Vercel

## REST API

The REST API to Server-Boutique app is described below.

### Note

| Type                              | Description                                             |
| :-------------------------------- | :------------------------------------------------------ |
| `curl`                            | The command-line tool for making HTTP requests.         |
| `-i`                              | Includes the HTTP headers in the output.                |
| `-H 'Accept: application/json'`   | Specifies an HTTP header to be included in the request. |
| `http://localhost:5000/products/` | The URL to which the HTTP GET request is sent.          |

### Get list of Products

#### Request

`GET /api/products/`

    curl -i -H 'Accept: application/json' https://server-boutique-tau.vercel.app/api/products

### Response

    HTTP/1.1 200 OK
    Date: Thu, 25 Jan 2024 10:00:35 GMT
    Content-Type: application/json; charset=utf-8

    [object, object, ...]

## Quick Start

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

-   Git
-   Node.js
-   npm (Node Package Manager)

**Installation**

Install the project dependencies using npm:

```base
yarn
```

Running the Project

```bash
yarn start:dev
```
