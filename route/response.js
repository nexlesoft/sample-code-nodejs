/**
 * Created by A on 7/18/17.
 */
'use strict';

const Logger = require('../utils/logging');
const Error = require('../config/error');
const DB = require('../config/database').DB;

const setResponse = function (lg, {statusCode, obj, message = ''}) {
    const response = {
        success: (statusCode === 200),
        statusCode: statusCode,
        message: message,
        data: obj
    };

    if (obj) {
        if (obj && typeof obj.message === "string") {
            response.message = obj.message;
        } else if (obj && obj.data && typeof obj.data.message === "string") {
            response.message = obj.data.message;
        }

        if (obj.data && obj.data.response) {
            response.data = obj.data.response;
        } else if (obj.response) {
            response.data = obj.response;
        } else if (obj.data) {
            response.data = obj.data;
        }

        if (!response.success) {
            const error = new Error(lg).getError(statusCode)
            if (error != null) {
                response.statusCode = error.success == true ? 200 : error.statusCode;
                response.message = error.message;
                response.success = error.success;
            }
        }
    }

    return response;
};

const getUser = function (credentials) {
    return new Promise((resolve, reject) => {
        if (credentials.xmppId == 'noLogin' && credentials.scope.length == 1 && credentials.scope[0] == 'noLogin') {
            return resolve({haveUser: null, user: null});
        } else if (credentials.xmppId) {
            DB('tig_users').where('user_id', credentials.xmppId).then(data => {
                if (data.length == 0 || (data.length > 0 && credentials.xmppId != data[0].user_id)) {
                    return reject({statusCode: 501, obj: {xmppId: credentials.xmppId}});
                }
                return resolve({haveUser: true, user: data[0]});
            }).catch(data => {
                return reject({statusCode: 300, obj: {}});
            })
        }
        else {
            return resolve({haveUser: null, user: null});
        }
    })
}

module.exports = {
    setup: function (manager) {
        return function (request, reply, method) {
            const xmppId = request.auth.credentials == null ? null : request.auth.credentials.xmppId;
            const credentials = request.auth.credentials == null ? {} : request.auth.credentials;
            getUser(credentials).then(data => {
                if (data.haveUser == true) {
                    request.auth.credentials.uid = data.user.uid;
                }
                return manager[method](request);
            }).then((data) => {
                reply(setResponse(request.headers.language || "en", data));
            }).catch(data => {
                reply(setResponse(request.headers.language || "en", data));
            });
        }
    },
};