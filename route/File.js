'use strict';

const Joi = require('joi');

const Manager = require('../manager/File');
const Response = require('./response').setup(Manager);

module.exports = {
    upload: {
        tags: ['api', 'File'],
        description: "Upload files",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
        },
        payload: {
            output: 'stream',
            parse: true,
            maxBytes: 5242880,
            allow: 'multipart/form-data'
        },
        handler: (req, res) => {
            Response(req, res, 'upload');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        },
        plugins: {
            'hapi-newrelic': {
                transactionName: 'POST /files'
            }
        }
    },
}
