var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/gets', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log("Get Request Succeeded");
});

/* PUT home page. */
router.put('/puts', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log("Put Request Succeeded");
});

/* POST home page. */
router.post('/posts', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log("Post Request Succeeded");
});

/* DELETE home page. */
router.delete('/deletes', function(req, res, next) {
  res.render('index', { title: 'Express' });
  console.log("Delete Request Succeeded");
});

module.exports = router;
