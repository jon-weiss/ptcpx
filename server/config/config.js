"use strict";

var request = require('request-promise');
var uaa_util = require('predix-uaa-client');
var base64 = require('base-64');

var config = {};
var local = true;

var uaa_config = {};
var asset_config = {};
var ts_config = {};
var pg_config = {};

if (local)
{
  uaa_config.issuerId = 'https://4538ce68-8a53-4ca0-9678-309cf01b1218.predix-uaa.run.aws-usw02-pr.ice.predix.io/oauth/token';
  uaa_config.clientId = 'demo_ts_client';
  uaa_config.base64ClientSecret = 'QXYzbmczcnNVbml0ZSE=';
  ts_config.queryZoneId = 'b33fd8e4-1db8-47c8-bc35-ed0c114af1fd';
  asset_config.queryZoneId = '0049d03f-f465-4ba8-a15f-5fb184003927';
}
else
{
  var VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
  //Postgres
  if (VCAP_SERVICES['postgres-2.0'])
  {
    console.log('Config including postgres');
    var pg_credentials = VCAP_SERVICES['postgres-2.0'][0].credentials;
    var pg_config =
    {
      user: pg_credentials.username,
      database: pg_credentials.database,
      password: pg_credentials.password,
      host: pg_credentials.hostname,
      port: pg_credentials.port
    };
  }

  //UAA
  if (VCAP_SERVICES['predix-uaa'])
  {
    console.log('Config including UAA');
    var uaa_credentials = VCAP_SERVICES['predix-uaa'][0].credentials;
    uaa_config.issuerId = uaa_credentials.issuerId;
    uaa_config.uri = uaa_credentials.uri;
    uaa_config.clientId = process.env.clientId;
    uaa_config.base64ClientCredential = process.env.base64ClientCredential;
    uaa_config.base64ClientSecret = process.env.base64ClientSecret
  }

  //Asset
  if (VCAP_SERVICES['predix-asset'])
  {
    console.log('Config including Asset');
    var asset_credentials = VCAP_SERVICES['predix-asset'][0].credentials;
    asset_config.instanceId = asset_credentials.issuerId;
    asset_config.uri = asset_credentials.uri;
    asset_config.queryZoneId = asset_credentials.zone["http-header-value"];
  }

  //Timeseries
  if (VCAP_SERVICES['predix-timeseries'])
  {
    console.log('Config including timeseries');
    var ts_credentials = VCAP_SERVICES['predix-timeseries'][0].credentials;
    ts_config.queryUri = ts_credentials.query.uri;
    ts_config.queryZoneId = ts_credentials.query["zone-http-header-value"];
    ts_config.endpoint = ts_credentials.ingest.uri;
    ts_config.renewTime = 0;
  }
}

ts_config.accessToken = uaa_util.getToken(uaa_config.issuerId + "?grant_type=client_credentials", uaa_config.clientId, base64.decode(uaa_config.base64ClientSecret)).then(token =>
{
  return token.access_token
})
.catch(error => {
  console.error("Token retrieval error" + error);
  Promise.reject("Token error")
});
ts_config.checkToken = function()
{
  return uaa_util.getToken(uaa_config.issuerId + "?grant_type=client_credentials", uaa_config.clientId, base64.decode(uaa_config.base64ClientSecret)).then(token =>
  {
    //console.log('token : ' + JSON.stringify(token));
    ts_config.accessToken = token.access_token;
    return token.access_token
  })
  .catch(error => {
    console.error("Token retrieval error" + error);
    Promise.reject("Token error")
  });
}


config.postgres = pg_config;
config.uaa = uaa_config;
config.asset = asset_config;
config.ts = ts_config;



module.exports = { config: config };
