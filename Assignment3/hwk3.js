 //Lets require/import the HTTP module
var http = require('http');
var request = require('request');
var express = require('express');
var app = express();
 
app.use('*', function(req, res, next) {
    var err = new Error();
    err.status = 404;
    err.message = "bad mojo";
    next(err);
});
 
app.listen(1212, function() {
console.log("Node server is watching");
});

app.get('/LetMeIn', function(req, res){
   var options = {
        url: 'https://api.github.com/users/justinhockenberry',
        headers: {
            'User-Agent': 'Apache HTTPClient'
        }
    };
 
    function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        res.send(info);
        }
        else {
            res.send('Fail to connect to GitHub');
        }
 
    }
 
    request(options, callback);
    
});  
    
    