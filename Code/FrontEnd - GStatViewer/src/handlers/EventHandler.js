export default class EventHandler {
	static list = new Map();
	static subscribe(event, callback) {
		if (!EventHandler.list.has(event)) {
			EventHandler.list.set(event, []);
		}
		EventHandler.list.get(event).push(callback);
		return EventHandler;
	}
	static unsubscribe(event, callback) {
		if (EventHandler.list.has(event)) {
			EventHandler.list.get(event).splice(EventHandler.list.get(event).indexOf(callback), 1);
		}
		return EventHandler;
	}
	static publish(event, ...args) {
		if (EventHandler.list.has(event)) {
			EventHandler.list.get(event).forEach((callback) => callback(...args));
		}
		return EventHandler;
	}
}
