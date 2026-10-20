# Practical 10: Asynchronous Processing with Event-Driven Architecture

**Subject:** Advanced Web Development Frameworks (ITUE301)  
**Student ID:** 24IT102  
**Framework:** Node.js v18+, Express.js, MongoDB Atlas, Mongoose, Node.js EventEmitter  
**Date:** October 2026  

---

## 1. Objective

The objective of Practical 10 is to implement asynchronous processing and event-driven architecture in the Task Management REST API using Node.js's built-in `EventEmitter` module. This decouples secondary non-critical side effects (such as notifications, logging, or third-party webhooks) from the main request-response lifecycle, guaranteeing that the HTTP response returns immediately without being delayed by slow background operations.

---

## 2. Architecture & Data Flow

```text
HTTP POST /tasks
      │
      ▼
1. Authenticate Request via JWT middleware (req.user.id)
      │
      ▼
2. Validate payload & Save Task to MongoDB Atlas
      │
      ▼
3. Invalidate Practical 9 cache keys (`invalidateUserTasks`)
      │
      ▼
4. Send HTTP 201 Response immediately to client
   (Terminal logs: "[API] Task created; response sent at: <T1>")
      │
      ▼
5. setImmediate() schedules event emission on next tick of event loop
      │
      ▼
6. taskEvents.emit('task-created', newTask)
      │
      ▼
7. Event Listener receives event
   - Terminal logs: "[Notification] Started processing for task: <title>" (<T2>)
   - Sets non-blocking setTimeout (2000ms delay)
      │
      ▼ (2 seconds later)
8. Terminal logs: "[Notification] Completed notification delivery..." (<T3 = T2 + 2s>)
```

---

## 3. Files Created or Modified

