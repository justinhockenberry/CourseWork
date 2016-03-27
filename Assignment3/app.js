// Justin Hockenberry
// Web API - Course #3800
// March 26, 2016

var GitHubApi = require('github');
var express = require('express');
var bodyParser = require('body-parser');

var request = require('request');
var router = express();

var github = new GitHubApi({
  version: "3.0.0"
});

router.use(bodyParser.text());
router.use(bodyParser.json());


github.authenticate({
  type: "basic",
  username: "justinhockenberry",
  password: "welcome01"
});

var token = "d4a1f1242da813c3930c0c9439c50b5b6657ff89";
var loginID = {client_id: 'HXDHimNtbRmcPGgHQD4xGX0fOApqwhlz', client_secret: 'EWG46XGb6vrSmLJm'}

github.authenticate({
  type: "oauth",
  token: token
});

router.get('/', function(req, res)
{
   try
  {
   console.log("GET request");
   request.get ({url: 'https://api.github.com/?access_token=d4a1f1242da813c3930c0c9439c50b5b6657ff89'}, function(error, response, body)
   {
      var object = JSON.parse(loginID)
      console.log('object.client_id')
      if(body == 'object.client_id')
      {
        console.log('You have correct authenticate token')
      }else
      {
        console.log('An error has occured')
      }

      res.end("User get request has been made\n"); 
    })
   
  }catch(e)
  {
    console.log("Error occured at get request");
    console.log(e);
  }
})

router.get('/oauth', function(req, res)
{
  
  try
  {
   console.log("Oauth request");


   res.end("User get reqest has been made\n");




  }catch(e)
  {
    console.log("Error occured at get request");
    console.log(e);
  }   
})



router.listen('4000', function(){
   console.log("listening on port 4000")
})


