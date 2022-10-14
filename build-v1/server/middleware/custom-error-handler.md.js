/**
 * Middleware for Custom error Handling.
 * @param {*} error
 * @param {*} _request
 * @param {*} response
 * @param {*} _next
 */
const CustomErrorHandler = (error, _request, response, _next) => {
    const errorStatus = error.statusCode || 500;
    const errorMessage = error.message || 'Oops! Something went wrong.';
    response.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : '',
    });
};

export default CustomErrorHandler;
