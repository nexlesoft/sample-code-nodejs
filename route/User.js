/**
 * Created by HoangNck on 2017/11/01.
 */
'use strict';

const Joi = require('joi');

const Manager = require('../manager/User');
const Response = require('./response').setup(Manager);

module.exports = {
    login: {
        tags: ['api', 'User'],
        description: "API login XMPP: Return session token",
        validate: {
            headers: Joi.object({
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                xmppId: Joi.string().required(),
                password: Joi.string().required()
            })
        },
        handler: (req, res) => {
            Response(req, res, 'login');
        },
        plugins: {
            'hapi-newrelic': {
                transactionName: 'POST /login'
            }
        }
    },
    getUserDetail: {
        tags: ['api', 'User'],
        description: "Get detail user",
        validate: {
            headers: Joi.object({
                'language': Joi.string()
            }).unknown(),
            params: {
                xmppId: Joi.string().description('xmppId of other user')
            },
        },
        handler: (req, res) => {
            Response(req, res, 'getUserDetail');
        },
        plugins: {
            'hapi-newrelic': {
                transactionName: 'POST /users/{xmppId}'
            }
        }
    },
    getMyDetail: {
        tags: ['api', 'User'],
        description: "Get detail user",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown()
        },
        handler: (req, res) => {
            Response(req, res, 'getMyDetail');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        },
        plugins: {
            'hapi-newrelic': {
                transactionName: 'POST /users/detail'
            }
        }
    },
    getToken: {
        tags: ['api', 'User'],
        description: "Get token",
        validate: {
            headers: Joi.object({
                'language': Joi.string()
            }).unknown(),
            params: {
                xmppId: Joi.string().required().description('xmppId of user')
            },
        },
        handler: (req, res) => {
            Response(req, res, 'getToken');
        }
    },
    validateToken: {
        tags: ['api', 'User'],
        description: "Validate token",
        validate: {
            headers: Joi.object({
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                xmppId: Joi.string(),
                token: Joi.string(),
            })
        },
        handler: (req, res) => {
            Response(req, res, 'validateToken');
        }
    },
    updateStatus: {
        tags: ['api', 'User'],
        description: "Update user's online status",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                online: Joi.boolean()
            }),
            params: {
                userId: Joi.number().description('Id of user')
            },
        },
        handler: (req, res) => {
            Response(req, res, 'updateStatus');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    },
    updateAccountStatus: {
        tags: ['api', 'User'],
        description: "Update user's account status",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                isInActive: Joi.boolean()
            }),
            params: {
                userId: Joi.number().description('Id of user')
            },
        },
        handler: (req, res) => {
            Response(req, res, 'updateAccountStatus');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    },
    getStatus: {
        tags: ['api', 'User'],
        description: "Get user's status",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            params: {
                userId: Joi.number().description('Id of user')
            },
        },
        handler: (req, res) => {
            Response(req, res, 'getStatus');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },
    create: {
        tags: ['api', 'User'],
        description: "Create user's account in Tigase: Returns Tigase user account",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                // xmppid: Joi.string().required(),
                userId: Joi.number().required(),
                password: Joi.string().allow('').optional(),
                //avatarUrl : Joi.string().required(),
                // cover : Joi.string().required(),
                //nick : Joi.string().required(),
                displayName: Joi.string().required(),
                memberLevel : Joi.number().optional(),
                // firstName: Joi.string().required(), 
                // lastName: Joi.string().required(),
                // age : Joi.number().required(),
                // memberTypeTitle : Joi.string().required()
                ageTitle: Joi.string().required()
            })
        },
        handler: (req, res) => {
            Response(req, res, 'create');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    },
    update: {
        tags: ['api', 'User'],
        description: "Update user summary in Tigase: Returns updated Tigase user account",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                userId: Joi.number().required(),
                //avatarUrl : Joi.string().required(),
                // cover : Joi.string().required(),
                //nick : Joi.string().required(),
                displayName: Joi.string().required(),
                memberLevel : Joi.number().required(),
                // firstName: Joi.string().required(), 
                // lastName: Joi.string().required(),
                // age : Joi.number().required(),
                // memberTypeTitle : Joi.string().required()
                ageTitle: Joi.string().required()
            })
        },
        handler: (req, res) => {
            Response(req, res, 'update');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    },
    updateInfo: {
        tags: ['api', 'User'],
        description: "Update my user summary in Tigase: Returns updated Tigase user account",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                displayName: Joi.string().required(),
                memberLevel : Joi.number().required(),
                ageTitle: Joi.string().required()
            }),
            params: {
                userId: Joi.number().required().description('Id of the User')
            }
        },
        handler: (req, res) => {
            Response(req, res, 'updateInfo');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },
    pin: {
        tags: ['api', 'User'],
        description: "User pin a conversation",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                pinXmppId: Joi.string().required().required()
            })
        },
        handler: (req, res) => {
            Response(req, res, 'pin');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },
    unpin: {
        tags: ['api', 'User'],
        description: "User unpin a conversation",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                pinXmppId: Joi.string().required().required()
            })
        },
        handler: (req, res) => {
            Response(req, res, 'unpin');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },

    block: {
        tags: ['api', 'User'],
        description: "User block a orther user",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                userId: Joi.number().required(),
                blockId: Joi.number().required(),
                status: Joi.boolean().required()
            })
        },
        handler: (req, res) => {
            Response(req, res, 'block');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    },
    getBlock: {
        tags: ['api', 'User'],
        description: "Get list users of one user",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown()
        },
        handler: (req, res) => {
            Response(req, res, 'getBlock');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },
    hide: {
        tags: ['api', 'User'],
        description: "User hide another user",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                userId: Joi.number().required(),
                status: Joi.boolean().required()
            })
        },
        handler: (req, res) => {
            Response(req, res, 'hide');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        }
    },
    match: {
        tags: ['api', 'User'],
        description: "User match a orther user",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            payload: Joi.object({
                xmppId: Joi.string().required().description('xmppId of user'),
                status: Joi.boolean().required().description('true or false')
            })
        },
        handler: (req, res) => {
            Response(req, res, 'match');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },
    listMatch: {
        tags: ['api', 'User'],
        description: "Get users are matched",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown()
        },
        handler: (req, res) => {
            Response(req, res, 'listMatch');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },
    getChatUserInfo: {
        tags: ['api', 'User'],
        description: "Get Chat User Online status",
        validate: {
            headers: Joi.object({
                'authorization': Joi.string(),
                'language': Joi.string()
            }).unknown(),
            params: {
                xmppId: Joi.string().required().description('xmppId of user')
            }
        },
        handler: (req, res) => {
            Response(req, res, 'getChatUserInfo');
        },
        auth: {
            strategy: 'jwt',
            scope: ['loggedXmpp']
        }
    },
}