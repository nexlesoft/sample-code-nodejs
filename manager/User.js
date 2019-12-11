'use strict';
const User = require('../resourceAccess/User');

module.exports = {
    login: function (req) {
        return User.login(req.payload);
    },
    getMyDetail: function (req) {
        return User.getDetail(req.auth.credentials.xmppId);
    }
};