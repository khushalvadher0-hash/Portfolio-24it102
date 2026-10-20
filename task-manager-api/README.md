# Practical 6: Full Stack Integration (React + Node.js + MongoDB)

## 1. Project Overview
This project integrates the React frontend portfolio (Portfolio-24IT102) with the Express and MongoDB Task Manager REST API (	ask-manager-api), providing full CRUD functionality, real-time feedback with toasts, loading states, error handling, and persistent data storage.

## 2. Directory Structure
- **Backend**: C:\Users\ASUS\Desktop\task-manager-api`n- **Frontend**: C:\Users\ASUS\Desktop\Portfolio-24IT102`n
## 3. How to Run Both Servers

### Terminal 1 - Backend (Port 5000)
`ash
cd C:\Users\ASUS\Desktop\task-manager-api
npm start
``n
### Terminal 2 - Frontend (Port 5173)
`ash
cd C:\Users\ASUS\Desktop\Portfolio-24IT102
npm run dev
``n
## 4. API Endpoints & CORS Configuration
- **GET /tasks**: Retrieve tasks from MongoDB
- **GET /tasks/:id**: Retrieve a single task by ObjectId
- **POST /tasks**: Create a new task
- **PUT /tasks/:id**: Update task (completed, title, description, priority)
- **DELETE /tasks/:id**: Delete task by ObjectId

CORS is enabled for origin http://localhost:5173 via Express middleware.

## 5. Viva Preparation (Q&A)
1. **What is full-stack integration?** Connecting the user interface (React) with server-side logic (Express) and database persistence (MongoDB).
2. **What does CORS do?** Cross-Origin Resource Sharing prevents unauthorized domains from accessing API resources while allowing whitelisted origins like http://localhost:5173.
3. **Why check response.ok?** etch() only rejects on network failures, not on HTTP 4xx or 5xx status codes. Checking esponse.ok allows handling API validation and server errors gracefully.
4. **Why synchronize UI state?** Ensures the React interface matches actual database records after POST, PUT, or DELETE operations.
5. **Why does MongoDB data persist?** MongoDB writes records to non-volatile disk storage, ensuring tasks are retained after server restarts or page refreshes.