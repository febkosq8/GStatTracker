class DateHandler {
  static getFormattedDate(date) {
    return new Date(date).toISOString().replace(/T.*/g, "");
  }
  static compareDays(date1, date2) {
    return (
      DateHandler.getFormattedDate(date1) ===
      DateHandler.getFormattedDate(date2)
    );
  }
}
module.exports = DateHandler;
