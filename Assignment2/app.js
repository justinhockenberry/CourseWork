

var express = require('express');
var bodyParser = require('body-parser');
var router = express();
router.use(bodyParser.text());
router.use(bodyParser.json());

router.get('/gets', function(req, res){
   
   onRequest(req, res);
   console.log("GET request");
   res.end("User get reqest has been made\n");

});

router.post('/posts', function(req, res){
   
   onRequest(req, res);
   console.log("POST request");
   res.end("\nUser post reqest has been made\n");

});

router.put('/puts', function(req, res){
   
   onRequest(req, res);
   console.log("PUT request");
   res.end("\nUser put reqest has been made\n");

});

router.delete('/deletes', function(req, res){
   
   onRequest(req, res);
   console.log("DELETE request");
   res.end("\nUser delete reqest has been made\n");

});



var onRequest = function(req, res){
   res.write("\nHeaders:\n");
   if(JSON.stringify(req.headers) ==="{}"){
       res.write("**No headers passed in request**\n");
   }
   else{
       res.write(JSON.stringify(req.headers, null, '\t'));
       res.write('\n'); //can't pass this as part of above or it will be interpreted weird
   }
   res.write("\nBody:\n");
   
   if(JSON.stringify(req.body) ==="{}"){
       res.write("**No body passed in request**\n");
   }
   else{
       res.write(JSON.stringify(req.body, null, '\t'));
       res.write('\n');
   }
   res.write("\nQuery Parameters:\n");

   if(JSON.stringify(req.query) ==="{}"){
       res.write("**No query parameters passed in request**\n");
   }
   else{
       res.write(JSON.stringify(req.query, null, '\t'));
       res.write('\n');
   }
};


router.listen(3000, function(){
   console.log("listening on port 3000");
});