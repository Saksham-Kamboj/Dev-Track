# DevTrack Server

Backend API for DevTrack - A team productivity and task-tracking dashboard for software development teams.

## Features

- JWT-based authentication
- Role-based access control (Admin/Developer)
- Task CRUD operations
- Admin dashboard with statistics
- Developer management
- MongoDB integration

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.example` to `.env` and update the values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/devtrack
JWT_SECRET=your_jwt_secret_key_here
```

3. Make sure MongoDB is running on your system

4. Start the server:
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## Default Admin Account

When the server starts for the first time, it creates a default admin account:
- Email: `admin@devtrack.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)

### Admin Routes (requires admin role)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/developer` - Create new developer account
- `GET /api/admin/developers` - Get all developers
- `GET /api/admin/tasks` - Get all tasks from all developers

### Task Routes (requires authentication)
- `POST /api/tasks` - Create new task
- `GET /api/tasks` - Get user's tasks
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## API Usage Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@devtrack.com", "password": "admin123"}'
```

### Create Developer (Admin only)
```bash
curl -X POST http://localhost:5000/api/admin/developer \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Create Task (Developer)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Fix bug", "description": "Fix login issue", "status": "pending"}'
```

## Project Structure

```
src/
├── controllers/        # Route handlers
│   ├── authController.js
│   ├── adminController.js
│   └── taskController.js
├── middlewares/        # Custom middleware
│   └── auth.js
├── models/            # Database models
│   ├── User.js
│   └── Task.js
├── routes/            # Route definitions
│   ├── auth.js
│   ├── admin.js
│   └── tasks.js
├── database/          # Database connection
│   └── connection.js
├── utils/             # Utility functions
│   └── seeder.js
└── index.js           # Main server file
```

## Error Handling

The API returns consistent error responses:
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
