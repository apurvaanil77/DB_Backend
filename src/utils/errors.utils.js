class DoesNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "DoesNotExistError";
    this.errorCode = "BS-0404";
    this.status = 404;
  }
}

class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "AlreadyExistError";
    this.errorCode = "BS-0404";
    this.status = 404;
  }
}

class CannotUpdateError extends Error {
  constructor(message) {
    super(message);
    this.name = "CannotUpdateError";
    this.errorCode = "BS-0404";
    this.status = 404;
  }
}

class CannotDeleteError extends Error {
  constructor(message) {
    super(message);
    this.name = "CannotDeleteError";
    this.errorCode = "BS-0404";
    this.status = 404;
  }
}

class LimitExceededError extends Error {
  constructor(message) {
    super(message);
    this.name = "LimitExceededError";
    this.errorCode = "BS-0400";
    this.status = 400;
  }
}

class FileDoesNotExistError extends DoesNotExistError {
  constructor(filePath) {
    super(`File(${filePath}) does not exist.`);
    this.name = "FileDoesNotExistError";
  }
}

class InvalidRequestError extends Error {
  constructor(message) {
    super(message || "Invalid Request");
    this.name = "InvalidRequestError";
    this.errorCode = "BS-0400";
    this.status = 400;
  }
}

class ActiveEntryConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ActiveEntryConflictError";
    this.errorCode = "BS-0400";
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnauthorizedError";
    this.errorCode = "BS-0401";
    this.status = 401;
  }
}
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "InternalServerError";
    this.errorCode = "BS-0500";
    this.status = 500;
  }
}

module.exports = {
  DoesNotExistError,
  CannotUpdateError,
  CannotDeleteError,
  LimitExceededError,
  FileDoesNotExistError,
  InvalidRequestError,
  ActiveEntryConflictError,
  AlreadyExistError,
  UnauthorizedError,
  InternalServerError,
};
