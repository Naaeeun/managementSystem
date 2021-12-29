var express = require('express');
const sqlQuery = require('../../../module/mysql');
var jiami = require('../../../module/jiami')
var router = express.Router();
let fs = require('fs')
let multer = require('multer')
let upload = multer({dest:"./public/upload"})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/user/authlist')
});

router.get('/api/authlist',async (req,res)=>{
    let page = parseInt(req.query.page)
    let limitNum = parseInt(req.query.limit)
    let sqlStr = 'select * from auth limit ?,?'
    let arr  = [(page-1)*limitNum,limitNum]
    let result =  await sqlQuery(sqlStr,arr)
    let sqlStr1 = "select count(id) as authnum from auth"
    let result1 = await sqlQuery(sqlStr1)
    let count = result1[0].authnum
    let option = {
        "code":0,
        "msg":"",
        "count":count,
        "data":Array.from(result)
    }
    res.json(option)
})

router.get('/api/authlistAll',async (req,res)=>{
  let sqlStr = 'select * from auth'
  let result =  await sqlQuery(sqlStr)
  let option = {
      "code":0,
      "data":Array.from(result)
  }
  res.json(option)
})

module.exports = router;
