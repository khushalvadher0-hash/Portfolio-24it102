const taskEvents = require('./events');

// Practical 10: Event Listeners Module
// Registered once during application startup

// 1. Task Created Listener: Decoupled notification with simulated 2-second async delay
taskEvents.on('task-created', (task) => {
    try {
        const startTimestamp = new Date().toISOString();
        console.log(`[Notification] [task-created] Started processing for task: "${task.title}"`);
        console.log(`[Notification] Task ID: ${task.id || task._id}`);
        console.log(`[Notification] Assigned User ID: ${task.user}`);
        console.log(`[Notification] Task Created At: ${task.createdAt || startTimestamp}`);
        console.log(`[Notification] Processing notification in background (simulating 2s delay)...`);

        // Non-blocking timer: simulates slow notification delivery (email, push, webhook)
        setTimeout(() => {
            const completedTimestamp = new Date().toISOString();
            console.log(`[Notification] [task-created] Completed notification delivery for task: "${task.title}" at ${completedTimestamp}`);
        }, 2000);
    } catch (err) {
        taskEvents.emit('task-error', { event: 'task-created', error: err.message });
    }
});

// 2. Task Deleted Listener: Immediate notification log on task deletion
taskEvents.on('task-deleted', (task) => {
    try {
        const deleteTimestamp = new Date().toISOString();
        console.log(`[Notification] [task-deleted] Task removed: "${task.title}"`);
        console.log(`[Notification] Deleted Task ID: ${task.id || task._id}`);
        console.log(`[Notification] Owned by User ID: ${task.user}`);
        console.log(`[Notification] Deletion Timestamp: ${deleteTimestamp}`);
    } catch (err) {
        taskEvents.emit('task-error', { event: 'task-deleted', error: err.message });
    }
});

// 3. Error Event Listener: Safe handling of notification exceptions
taskEvents.on('task-error', (errInfo) => {
    console.error(`[Notification Error] Error in event "${errInfo.event}":`, errInfo.error);
});

// Global EventEmitter error listener to prevent process crashes if 'error' is emitted
taskEvents.on('error', (err) => {
    console.error(`[TaskEvents Global Error]:`, err ? err.message : 'Unknown event error');
});

console.log('[TaskEvents] Event listeners registered successfully.');

module.exports = taskEvents;
