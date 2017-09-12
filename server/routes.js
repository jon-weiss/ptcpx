
'use strict'
const request = require('request-promise');
//const async = require('async');

// ====================================================
// STUBS & HELPERS
const clientId = 'demo_ts_client';
const clientSecret = 'Av3ng3rsUnite!';
//const refreshToken = '950';
var baseURL = "https://4538ce68-8a53-4ca0-9678-309cf01b1218.predix-uaa.run.aws-usw02-pr.ice.predix.io";

module.exports = function(app) {
	var tokenDetails = {};
	function getAccessToken() {
		const url = baseURL + '/oauth/token?grant_type=client_credentials';
		const uaa_util = require('predix-uaa-client');
		uaa_util.getToken(url, clientId, clientSecret).then(function(response){
			tokenDetails = response;
            console.log('Got UAA Token:');
		}).catch(function (err){
			console.error('no haz tokenz', err);
		});
    };
	app.use('/api/ts', function(req,res) {
		var selectedTagName = req.headers.name;
		console.log("tag: " + JSON.stringify(selectedTagName));
		var stValue = parseInt(req.headers.starttime);
        var etValue = parseInt(req.headers.endtime);
        console.log("StartTime: " + stValue);
        console.log("endTime: " + etValue);
		var tsQuery = {
        "start": stValue,
        "end": etValue,
		"tags": [
			{
                "name": selectedTagName,
                "order": "asc"
			}
		]
        };
		var options = {
			method: 'POST',
			url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
			headers : { 
                authorization: 'bearer '+tokenDetails.access_token,
				"Predix-Zone-Id": 'b33fd8e4-1db8-47c8-bc35-ed0c114af1fd',
				'Content-Type': 'application/json'
            },
            json: tsQuery
            
		};
			console.log("TS DATA: " + options.data)
		/* request(options, function (error, response, body) {
			if(error) {
				res.json({
					message : 'failure',
					data : new Error(error)
				});
			} else {
				res.json({
					message : 'success',
					result : JSON.parse(body)
                });
			}
		}); */
		request(options).then(reqResult =>
      {
        if ((!reqResult) || (reqResult.tags.length === 0) || (reqResult.tags[0].results.length === 0) || (reqResult.tags[0].results[0].values.length === 0))
        {
          //finalResult.success = false;
		  //finalResult.error = "Unable to retrieve sample tag";
		  console.log("Error");
        }
        else
        {
		  //finalResult.value = reqResult.tags[0].results[0].values[0];
		  console.log("TS Data Success!" + reqResult)
		}
		//console.log(JSON.stringify(reqResult.tags[0].results[0].values))
        return res.json(
					reqResult.tags[0].results[0].values
                );
	  })
		.catch(function () {
     		console.log("TS Data: Promise Rejected");
		});
	});
	app.use('/api/tsTags', function(req,res) {
		var options = {
			method: 'GET',
			url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/tags',
			headers : { 
                authorization: 'bearer '+tokenDetails.access_token,
                "Predix-Zone-Id": 'b33fd8e4-1db8-47c8-bc35-ed0c114af1fd',
                'Content-Type': 'application/json'
            }

		};
			console.log(options.data)
		request(options, function (error, response, body) {
			if(error) {
				res.json({
					message : 'failure',
					data : new Error(error)
				});
			} else {
				res.json({
					message : 'success',
					result : JSON.parse(body)
				});
			}
		});
	});
	app.use('/api/alerts', function(req,res) {
		var options = {
			method: 'GET',
			url: 'https://pxa-hpe-ms.run.aws-usw02-pr.ice.predix.io/alerts'
		};
		request(options).then(reqResult =>
      {
		  var parseResult = JSON.parse(reqResult)
		  console.log("Alerts: " + parseResult.result);
        if ((!parseResult) || (parseResult.result=== 0))
        {
		  console.log("Error");
        }
        else
        {
		  console.log("have alerts!")
		}
        return res.json(
					parseResult.result
                );
	  })
		.catch(function () {
     		console.log("Alerts Promise Rejected");
		});
	});
	app.use('/api/latestTagValue', function(req,res) {
        var selectedTagName = req.headers.name;
		var tsQuery = {
        "start": "1y-ago",
        "tags": [
            {
                "name": selectedTagName
            }
        ]
		};
		var options = {
			method: 'POST',
			url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints/latest',
			headers : { 
                authorization: 'bearer '+tokenDetails.access_token,
				"Predix-Zone-Id": 'b33fd8e4-1db8-47c8-bc35-ed0c114af1fd',
				'Content-Type': 'application/json'
            },
            json: tsQuery           
		};
		request(options).then(reqResult =>
      {
        if ((!reqResult) || (reqResult.tags.length === 0) || (reqResult.tags[0].results.length === 0) || (reqResult.tags[0].results[0].values.length === 0))
        {
		  console.log("Last Position: Error");
        }
        else
        {
		 // console.log("Last Position: " + JSON.stringify(reqResult.tags[0].results[0].values) );
		}
        return res.json(
					reqResult.tags[0].results[0].values
                );
	  })
		.catch(function () {
     		console.log("Last Position: Promise Rejected");
		});
    });
    
	app.use('/api/asset', function(req,res) {
		var endpoint = req.headers.name;

		console.log("headers  " + req.headers);
		console.log("--------------------- Trying to get asset level " + endpoint )

		var options = {
			method: 'GET',
			url: 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/' + endpoint,
			headers : { 
                authorization: 'bearer '+ tokenDetails.access_token,
				"Predix-Zone-Id": '2a48ebc5-6817-4ee9-bdb6-53a35c4e0e81',
				'Content-Type': 'application/json'
            }
		};
		request(options).then(reqResult =>
      {
		  var parseResult = JSON.parse(reqResult)
        if ((!parseResult) || (parseResult.result=== 0))
        {
          //finalResult.success = false;
		  //finalResult.error = "Unable to retrieve sample tag";
		  console.log("Error");
        }
        else
        {
		  //finalResult.value = reqResult.tags[0].results[0].values[0];
		  console.log("call to asset returned:  "  + reqResult)
		}
		//console.log(JSON.stringify(reqResult.tags[0].results[0].values))
        return res.json(
					parseResult
                );
	  })
		.catch(function () {
     		console.log("Promise Rejected for asset call");
		});
	});
	getAccessToken();
}