| File | Status | Description |
| :--- | :--- | :--- |
| [`task-manager-api/events.js`](file:///c:/Users/ASUS/Desktop/Portfolio-24IT102/task-manager-api/events.js) | **Created** | Instantiates and exports a single shared instance of `EventEmitter` (`taskEvents`). |
| [`task-manager-api/listeners.js`](file:///c:/Users/ASUS/Desktop/Portfolio-24IT102/task-manager-api/listeners.js) | **Created** | Registers event listeners for `task-created` (with simulated 2s async delay), `task-deleted`, and error events (`task-error`, `error`). Loaded once at server startup. |
| [`task-manager-api/server.js`](file:///c:/Users/ASUS/Desktop/Portfolio-24IT102/task-manager-api/server.js) | **Modified** | Imported `events.js` and required `listeners.js` at startup; updated `POST /tasks` and `DELETE /tasks/:id` to emit events via `setImmediate` after sending responses. |
| [`task-manager-api/docs/PRACTICAL_10_EVENT_DRIVEN_ARCHITECTURE.md`](file:///c:/Users/ASUS/Desktop/Portfolio-24IT102/task-manager-api/docs/PRACTICAL_10_EVENT_DRIVEN_ARCHITECTURE.md) | **Created** | Practical documentation, testing instructions, screenshot checklist, and analysis questions. |

---

## 4. Implementation Details

1. **Shared EventEmitter (`events.js`)**:
   - Uses Node.js's native `events` module without third-party dependencies.
   - Singleton pattern ensures the same emitter triggers registered listeners across the app.
2. **Dedicated Listeners Module (`listeners.js`)**:
   - Loaded once in `server.js` before server listen.
   - `task-created`: logs task title, assigned user ID, and timestamps, then uses `setTimeout` with a 2-second delay to simulate an external notification service.
   - `task-deleted`: logs task title, deleted ID, user ID, and deletion timestamp.
   - `task-error` & `error`: catches exceptions inside async listener logic to protect the server process from crashing.
3. **Non-Blocking Guarantee via `setImmediate()`**:
   - Calling `emit()` inside `setImmediate()` defers listener execution until the current event loop iteration completes, ensuring the HTTP `201 Created` or `200 OK` response is flushed to the network before the listener runs.
4. **Compatibility with Practical 9**:
   - Cache invalidation (`invalidateUserTasks`) executes immediately after MongoDB write confirmation, before sending the response or emitting events.

---

## 5. Illustrative Log Output Example

```text
GET /tasks - 2026-10-20T15:20:00.120Z
[API] Task created; response sent at: 2026-10-20T15:20:05.150Z
[Notification] [task-created] Started processing for task: "Complete Practical 10"
[Notification] Task ID: 67151ad8f8b894c259838012
[Notification] Assigned User ID: 6714f3b7f8b894c259838001
[Notification] Task Created At: 2026-10-20T15:20:05.148Z
[Notification] Processing notification in background (simulating 2s delay)...
[Notification] [task-created] Completed notification delivery for task: "Complete Practical 10" at 2026-10-20T15:20:07.152Z
```

---

## 6. Manual Thunder Client Testing Instructions

### Step 1: Start the Backend Server
```bash
cd task-manager-api
npm start
```
*Observe the startup message:* `[TaskEvents] Event listeners registered successfully.`

### Step 2: Login to Obtain JWT Token
- Send `POST` to `http://localhost:5000/login`:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- Copy the `token` from the JSON response.

### Step 3: Create a Task (`POST /tasks`)
- Send `POST` to `http://localhost:5000/tasks` with headers:
  - `Authorization: Bearer <your-jwt-token>`
  - `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "Practical 10 Event Task",
    "description": "Testing asynchronous event decoupling",
    "priority": "high"
  }
  ```
- **Observe:** Thunder Client receives the `201 Created` response immediately (~15-30ms).
- **Inspect Terminal:** Observe `[API] Task created; response sent at: ...`, followed immediately by `[Notification] [task-created] Started processing...`, and exactly 2 seconds later `[Notification] [task-created] Completed notification delivery...`.

### Step 4: Delete the Task (`DELETE /tasks/:id`)
- Send `DELETE` to `http://localhost:5000/tasks/<task-id>` with the `Authorization` header.
- **Observe:** Thunder Client receives `200 OK` with `{ "message": "Task deleted successfully" }`.
- **Inspect Terminal:** Observe `[Notification] [task-deleted] Task removed: "Practical 10 Event Task"`.

### Step 5: Test Unauthorized / Validation Rejection
- Send `POST /tasks` with an empty title `""`.
- Verify the server returns `400 Bad Request` and no `[Notification]` logs are produced.

---

## 7. Screenshot Checklist for Submission

Capture the following genuine screenshots using your local environment:
1. **Thunder Client `POST /tasks`**: Showing `201 Created` status code and JSON response body.
2. **Terminal Log (Creation & API Timestamp)**: Showing `[API] Task created; response sent at:` followed by `[Notification] Started processing`.
3. **Terminal Log (2-Second Delay Completion)**: Showing `[Notification] Completed notification delivery` with timestamp ~2 seconds after start.
4. **Thunder Client `DELETE /tasks/:id`**: Showing `200 OK` response.
5. **Terminal Log (Deletion Event)**: Showing `[Notification] [task-deleted] Task removed`.

---

## 8. Viva & Analysis Questions

### 1. Why does EventEmitter alone not make a listener asynchronous?
In Node.js, `EventEmitter.prototype.emit()` is **synchronous**. When you call `emit()`, it synchronously invokes all registered listener functions in the order they were registered on the same call stack. If a listener contains a heavy synchronous loop, it will block the execution of whatever called `emit()`.

### 2. How does `setImmediate()` help defer notification processing?
`setImmediate()` pushes the callback to the "check" phase of the Node.js event loop. This ensures that the current request handler finishes, the HTTP response headers and body are flushed to the client, and only then is the event emitted and the listener invoked.

### 3. What would happen if notification logic were executed directly inside the POST route before sending the response?
If a 2-second delay or slow external email/SMS API were executed before `res.status(201).json()`, the HTTP client would experience a 2+ second delay, worsening perceived performance, increasing response latency, and potentially causing client timeouts.

### 4. Why is EventEmitter reasonable for this small application?
It is built into the Node.js runtime (zero extra dependencies), provides clean architectural decoupling of concerns, uses negligible memory, and is simple to understand and maintain for single-instance applications.

### 5. Why is EventEmitter not a durable queue for a large production system?
`EventEmitter` stores listeners and queues in volatile Node.js process memory. It does not provide persistence, retries on failure, worker pooling, rate-limiting, acknowledgment mechanisms, or distribution across multiple server instances. For production workloads, durable message brokers like RabbitMQ, Redis BullMQ, or Apache Kafka are used.

### 6. What happens to pending in-memory notifications if the server stops unexpectedly?
Any pending timers (like `setTimeout`) or deferred events in the event loop are completely lost if the Node.js process restarts or crashes.

---

## 9. Limitations & Conclusion

- **In-Memory Volatility:** Events and timers do not survive server restarts.
- **Process-Bound:** Events cannot be dispatched across multiple horizontal server nodes.
- **Conclusion:** Node.js `EventEmitter` combined with `setImmediate` provides an elegant, lightweight, zero-dependency pattern for asynchronous side-effect processing and non-blocking API responses in single-instance Node.js applications.
