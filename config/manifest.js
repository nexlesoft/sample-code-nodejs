'use strict';

const AppConfig = require('../config/app');
var fs = require('fs');

/*var tls = {
    key: fs.readFileSync('/etc/apache2/ssl1/key.pem'),
    cert: fs.readFileSync('/etc/apache2/ssl1/cert.pem'),
    passphrase: '12345678'
};*/

/*var tls = {
    key: fs.readFileSync('/etc/apache2/ssl/wildcard_redhotpie_com_au.key'),
    cert: fs.readFileSync('/etc/apache2/ssl/certificate.pem'),
};*/

const manifest = {
    server: {},
    connections: [
        {
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: true
            },
            port: process.env.PORT || 3332,
            routes: {
                cors: true,
                // cors: {
                //     origin: ["*"],
                //     headers: ["*"],
                // }
            }
        },
        {
            router: {
                isCaseSensitive: false,
                stripTrailingSlash: true
            },
            port: process.env.SSL_PORT || 3333,
            routes: {
                cors: true,
                // cors: {
                //     origin: ["*"],
                //     headers: ["*"],
                // }
            }
            //tls: tls
        }
    ],
    registrations: [{
        // plugin: { register: '../utils/middleware'}
        plugin: {
            register: 'hapi-auth-jwt',
            options: AppConfig.jwt.options
        }
    }]
};

if (AppConfig.documentation.enable) {
    manifest.registrations.push(
        {
            plugin: {
                register: 'hapi-swagger',
                options: AppConfig.documentation.options
            }
        }
    );

    if (AppConfig.documentation.options.documentationPage || AppConfig.documentation.options.swaggerUI) {
        manifest.registrations.push(
            {
                plugin: {
                    register: 'inert',
                    options: {}
                }
            },
            {
                plugin: {
                    register: 'vision',
                    options: {}
                }
            }
        );
    }
}

if (AppConfig.logging.console.enable || AppConfig.logging.loggly.enable) {
    const loggingPlugins = {
        plugin: {
            register: 'good',
            options: {
                reporters: {}
            }
        }
    };

    if (AppConfig.logging.console.enable) {
        loggingPlugins.plugin.options.reporters.consoleReporter = [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: AppConfig.logging.console.levels
            },
            {
                module: 'good-console'
            }, 'stdout'
        ]
    }

    if (AppConfig.logging.loggly.enable) {
        loggingPlugins.plugin.options.reporters.logglyReporter = [
            {
                module: 'good-squeeze',
                name: 'Squeeze',
                args: AppConfig.logging.loggly.levels
            },
            {
                module: 'good-loggly',
                args: [
                    {
                        token: AppConfig.logging.loggly.token,
                        subdomain: AppConfig.logging.loggly.subdomain,
                        tags: AppConfig.logging.loggly.tags,
                        name: AppConfig.logging.loggly.name,
                        hostname: AppConfig.logging.loggly.hostname,
                        threshold: AppConfig.logging.loggly.threshold,
                        maxDelay: AppConfig.logging.loggly.maxDelay
                    }
                ]
            }
        ]
    }

    manifest.registrations.push(loggingPlugins);
}

module.exports = manifest;
