# Practical 9: In-Memory Caching and Query Optimization

**Subject:** Advanced Web Development Frameworks (ITUE301)  
**Student ID:** 24IT102  
**Framework:** Node.js, Express.js, MongoDB Atlas, Mongoose, node-cache  
**Date:** October 2026  

---

## 1. Objective

The objective of Practical 9 is to implement in-memory caching using the `node-cache` library in the Task Management REST API to optimize read query latency, reduce repetitive round-trips to MongoDB Atlas, and maintain strict data consistency and security through write-through cache invalidation and per-user cache key isolation.

---

## 2. Architecture & Data Flow

### A. Read Request Flow (`GET /tasks` & `GET /tasks/:id`)
```
Client Request
      │
      ▼
authMiddleware (Validates JWT -> sets req.user.id)
      │
      ▼
Cache Lookup (`cache.has("tasks:user:<id>")`)
      │
 ┌────┴──────────────────────────┐
 │                               │
 ▼ (Cache HIT)                   ▼ (Cache MISS)
recordHit()                      recordMiss()
Retrieve from RAM (node-cache)   Query MongoDB via Mongoose
Set Header `X-Cache: HIT`        Store in node-cache (TTL = 60s)
Return JSON (sub-millisecond)    Set Header `X-Cache: MISS`
                                 Return JSON from Database
```

### B. Write Invalidation Flow (`POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`)
```
Client Write Request (POST/PUT/DELETE)
      │
      ▼
authMiddleware & Validation Checks
      │
      ▼
Execute MongoDB Operation (create / findOneAndUpdate / findOneAndDelete)
      │
      ▼
Write Success?
 ├─► YES: invalidateUserTasks(userId, taskId) -> `cache.del()` removes stale keys
 └─► NO:  Return error response without invalidating
      │
      ▼
Next `GET /tasks` triggers fresh database read (guaranteed fresh data)
```

---

## 3. Implementation Details

1. **Shared Cache Instance (`task-manager-api/utils/cache.js`)**:
   - `stdTTL: 60` — Cached items expire after 60 seconds.
   - `checkperiod: 120` — Automatic background sweep cleans expired keys every 120 seconds.
   - `useClones: true` — Returns cloned copies so outside mutations do not corrupt cache state.
2. **Security & User Isolation**:
   - Keys are explicitly scoped: `tasks:user:<userId>` and `task:user:<userId>:<taskId>`.
   - Never uses a global shared cache key; user A can never see or invalidate user B's cached tasks.
3. **Write Invalidation**:
   - `POST /tasks` -> Invalidates `tasks:user:<userId>`.
   - `PUT /tasks/:id` -> Invalidates `tasks:user:<userId>` and `task:user:<userId>:<taskId>`.
   - `DELETE /tasks/:id` -> Invalidates `tasks:user:<userId>` and `task:user:<userId>:<taskId>`.
4. **Cache Metrics & Debugging**:
   - `GET /cache/stats` exposes aggregate in-memory metrics (`hits`, `misses`, `totalRequests`, `hitRate`, `stdTTL`).
5. **Development Benchmark Support**:
   - Header `X-Bypass-Cache: true` can be passed to bypass cache lookups for controlled before/after timing comparisons.

---

## 4. Response Time Comparison Table

*Use Postman or Thunder Client to record the response times (in ms) under identical local testing conditions and complete the table below:*

| Test Condition | Reading 1 (ms) | Reading 2 (ms) | Reading 3 (ms) | Average (ms) |
| :--- | :---: | :---: | :---: | :---: |
| **Without Caching (Cache MISS / MongoDB Atlas Query)** | — | — | — | — |
| **With Caching (Cache HIT / In-Memory RAM Read)** | — | — | — | — |

### Summary & Percentage Improvement

| Metric | Uncached (Database Read) | Cached (In-Memory Hit) | Improvement (%) |
| :--- | :---: | :---: | :---: |
| **Average Latency** | — ms | — ms | — % |

---

## 5. Step-by-Step Testing Instructions (Postman / Thunder Client)

### Step 1: Start the Backend Server
```bash
cd task-manager-api
npm start
```
*The server will run at `http://localhost:5000`.*

