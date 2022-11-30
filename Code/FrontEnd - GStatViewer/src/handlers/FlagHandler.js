import {
  faCheckCircle,
  faExclamationCircle,
  faQuestion,
  faWarning,
  faCalendarXmark,
  faCalendarCheck,
  faUserPlus,
  faUserMinus,
  faPersonCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";

class FlagHandler {
  static getFlag(date, activeTime) {
    let days = parseInt(DateTime.fromISO(date).toRelative({ unit: "days" }));
    let flag = faQuestion;
    let color = "black";
    if (days > activeTime) {
      flag = faCalendarXmark;
      color = "red";
    } else if (days > activeTime - 2) {
      flag = faWarning;
      color = "MediumVioletRed";
    } else if (days >= 0) {
      flag = faCalendarCheck;
      color = "green";
    }
    return <FontAwesomeIcon icon={flag} color={color} />;
  }
  static getActiveType(date, activeTime) {
    let days = parseInt(DateTime.fromISO(date).toRelative({ unit: "days" }));
    let type = "whatRepoIcon";
    if (days > activeTime) {
      type = "inActiveRepoIcon";
    } else if (days > activeTime - 2) {
      type = "semiActiveRepoIcon";
    } else if (days >= 0) {
      type = "activeRepoIcon";
    }
    return type;
  }
  static getUserIcon(status) {
    let flag = faPersonCircleQuestion;
    if (status === "login") {
      flag = faUserPlus;
    } else if (status === "logout") {
      flag = faUserMinus;
    }
    return <FontAwesomeIcon icon={flag} size="lg" />;
  }
  static getStatus(status) {
    let flag, color;
    if (status === 200) {
      flag = faCheckCircle;
      color = "green";
    } else {
      flag = faExclamationCircle;
      color = "red";
    }
    return <FontAwesomeIcon icon={flag} color={color} />;
  }
}
export default FlagHandler;
