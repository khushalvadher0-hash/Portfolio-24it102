const NodeCache = require('node-cache');

// Practical 9: In-Memory Caching using node-cache
// stdTTL: 60 seconds (data expires after 60s of inactivity/storage)
// checkperiod: 120 seconds (automatic background cleanup of expired keys)
// useClones: true (prevents mutation of cached objects outside cache)
const cache = new NodeCache({
    stdTTL: 60,
    checkperiod: 120,
    useClones: true
});

// Cache hit and miss counters
const stats = {
    hits: 0,
    misses: 0
};

// Key generation helpers to ensure strict per-user isolation
const getTaskListKey = (userId) => `tasks:user:${userId}`;
const getTaskSingleKey = (userId, taskId) => `task:user:${userId}:${taskId}`;

// Record metrics
const recordHit = () => {
    stats.hits += 1;
};

const recordMiss = () => {
    stats.misses += 1;
};

// Invalidation helper: clears user's task list cache and optionally a specific task
const invalidateUserTasks = (userId, taskId = null) => {
    const listKey = getTaskListKey(userId);
    cache.del(listKey);

    if (taskId) {
        const singleKey = getTaskSingleKey(userId, taskId);
        cache.del(singleKey);
    }
};

// Return aggregate cache metrics
const getStats = () => {
    const totalRequests = stats.hits + stats.misses;
    const hitRate = totalRequests > 0 ? `${((stats.hits / totalRequests) * 100).toFixed(2)}%` : '0.00%';
    return {
        hits: stats.hits,
        misses: stats.misses,
        totalRequests,
        hitRate,
        stdTTL: 60,
        keysCount: cache.keys().length
    };
};

module.exports = {
    cache,
    getTaskListKey,
    getTaskSingleKey,
    recordHit,
    recordMiss,
    invalidateUserTasks,
    getStats
};
