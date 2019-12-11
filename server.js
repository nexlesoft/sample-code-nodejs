/**
 * Created by A on 7/18/17.
 */
'use strict';
const newrelic = require('newrelic');
const hapiNewRelic = require('hapi-newrelic');
const Logger    = require('./utils/logging');
const Glue      = require('glue');
const Routes    = require('./config/routes');
const Manifest  = require('./config/manifest');
const middleware = require('./utils/middleware');
const dotenv    = require('dotenv').config();
const isNewRelicEnabled = process.env.IS_NEWRELIC_ENABLED;

Glue.compose(Manifest, {relativeTo: __dirname}, (err, server) => {
    if (err) {
        throw err;
    }

    if (isNewRelicEnabled === 'true'){
        // Registration
        server.register({
            register: hapiNewRelic,
            options: { newrelic }
        }, err => {});
    }

    server.start(() => {
        if (server.connections[0] && server.connections[0].info)
            Logger.info('Server running at:', server.connections[0].info.uri);
        if (server.connections[1] && server.connections[1].info)
            Logger.info('Server running at:', server.connections[1].info.uri);
    });
    server.auth.strategy('jwt', 'jwt', middleware.jwt);
    
    server.route (Routes);

});