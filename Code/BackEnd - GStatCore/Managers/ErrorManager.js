class ErrorManager {
  static errorList = {
    400: "System Failure : Bad Request",
    401: "System Failure : Unauthorized",
    403: "System Failure : Forbidden / API Rate Limited",
    404: "System Failure : Not Found",
    405: "System Failure : Method Not Allowed",
    406: "System Failure : Not Acceptable",
    409: "System Failure : Conflict",
    410: "System Failure : Gone",
    411: "System Failure : Length Required",
    412: "System Failure : Precondition Failed",
    413: "System Failure : Payload Too Large",
    415: "System Failure : Unsupported Media Type",
    422: "System Failure : Unprocessable Entity",
    429: "System Failure : Too Many Requests",
    500: "System Failure : Internal Server Error",
    501: "System Failure : Not Implemented",
    502: "System Failure : Bad Gateway",
    503: "System Failure : Service Unavailable",
    504: "System Failure : Gateway Timeout",
  };

  static getErrorMessage(error, fallbackMessage) {
    if (this.errorList.hasOwnProperty(error?.status)) {
      return this.errorList[error.status];
    }
    return fallbackMessage;
  }
}
module.exports = ErrorManager;
