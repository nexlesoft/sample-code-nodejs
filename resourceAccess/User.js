'use strict';

const jwt = require('jsonwebtoken');
const sha1 = require('sha1');
const parser = require('xml2json');
const AppConfig = require('../config/app');
const DB = require('../config/database').DB;

const isEmpty = function (obj) {
    return Object.keys(obj).length === 0;
};

module.exports = {
    toJsonBody: function (data) {
        try {
            return JSON.parse(parser.toJson(data)).vCard;
        } catch (error) {
            return {};
        }
    },
    login: function (payload) {
        return new Promise((resolve, reject) => {
            const {xmppId, password} = payload;

            let token = {}, user = {};
            const user_id_sha1 = sha1(xmppId.toLowerCase());
            DB('tig_users').where({sha1_user_id: user_id_sha1 , user_pw: password}).then(data => {
                if (data.length > 0) {
                    const rs = data[0];
                    user = {
                        id: data[0].uid || null,
                        xmppId: data[0].user_id || '',
                        accCreateTime: data[0].acc_create_time || null,
                        lastLogin: data[0].last_login || null,
                        lastLogout: data[0].last_logout || null
                    };
                    return DB('tig_pairs').where({uid: data[0].uid, pkey: 'vCard'});
                }
                return reject({statusCode: 501, obj: {}});
            }).then(data => {
                if (data.length > 0) {
                    const vcard = this.toJsonBody(data[0].pval);
                    user = Object.assign({}, user, {
                        userId: vcard.userid,
                        vCard: {
                            displayName: vcard.displayname || '',
                            firstName: vcard.firstname || '',
                            lastName: vcard.lastname || '',
                            avatarUrl: !vcard.url_avatar || isEmpty(vcard.url_avatar) ? '' : vcard.url_avatar,
                            age: vcard.age || 0,
                            ageTitle: vcard.ageTitle || '',
                            memberTypeTitle: vcard.sex || '',
                            online: true
                        }
                    });

                    const scope = ['loggedXmpp'];
                    if (xmppId.toLowerCase() === process.env.TIGASE_ADMIN_EMAIL.toLowerCase()){
                        scope.push('admin');
                    }

                    token = jwt.sign(
                        {
                            xmppId,
                            uid: user.id,
                            userId: vcard.userid,
                            displayname: vcard.displayname,
                            scope: scope,
                        },
                        AppConfig.jwt.secret,
                        {algorithm: 'HS256'}
                    );
                }
                return resolve({statusCode: 201, obj: {user, token}});
            }).catch(obj => {
                return reject({statusCode: 300, obj})
            });
        })
    },
    getDetail: function (xmppId) {
        return new Promise((resolve, reject) => {
            let rs = {};
            const user_id_sha1 = sha1(xmppId.toLowerCase());
            DB('tig_users').where('sha1_user_id', user_id_sha1).then(data => {
                if (data.length > 0) {
                    rs = data[0];
                    rs.user_pw = undefined;
                    rs.sha1_user_id = undefined;
                    rs = {
                        id: data[0].uid || null,
                        xmppId: data[0].user_id || '',
                        accCreateTime: data[0].acc_create_time || null,
                        lastLogin: data[0].last_login || null,
                        lastLogout: data[0].last_logout || null
                    };
                    return DB('tig_pairs').where({uid: rs.id, pkey: 'vCard'});
                }
                return resolve({statusCode: 202, obj: {}});
            }).then(data => {
                if (data.length > 0) {
                    const vcard = this.toJsonBody(data[0].pval);
                    rs = Object.assign({}, rs, {
                        userId: vcard.userid,
                        vCard: {
                            displayName: vcard.displayname || '',
                            firstName: vcard.firstname || '',
                            lastName: vcard.lastname || '',
                            avatarUrl: !vcard.url_avatar || isEmpty(vcard.url_avatar) ? '' : vcard.url_avatar,
                            age: vcard.age || 0,
                            ageTitle: vcard.ageTitle || '',
                            memberTypeTitle: vcard.sex || '',
                            online: (rs.status > 0 ? true : false)
                        }
                    });
                }
                return resolve({statusCode: 201, obj: rs});
            }).catch(obj => {
                return reject({statusCode: 300, obj})
            });
        });
    }
};