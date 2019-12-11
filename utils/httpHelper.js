const request = require('request');

const errorCodes = {
    401: {statusCode: 401, error: 'Unauthorised', message: 'You are not authorised to perform this operation'},
    404: {statusCode: 404, error: 'Not Found', message: 'Not Found'},
    405: {statusCode: 405, error: 'Method Not Allowed', message: 'An invalid operation occurred'},
    500: {statusCode: 500, error: 'Internal Server Error', message: 'An internal server error occurred'},
};
module.exports = {
    getRequest: function (url) {
        return new Promise(function (resolve, reject) {
            request.get({
                url: url,
            }, function (err, res, body) {

                if (err) reject(err);
                body = JSON.parse(body);
                resolve(body);
            })
        })
    },
    request: function (option) {
        return new Promise(function (resolve, reject) {
            request(option, function (err, res, body) {
                if (err) reject(err);
                resolve(body);
            })
        })
    }
};