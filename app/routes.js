var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	res.send('GET route on things.');
});
router.post('/', function(req, res){
	res.send('POST route on things.');
});
//router.get('/:id', function(req, res){
//    res.send('routerid specified is: ' + req.params.id);
//});
router.get('/:name/:id', function(req, res){
    res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});
router.get('/:id([0-9]{5})', function(req, res){
    res.send('id: ' + req.params.id);
});
// onderaan routes anders matched hij op deze
router.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
});

//export this router to use in our index.js
module.exports = router;