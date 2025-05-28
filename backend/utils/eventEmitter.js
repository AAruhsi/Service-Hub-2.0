const EventEmitter = require("events");
const eventEmitter = new EventEmitter();

module.exports = eventEmitter;

//makes it loosely coupled the categories
//helps in Seperartion of Concerns
// Easier unit testing
// Future extension (add new listeners without touching delete logic)
