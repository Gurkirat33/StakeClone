export const apiError = (statusCode, message, errorDetails) => {
  return {
    success: false,
    statusCode,
    message,
    errorDetails,
  };
};
