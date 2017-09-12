var express = require('express');
var router = express.Router();
var BaseController = require('./baseController');
var rp = require('request-promise');

var TokenClientController = class extends BaseController {
    constructor(uaaUrl, uid, pwd) {
        super();
        this.isSubclass = true;

        this.UAAUrl = uaaUrl;
        this.Uid = uid;
        this.Pwd = pwd;
        this.lastToken = null;
    }

    refreshToken() {
        var _self = this;
        var options = {
            uri: this.UAAUrl + '/oauth/token',
            qs: {
                grant_type: 'client_credentials'
            },
            headers: {
                "Authorization": "Basic " + new Buffer(this.Uid + ':' + this.Pwd).toString('base64')
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            if (_self.UAAUrl.length === 0) {
                resolve('');
                return;
            }
            if (this.lastToken != null) {
                if (Date.now() < (this.lastToken.expires_in * 1000 + this.lastToken.retrieved_on.getTime())) {
                    resolve(this.lastToken.access_token);
                    return;
                }
            }

            var timestamp = new Date();
            rp(options).then(data => {
                this.lastToken = data;
                this.lastToken.retrieved_on = timestamp;
                resolve(this.lastToken.access_token);
            });

        });

    }
    getRequest(url) {
        return new Promise((resolve, reject) => {
            this.refreshToken().then(token => {
                var options = {
                    uri: url,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    json: true
                };
                if (token !== '') {
                    options.headers.Authorization = "bearer " + token;
                }
                rp(options).then(rtn => {
                    resolve(rtn);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    }

    postRequest(url, data) {
        return new Promise((resolve, reject) => {
            this.refreshToken().then(token => {
                var options = {
                    method: 'POST',
                    uri: url,
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: data,
                    json: true
                };
                if (token !== '') {
                    options.headers.Authorization = "bearer " + token;
                }
                rp(options).then(rtn => {
                    resolve(rtn);
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    }

};

module.exports = TokenClientController;
