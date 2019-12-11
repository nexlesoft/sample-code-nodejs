'use strict';

const replaceAll = function (str = '', search, replacement) {
    return str.replace(new RegExp(search, 'g'), replacement);
};

const getRandomString = function(){
    return Math.random().toString(36).substring(3);
};

module.exports = {
    replaceAll,
    getRandomString
};