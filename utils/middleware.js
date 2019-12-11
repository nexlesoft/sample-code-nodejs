
'use strict';

const AppConfig = require('../config/app');
const DB = require('../config/database').DB;
const sha1 = require('sha1');

const getUser = function (xmppId) {
    return new Promise((resolve, reject) => {
        const user_id_sha1 = sha1(xmppId.toLowerCase());
        return DB('tig_users').where('sha1_user_id', user_id_sha1).then(data => {
            if (data.length === 0) {
                return resolve(null);
            }
            return resolve(data[0]);
        }).catch(data => {
            return reject(data.message);
        })
    })
};

module.exports = {
    jwt: {
        key: AppConfig.jwt.secret,
        verifyOptions: {algorithms: ['HS256']},
        validateFunc: function (request, decodedToken, callback) {
            if (decodedToken != {}) {
                return callback(null, true, decodedToken);
            }
            return callback('error Token', false, decodedToken);

        }
    }
};

