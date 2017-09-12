var express = require('express');
var router = express.Router();
var BaseController = require('./baseController');
var rp = require('request-promise');
var fs = require('fs');
var path = require('path');

var AssetController = class extends BaseController {
    constructor(service, obj) {
        super();
    }

    getIndex(req, res, next) {

    }

    getIndexById(req, res) {
        res.json({ "hello": "there world" });
    }

    getConfig(req, res) {
        var _self = this;

        // Note - require(<file.json>) requires a server restart to see the changes, 
        //      whereas reading the file using js.readfile async method reads the changes immediately
        var promise = new Promise((resolve, reject) => {
            var mypath = path.join(__dbbase + '/routeBuilderConfiguration-Assets.json');
            let rtn = _self.defaultResultsResponse;
            rtn.results = 'Ok.';

            fs.readFile(mypath, 'utf8', function (error, data) {
                if (error) {
                    rtn.results = "write error:  " + error.message;
                    console.error(rtn.results);
                } else {
                    rtn.results = data;
                    console.log(rtn.results);
                }
                resolve(rtn);
            });
        });
        promise.then(rtn => {
            res.json(JSON.parse(rtn.results));
        });
    }

    saveConfig(req, res) {
        var _self = this;

        var promise = new Promise((resolve, reject) => {
            var mypath = path.join(__dbbase + '/routeBuilderConfiguration-Assets.json');
            let rtn = _self.defaultResultsResponse;
            rtn.results = 'Ok.';

            fs.writeFile(mypath, JSON.stringify(req.body), function (error) {
                if (error) {
                    rtn.results = "write error:  " + error.message;
                    console.error(rtn.results);
                } else {
                    rtn.results = "Successful Write to " + mypath;
                    console.log(rtn.results);
                }
                resolve(rtn);
            });
        });
        promise.then(rtn => {
            res.status(rtn.status).json(rtn);
        });

    }
};

var routerMain = function (obj) {
    //    router.use(function (req, res, next) {
    //        if (!req.user) {
    //            res.redirect('/');
    //        } else {
    //            next();
    //        }
    //    });

    var controller = new AssetController(null, obj);

    router.route('/')
        .get(function (req, res, next) {
            controller.getIndex(req, res, next);
        });

    router.route('/config')
        .get(controller.getConfig.bind(controller));

    router.route('/saveconfig')
        .post(controller.saveConfig.bind(controller));

    return router;
};

module.exports = routerMain;
