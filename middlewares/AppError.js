class AppError extends Error {
  constructor(message, status, error = null) {
    super(message);
    this.status = status;
    this.error = error;
  }
}

export default AppError;