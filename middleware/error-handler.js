const { Base } = require('../exceptions');

module.exports = (error, request, response, next) => {
    const { code, message } = handleError(error);

    response.status(code).send({ message });
};

function handleError(error) {
    if (error.name === 'ValidationError') {
        return { code: 422, message: error.message };
    }

    if (error instanceof Base) {
        return error;
    }

    console.error(error);

    return { code: 500, message: 'Oops! Something went wrong!' };
}
