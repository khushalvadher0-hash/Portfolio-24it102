const EventEmitter = require('events');

// Practical 10: Asynchronous Processing with Event-Driven Architecture
// Create a shared EventEmitter instance for decoupled task event management
class TaskEvents extends EventEmitter {}

const taskEvents = new TaskEvents();

module.exports = taskEvents;
