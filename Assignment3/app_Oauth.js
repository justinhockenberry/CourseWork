// Justin Hockenberry
// Web API - Course #3800
// March 26, 2016



var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var router = express();

var loginID = {client_id: 'HXDHimNtbRmcPGgHQD4xGX0fOApqwhlz', client_secret: 'EWG46XGb6vrSmLJm'}
var accessToken = ""

router.use(bodyParser.json());
router.use(bodyParser.text());



router.post('/', function(req, res)
{
		request.post({url:'https://jhockenberry-test.apigee.net/oauth/client_credential/accesstoken?grant_type=client_credentials', form:loginID}, function(error, response, body)
		{
			console.log(JSON.stringify(req.body))
			
			var obj = JSON.parse(body)
			console.log(obj.access_token);
			res.end(obj.access_token)

		})
})

router.listen('3030', function(){
	console.log('listening on port 3030')
})