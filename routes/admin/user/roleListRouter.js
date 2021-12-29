var express = require('express');
const sqlQuery = require('../../../module/mysql');
var jiami = require('../../../module/jiami')
var router = express.Router();
let fs = require('fs')
let multer = require('multer')
let upload = multer({dest:"./public/upload"})

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/user/rolelist')
});

router.get('/api/rolelist',async (req,res)=>{
    let page = parseInt(req.query.page)
    let limitNum = parseInt(req.query.limit)
    let sqlStr = 'select * from role limit ?,?'
    let arr  = [(page-1)*limitNum,limitNum]
    let result =  await sqlQuery(sqlStr,arr)
    let sqlStr1 = "select count(id) as authnum from role"
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

router.get('/addrole',(req,res)=>{
    res.render('admin/user/addrole')
})
router.post('/addrole',async (req,res)=>{
    console.log(req.body)
    let rolename = req.body.rolename
    let brief = req.body.brief
    let sqlStr = "insert into role (rolename,brief) values (?,?)"
    await sqlQuery(sqlStr,[rolename,brief])
    let authlist = req.body.authlist;
    authlist.forEach(async (item,i)=>{
        let id = item.value
        let sqlStr2 = "insert into role_auth (roleid,authid) values ((select id from role where rolename = ?),?)"
        await sqlQuery(sqlStr2,[rolename,id])
    })
    res.json({
        'state':'ok',
        'content':'数据插入成功'
    })
})

module.exports = router;