### Step 2: Obtain a Valid JWT Token
- Send a `POST` request to `http://localhost:5000/login` with your credentials:
  ```json
  {
    "email": "user@example.com",
    "password": "yourpassword"
  }
  ```
- Copy the `token` from the response.

### Step 3: Test Uncached Requests (Cache Miss)
- Send `GET` to `http://localhost:5000/tasks` with headers:
  - `Authorization: Bearer <your-jwt-token>`
  - `X-Bypass-Cache: true`
- Inspect the response header: `X-Cache: MISS`.
- Record the response time shown in Postman (Reading 1). Repeat 3 times.

### Step 4: Test Cached Requests (Cache Hit)
- Remove the `X-Bypass-Cache` header.
- Send `GET` to `http://localhost:5000/tasks`:
  - 1st Request: Returns `X-Cache: MISS` (populates the cache).
  - 2nd Request: Returns `X-Cache: HIT` (sub-millisecond in-memory response). Record time.
  - 3rd Request: Returns `X-Cache: HIT`. Record time.

### Step 5: Test Cache Invalidation on Writes
1. Create a task via `POST /tasks` with body `{"title": "Cache Test Task", "priority": "high"}`.
2. Immediately send `GET /tasks` -> observe `X-Cache: MISS`, confirming the stale cache was purged and new data was loaded from MongoDB.
3. Update or delete the task via `PUT /tasks/:id` or `DELETE /tasks/:id` and verify subsequent `GET` requests reflect the change immediately.

### Step 6: Verify Metrics
- Send `GET` to `http://localhost:5000/cache/stats` (no auth required) to view:
  ```json
  {
    "hits": 4,
    "misses": 2,
    "totalRequests": 6,
    "hitRate": "66.67%",
    "stdTTL": 60,
    "keysCount": 1
  }
  ```

---

## 6. Viva & Analysis Questions

### 1. Why must the cache be invalidated after every successful write?
To prevent **stale data** anomalies. When a task is added, updated, or removed, the database changes. If the in-memory cache is not immediately updated or invalidated, subsequent `GET` requests would return outdated information until the TTL expires.

### 2. What happens if invalidation is forgotten?
The client suffers from data inconsistency. A student might mark a task as completed or delete it, but upon refreshing the page, the task list still shows the old status or deleted item, creating severe user confusion.

### 3. Why is 60 seconds a reasonable starting TTL, and what is the trade-off of increasing it?
60 seconds provides a good balance between reducing database queries for frequently accessed data and naturally bounding the lifespan of any orphaned cache keys. Increasing the TTL (e.g. to 1 hour) improves cache hit rates on static data, but increases RAM usage and increases the risk of serving stale data if write invalidation fails.

### 4. Why is `node-cache` unsuitable as the only shared cache in a multi-instance deployment?
`node-cache` stores data in the local Node.js process memory heap. If you run multiple instances behind a load balancer (horizontal scaling), instance A's cache is invisible to instance B. A write to instance A would not invalidate instance B's cache, leading to out-of-sync responses. A distributed cache like Redis is required in multi-instance environments.

### 5. Why might the measured speed improvement be small with a tiny MongoDB dataset?
For tiny datasets, MongoDB Atlas query parsing and transfer time are small (~20–40ms). In contrast, with thousands of documents, network round-trips to remote cloud clusters and complex serialization dominate, making in-memory RAM reads (1–2ms) dramatically faster (up to 95% faster).

### 6. Why must authenticated users have separate cache keys?
Each user owns a private task list. If a single generic key like `all_tasks` were used, the first user to request tasks would have their personal tasks cached and subsequently served to every other authenticated user, causing a critical data privacy and security breach.

---

## 7. Limitations & Conclusion

- **Process-Bound Storage:** Cache lives in RAM and resets when the server restarts or crashes.
- **Single-Node Only:** `node-cache` is designed for single-process Node applications.
- **Conclusion:** `node-cache` is an ideal, lightweight solution for development and single-server deployments, providing rapid in-memory caching without the operational overhead of running a separate Redis server.
