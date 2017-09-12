var path = require('path');
var express = require('express');
var router = express.Router();
var TokenClientController = require('./tokenClientController');
var PxaResults = require(__base + '/server/model/PxaResults');
var rp = require('request-promise');
var fs = require('fs');

const uaaUrl = ""; //"https://a3cd4cce-172d-4d14-b240-8e966de1a488.predix-uaa.run.aws-usw02-pr.ice.predix.io";
const svcUid = "data_service_client";
const svcPwd = "password";

var ProxyController = class extends TokenClientController {
    constructor(service, obj) {
        super(uaaUrl, svcUid, svcPwd);

    }

    _getConfig() {
        var _self = this;

        // Note - require(<file.json>) requires a server restart to see the changes, 
        //      whereas reading the file using js.readfile async method reads the changes immediately
        var promise = new Promise((resolve, reject) => {
            var mypath = path.join(__base + '/server/proxyConfig.json');
            let rtn = _self.defaultResultsResponse;
            rtn.results = 'Ok.';

            fs.readFile(mypath, 'utf8', function (error, data) {
                if (error) {
                    rtn.results = "read error:  " + error.message;
                    console.error(rtn.results);
                } else {
                    rtn.results = data;
                }
                resolve(rtn);
            });
        });
        return promise;
    }

    _paramgen(paramlist, proxytype) {
        var _type = proxytype || 'rt';
        var r = '';
        for (let o of Object.keys(paramlist)) {
            if (o === _type) { continue; }
            r += ((r.length > 0) ? '&' : '') + o + '=' + paramlist[o];
        }
        return r;
    }

    getProxy(req, res) {
        var _self = this;
        _self._getConfig().then(rtn => {
            var cfg = JSON.parse(rtn.results);

            var proxyUrl = '';

            if (req.query.hasOwnProperty('rt')) {
                proxyUrl = cfg.rt;
                var rt = ((req.query.rt[0] !== '/') ? '/' : '') + req.query.rt;
                var params = _self._paramgen(req.query, 'rt');
                proxyUrl += rt + ((params.length > 0) ? '?' + params : '');
            }

            if (proxyUrl.length === 0) { res.json(Models.PxaResults.err('Could not determine type of proxy url to generate!')); return; }
            super.getRequest(proxyUrl).then(rtn => {
                res.json(rtn);
            })
            .catch(err => {
                res.status(err.statusCode).json(PxaResults.err('{0}'.format([err.statusCode]), err));
            });
        });
    }

    postProxy(req, res) {
        var _self = this;
        _self._getConfig().then(rtn => {
            var cfg = JSON.parse(rtn.results);
            var proxyUrl = '';

            if (req.query.hasOwnProperty('rt')) {
                proxyUrl = cfg.rt;
                var rt = ((req.query.rt[0] !== '/') ? '/' : '') + req.query.rt;
                var params = _self._paramgen(req.query, 'rt');
                proxyUrl += rt + ((params.length > 0) ? '?' + params : '');
            }

            super.postRequest(proxyUrl, req.body).then(rtn => {
                res.status(200).json(rtn);
            });
        });
    }

};

var routerMain = function (obj) {
    var controller = new ProxyController(null, obj);

    router.route('/')
        .get(controller.getProxy.bind(controller));

    router.route('/')
        .post(controller.postProxy.bind(controller));

    router.route('/get')
        .get(controller.getProxy.bind(controller));

    // inbound url should look like this:
    // http://peter-work:5000/proxy/post?rt=/workorders/completeoperation
    // (body):
    // {
    // 	"workorder": "RN0001",
    // 	"bop": "asset-01 20170801.1557",
    // 	"operation": "ws1-third-op", 
    // 	"completedby": "angel"
    // }
    router.route('/post')
        .post(controller.postProxy.bind(controller));

    return router;

};

module.exports = routerMain;
