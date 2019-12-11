'use strict';

const path = require('path');
const User = require('../route/User');
const File = require('../route/File');
const Log = require('../route/Log');

module.exports = [
    //file
    {method: 'POST', path: '/files', config: File.upload},

    // user
    {method: 'POST', path: '/login', config: User.login},

    {method: 'GET', path: '/users/detail', config: User.getMyDetail},

    // logging
    {method: 'POST', path: '/log', config: Log.addLog},
];