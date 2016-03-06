var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/gets', function(req, res, next) {
  res.send('respond with a GET resource');
  console.log("Get Request Succeeded");
});

/* PUT users listing. */
router.put('/puts', function(req, res, next) {
  res.send('respond with a PUT resource');
  console.log("Put Request Succeeded");
});

/* POST users listing. */
router.post('/posts', function(req, res, next) {
  res.send('respond with a POST resource');
  console.log("Post Request Succeeded");
});

/* DELETE users listing. */
router.delete('/deletes', function(req, res, next) {
  res.send('respond with a DELETE resource');
  console.log("Delete Request Succeeded");
});

module.exports = router;
