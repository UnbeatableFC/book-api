📚 Book Manager RESTful API

A robust RESTful API built with Node.js and Express, implementing JWT-based Authentication with a Token Refresh mechanism to protect core resources. Access to the books data is strictly restricted to authenticated users.

✨ Architectural Features

JWT Authentication: Secure user registration, login, and resource access.

Token Refresh & Rotation: Uses short-lived Access Tokens (15m) for security and long-lived Refresh Tokens (7d) for convenience, with rotation enabled to prevent token reuse.

Protected Routes: All book endpoints (/api/books) are protected by the authenticateToken middleware.

Professional Error Handling: Uses notFound and errorHandler middleware to return standardized JSON error responses (401, 403, 404, 500) instead of default HTML pages.

Security: Passwords are hashed using bcrypt; database connections are handled using environment variables.

🛠️ Prerequisites

Node.js (LTS version recommended)

npm or yarn

MongoDB Atlas or local MongoDB instance.

🚀 Installation & Setup

1. Install Dependencies

You need the following packages: express, mongoose, jsonwebtoken, bcrypt, cors, dotenv, and express-rate-limit.

npm install express mongoose jsonwebtoken bcrypt cors dotenv express-rate-limit


2. Configure Environment

Create a file named .env in the root directory and define your variables.

Variable

Description

PORT

The port the server will run on (e.g., 5000).

ATLAS_URI

Your MongoDB connection string.

ACCESS_TOKEN_SECRET

Long, complex secret for Access Tokens (expires in 15m).

REFRESH_TOKEN_SECRET

Long, complex secret for Refresh Tokens (expires in 7d).

3. Run the Server

npm run dev


The server will connect to MongoDB and start listening on the configured port.

🔑 API Endpoints & Authentication Flow

Accessing book data requires a successful two-step authentication process.

Step 1: User Authentication (Public Routes)

Endpoint

Method

Description

Body Fields

/api/auth/signup

POST

Registers a new user.

username, email, password

/api/auth/login

POST

Authenticates user and returns accessToken and refreshToken.

email, password

Authentication Response Example:

{
  "message": "Log In Successful", 
  "accessToken": "eyJ...", // Use this for protected resources (15m life)
  "refreshToken": "eyJ..."  // Use this for refreshing (7d life)
}


Step 2: Refreshing the Token

Endpoint

Method

Description

Body Fields

/api/auth/refresh

POST

Exchanges an unexpired refreshToken for a new accessToken and a new refreshToken (token rotation).

refreshToken (string)

Step 3: Accessing Protected Resources

All routes under /api/books require a valid, non-expired Access Token.

Request Requirement: The client must send the accessToken in the request header:

Header Key

Header Value Format

Authorization

Bearer <ACCESS_TOKEN_STRING>

Endpoint

Method

Description

Authentication

/api/books

GET

Retrieves a mock list of books.

Required

/api/books

POST

Creates a new book entry, associating it with the authenticated user (req.user.id).

Required

Response Codes

The API utilizes standard HTTP status codes for responses:

200 OK: Success (Login, Get Data, Refresh)

201 Created: Resource created (Signup, Create Book)

401 Unauthorized: Missing token or invalid credentials (Login failed).

403 Forbidden: Token is expired, invalid signature, or refresh token mismatch.

404 Not Found: Route does not exist.

409 Conflict: User already exists (Signup).

500 Internal Server Error: Unexpected server error.