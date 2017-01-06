/**
 * Created by liliangquan on 2017/1/5.
 */
var express=require('express');
var router=express.Router();
var data={
    name: 'nunjucks学习',
    fruits: ['Apple', 'Pear', 'Banana'],
    count: 12000
};
router.get('/', function(req, res, next) {
    console.log(1111);
    res.render('nun-index', data);
});
router.get('/hello', function(req, res, next) {
    console.log(222222);
    res.render('hello', data);
});
module.exports = router;