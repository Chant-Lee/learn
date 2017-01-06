var express = require('express');
var fs=require('fs');
var router = express.Router();
router.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/mock-test', function(req, res) {
    fs.readFile('public/json/index.json', function (error, fileData) {
        if (error) {
            console.log(error);
            return;
        }
        res.send(JSON.parse(fileData.toString()));
    });
});
router.post('/test', function(req, res) {
    fs.readFile('public/json/test.json', function (error, fileData) {
        if (error) {
            console.log(error);
            return;
        }
        res.send(JSON.parse(fileData.toString()));
    });
});

module.exports = router;
