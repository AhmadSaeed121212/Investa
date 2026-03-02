const sendResponse = (res, statusCode, success, message, data = null, errors = null) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    errors,
  });
};

const ok = (res, message = "Success", data = null) => sendResponse(res, 200, true, message, data, null);
const created = (res, message = "Created", data = null) => sendResponse(res, 201, true, message, data, null);
const fail = (res, statusCode = 400, message = "Request failed", errors = null) =>
  sendResponse(res, statusCode, false, message, null, errors);

module.exports = { sendResponse, ok, created, fail };
