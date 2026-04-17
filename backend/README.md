# Express.js MySQL Auth API

A modular monolith Express.js application with MySQL2 and JWT authentication.

## Features

- User authentication with JWT (JSON Web Tokens)
- Password hashing with bcrypt
- MySQL database with mysql2 (no ORM)
- Modular monolith architecture
- Input validation with express-validator
- Error handling middleware
- CORS and security headers with Helmet

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   ├── database/            # Database connection and initialization
│   │   ├── connection.js    # MySQL connection pool
│   │   └── init.js          # Database initialization
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js          # Authentication middleware
│   │   ├── error.js         # Error handling middleware
│   │   └── validation.js    # Validation middleware
│   ├── modules/             # Feature modules
│   │   └── user/
│   │       ├── controllers/ # User controllers
│   │       ├── routes/      # User routes
│   │       └── services/    # User business logic
│   ├── utils/               # Utility functions
│   │   └── auth.js          # JWT and bcrypt utilities
│   └── index.js             # Application entry point
├── .env.example             # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Configure your environment variables in `.env`:
```
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=express_auth
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
```

5. Make sure MySQL is running and create the database:
```sql
CREATE DATABASE express_auth;
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication

#### Register
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### User Routes (Protected)

All user routes (except register and login) require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Get All Users
```http
GET /api/users?page=1&limit=10
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "role": "admin"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Technologies Used

- **Express.js** - Web framework
- **MySQL2** - MySQL database connector
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-Origin Resource Sharing

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention (parameterized queries)
- Security headers with Helmet
- CORS configuration
- Input validation

## Error Handling

The API uses a standardized error response format:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## License

ISC