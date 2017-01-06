/**
 * Created by liliangquan on 2017/1/5.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('hello', { name: 'nunjucks' });
    next();
});

module.exports = router;
