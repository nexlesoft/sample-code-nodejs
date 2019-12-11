/**
 * Created by HoangNck on 2017/11/16.
 */

'use strict';

const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

module.exports = {
    createFile: function (data, url, key = 'file') {
        return new Promise(resolve => {
            if (data) {
                const arr = data.hapi.filename.split(".");
                const name = crypto.createHash('md5').update(new Date().getTime().toString()).digest("hex") + "." + arr[arr.length - 1];
                const pathNew = path.join(url, name);
                const file = fs.createWriteStream(pathNew);

                file.on('error', error => {
                    return resolve({success: false, message: error.message, name, key});
                });

                data.pipe(file);

                data.on('end', () => {
                    return resolve({success: true, url: `/${name}`, name, key});
                });
            } else {
                return resolve({success: false, name: null, key: null});
            }
        })
    },
    upload: function (req) {
        return new Promise((resolve, reject) => {
            const data = req.payload;
            const url = path.join(__dirname, "../public/images/");

            const arr = []
            Object.keys(data).map(vl => {
                arr.push(this.createFile(data[vl], url, vl));
            });
            Promise.all(arr).then(obj => {
                const rs = obj.filter(vl => vl.success).map(vl => {
                    return {
                        PhotoID: 1,
                        Gallery: {
                            GalleryID: 1,
                            Name: 'Public, Private',
                            IsPublic: true,
                            ImageCount: 56
                        },
                        ThumbUrl: req.server.info.protocol + "://" + req.headers.host + vl.url,
                        FullUrl: req.server.info.protocol + "://" + req.headers.host + vl.url,
                        UserPhotoStatus: 'Approved',
                        MainPhoto: true,
                        Height: 200,
                        Width: 200
                    }
                });
                return resolve({statusCode: 201, obj: {Images: rs}});
            }).catch(obj => {
                return reject({statusCode: 300, obj});
            })
        })
    }
};