export class ErrorHandleClass {
    constructor(message, statusCode, stack, errorPositon, data) {
      this.message = message ? message : "internal server error";
      this.statusCode = statusCode;
      this.stack = stack ;
      this.errorPositon = errorPositon ? errorPositon : "Error";
      this.data = data ? data : null;
    }
  }