'use strict';
/* eslint-disable dot-location */
const Log = require('../resourceAccess/Log');

const addLog = function (req) {
    let platform = '';
    if (req.payload.isNative){
        platform = "Mobile";
    }
    else {
        platform = "Other";
    }
    return Log.addLog(req.auth.credentials.userId, req.payload.type, req.payload.category, req.payload.message, req.payload.stackTrace, platform);
};

module.exports = {addLog};
