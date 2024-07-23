export const apiResponse = (statusCode, message, data = {}) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};
