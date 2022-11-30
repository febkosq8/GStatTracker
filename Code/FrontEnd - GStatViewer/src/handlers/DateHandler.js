import { DateTime } from "luxon";
class DateHandler {
	static getTimeAgo(date) {
		return DateTime.fromISO(date).toRelative();
	}
}
export default DateHandler;
