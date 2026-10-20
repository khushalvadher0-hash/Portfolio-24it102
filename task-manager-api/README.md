# Practical 7: JWT Authentication and Middleware Pipeline

## 1. Project Overview
Practical 7 extends the MERN Task Manager with JSON Web Token (JWT) based authentication and custom Express middleware. Each user registers with an email and password (hashed with `bcryptjs`), logs in to receive a signed JWT, and accesses only their own tasks via user-scoped queries.

## 2. Directory Structure
- **Backend API**: `task-manager-api`
  - `models/User.js` - User schema with normalized email & password hash
  - `models/Task.js` - Task schema with Mongoose `user` reference (`ObjectId`)
  - `middleware/auth.js` - JWT verification middleware (`Authorization: Bearer <token>`)
  - `server.js` - Express API with auth & protected CRUD routes
- **Frontend**: `Portfolio-24IT102`
  - `src/api.js` - Centralized fetch helper with token storage, 401 interceptor, and auth calls
  - `src/components/TaskManager.jsx` - UI with Registration, Login, Logout, and User-scoped Task CRUD

## 3. How to Run

### Terminal 1 - Backend (Port 5000)
```bash
cd task-manager-api
npm start
```

### Terminal 2 - Frontend (Port 5173)
```bash
npm run dev
```

## 4. API Endpoints

### Public Endpoints:
- `POST /register`: Accepts `{ email, password }`. Validates, hashes with 10 salt rounds, returns HTTP 201 without password hash.
- `POST /login`: Accepts `{ email, password }`. Compares bcrypt hash, returns JWT token (1h expiration) & user info.

### Protected Endpoints (Requires `Authorization: Bearer <token>`):
- `GET /me`: Returns `{ id, email, createdAt }` for current user.
- `GET /tasks`: Returns tasks belonging solely to authenticated user.
- `GET /tasks/:id`: Returns single task if owned by authenticated user.
- `POST /tasks`: Creates task associated with authenticated user ID.
- `PUT /tasks/:id`: Updates task if owned by user.
- `DELETE /tasks/:id`: Deletes task if owned by user.

## 5. Testing with Postman

1. **Register User 1**:
   - `POST http://localhost:5000/register`
   - Body (raw JSON): `{"email": "user1@example.com", "password": "password123"}`
   - Status: `201 Created`
2. **Login User 1**:
   - `POST http://localhost:5000/login`
   - Body (raw JSON): `{"email": "user1@example.com", "password": "password123"}`
   - Copy the `token` from the JSON response.
3. **Access `/me`**:
   - `GET http://localhost:5000/me`
   - Headers: `Authorization: Bearer <token>`
   - Status: `200 OK`
4. **Create Task**:
   - `POST http://localhost:5000/tasks`
   - Headers: `Authorization: Bearer <token>`
   - Body (raw JSON): `{"title": "User 1 Private Task", "priority": "high"}`
5. **Verify Route Protection & Ownership**:
   - Send `GET /tasks` without token -> Returns `401 Unauthorized`.
   - Register and login as `user2@example.com`.
   - Send `GET /tasks` with User 2's token -> User 1's tasks are NOT returned.
   - Attempt `PUT /tasks/<user1_task_id>` with User 2's token -> Returns `404 Task not found` (protects against ID enumeration).