'use strict';

const Joi = require('joi');

const Manager = require('../manager/Log');
const Response = require('./response').setup(Manager);

const addLog = {
  tags: ['api', 'Log'],
  description: 'Add a log',
  validate: {
    headers: Joi.object({
      'authorization': Joi.string(),
      'language': Joi.string()
    }).unknown(),
    payload: Joi.object({
      type: Joi.string().required(),
      category: Joi.string(),
      message: Joi.string().required(),
      stackTrace: Joi.string().allow('').optional(),
      isNative: Joi.boolean().optional().description('To indicate if the log is from ReactNative'),
    })
  },
  handler: (req, res) => {
    Response(req, res, 'addLog');
  },
  auth: {
    strategy: 'jwt',
    scope: ['loggedXmpp']
  },
  plugins: {
    'hapi-newrelic': {
      transactionName: 'POST /log'
    }
  }
};

module.exports = { addLog };
