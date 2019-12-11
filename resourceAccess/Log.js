'use strict';
/* eslint-disable dot-location */

const DB = require('../config/database').DB;

// add a single logs to logs table
const addLog = (userId, type, category, message, stackTrace, platform) =>
    new Promise((resolve, reject) => {
        return DB.raw(`Call addLogV1(${userId}, '${type}', '${category}', '${message}', '${stackTrace}', '${platform}');`)
            .then(response => resolve({ statusCode: 200, obj: {} }))
            .catch(e => reject({ statusCode: 301, obj: e }));
    });

module.exports = {
    addLog
};
