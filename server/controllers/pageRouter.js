var express = require('express');
var router = express.Router();
var BaseController = require('./baseController');
var rp = require('request-promise');
var fs = require('fs');
var path = require('path');

var PageController = class extends BaseController {
    constructor(service, obj) {
        super();
    }

    getPage(req, res, next) {
        var _self = this;

        var promise = new Promise((resolve, reject) => {
            var mypath = path.join(__base + '/public/views/' + req.query.page);
            let rtn = _self.defaultResultsResponse;
            rtn.results = 'Ok.';

            fs.readFile(mypath, 'utf8', function (error, data) {
                if (error) {
                    rtn.results = "write error:  " + error.message;
                    console.error(rtn.results);
                } else {
                    rtn.results = data;
                }
                resolve(rtn);
            });
        });
        promise.then(rtn => {
            return res.json(rtn);
        });

    }

};

var routerMain = function (obj) {
    var controller = new PageController(null, obj);

    router.route('/')
        .get(controller.getPage.bind(controller));

    return router;
};

module.exports = routerMain;
