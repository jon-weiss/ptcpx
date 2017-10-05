
'use strict'
const request = require('request-promise');
var env = require('./config/config');



module.exports = function(app)
{
	try
	{
		app.use('/api/ts', function(req,res)
		{
			var selectedTagName = req.headers.name;
			console.log("tag: " + JSON.stringify(selectedTagName));
			var stValue = parseInt(req.headers.starttime);
			var etValue = parseInt(req.headers.endtime);
			console.log("StartTime: " + stValue);
			console.log("endTime: " + etValue);
			var tsQuery =
			{
				"start": stValue,
				"end": etValue,
				"tags":
				[
					{
						"name": selectedTagName,
						"order": "asc"
					}
				]
			};
			return env.config.ts.checkToken().then(token =>
			{
				var options =
				{
					method: 'POST',
					url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints',
					headers :
					{
						"Authorization": "bearer " + token,
		        "Predix-Zone-Id": env.config.ts.queryZoneId,
		        "Content-Type": "application/json"
					},
					json: tsQuery
				};
				console.log("TS DATA: " + options.data)

				request(options).then(reqResult =>
				{
					if ((!reqResult) || (reqResult.tags.length === 0) || (reqResult.tags[0].results.length === 0) || (reqResult.tags[0].results[0].values.length === 0))
					{
						console.log("Error");
					}
					else
					{
						console.log("TS Data Success!" + reqResult)
					}
					return res.json( reqResult.tags[0].results[0].values );
				})
				.catch(function ()
				{
					console.log("TS Data: Promise Rejected");
				});
			});
		});
	}
	catch(err)
	{
		console.log("ERROR: " + err.message)
	}


	try
	{
		app.use('/api/tsTags', function(req,res)
		{
			return env.config.ts.checkToken().then(token =>
			{
				var options =
				{
					method: 'GET',
					url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/tags',
					headers :
					{
						"Authorization": "bearer " + token,
		        "Predix-Zone-Id": env.config.ts.queryZoneId,
		        "Content-Type": "application/json"
	        }
				};
				request(options, function (error, response, body)
				{
					if(error)
					{
						res.json({ message : 'failure',	data : new Error(error)	});
					}
					else
					{
						res.json({ message : 'success',	result : JSON.parse(body)	});
					}
				});
			});
		});
	}
	catch(err)
	{
		console.log("ERROR: " + err.message)
	}


	try
	{
		app.use('/api/alerts', function(req,res)
		{
			var options =
			{
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
        return res.json( parseResult.result );
	  	})
			.catch(function ()
			{
     		console.log("Alerts Promise Rejected");
			});
		});
	}
	catch(err)
	{
		console.log("ERROR: " + err.message)
	}


	try
	{
		app.use('/api/latestTagValue', function(req,res)
		{
    	var selectedTagName = req.headers.name;
			var tsQuery =
			{
        "start": "1y-ago",
        "tags":
				[
          {
            "name": selectedTagName
          }
        ]
			};
			return env.config.ts.checkToken().then(token =>
			{
				var options =
				{
					method: 'POST',
					url: 'https://time-series-store-predix.run.aws-usw02-pr.ice.predix.io/v1/datapoints/latest',
					headers :
					{
						"Authorization": "bearer " + token,
		        "Predix-Zone-Id": env.config.ts.queryZoneId,
		        "Content-Type": "application/json"
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
	        return res.json( reqResult.tags[0].results[0].values );
		  	})
				.catch(function ()
				{
	     		console.log("Last Position: Promise Rejected");
				});
			});
		});
	}
	catch(err)
	{
		console.log("ERROR: " + err.message)
	}


	try
	{
		app.use('/api/downtime', function(req,res)
		{
			var startTime = parseInt(req.headers.starttime);
			var endTime = parseInt(req.headers.endtime);
			console.log("StartTime DT Value:" + startTime);
			console.log("endTime DT Value:" + endTime);
			var tsQuery =
			{
	  		"groups":
				[
					{"id": 1, "displayname": "Bagger 1", "tag": "PTChronos_L1.calc.downtime"},
					{"id": 2, "displayname": "Bagger 2", "tag": "PTChronos_L2.calc.downtime"}
				],
	  		"range": { "start": startTime, "end": endTime }
			};
			return env.config.ts.checkToken().then(token =>
			{
				var options =
				{
					method: 'POST',
					url: 'https://pxa-timeline-ms.run.aws-usw02-pr.ice.predix.io/getdowntime',
					headers :
					{
						"Authorization": "bearer " + token,
						"Content-Type": "application/json"
					},
          json: tsQuery
				};
				request(options).then(reqResult =>
	      {
	        if ((!reqResult) || (reqResult.items.length === 0) )
        	{
					  console.log("Downtime Data: Error");
		      }
		      else
		      {
				 		// console.log("Last Position: " + JSON.stringify(reqResult.tags[0].results[0].values) );
					}
		      return res.json( reqResult );
			  })
				.catch(function ()
				{
		     		console.log("Downtime Data: Promise Rejected");
				});
			});
		});
	}
	catch(err)
	{
		console.log("ERROR: " + err.message)
	}


	try
	{
		app.use('/api/asset', function(req,res)
		{
			var endpoint = req.headers.name;
			console.log("headers  " + req.headers);
			console.log("--------------------- Trying to get asset level " + endpoint )

			return env.config.ts.checkToken().then(token =>
			{
				var options =
				{
					method: 'GET',
					url: 'https://predix-asset.run.aws-usw02-pr.ice.predix.io/' + endpoint,
					headers :
					{
						"Authorization": "bearer " + token,
		        "Predix-Zone-Id": env.config.asset.queryZoneId,
		        "Content-Type": "application/json"
		      }
				};
				request(options).then(reqResult =>
	      {
				  var parseResult = JSON.parse(reqResult)
	        if ((!parseResult) || (parseResult.result=== 0))
	        {
				  	console.log("Error");
		      }
		      else
		      {
				  	console.log("call to asset returned:  "  + reqResult)
					}
		      return res.json( parseResult );
			  })
				.catch(function ()
				{
		    	console.log("Promise Rejected for asset call");
				});
			});
		});
	}
	catch(err)
	{
			console.log("ERROR: " + err.message)
	}
}
