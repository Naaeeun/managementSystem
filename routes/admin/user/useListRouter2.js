var express = require('express');
var router = express.Router();
var sqlQuery = require('../../../module/mysql')

var fs = require('fs')
var jiami = require('../../../module/jiami')
//配置上传
let multer = require('multer')
let upload = multer({dest:"./public/upload"})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/user/userlist2')
});


router.get('/api/userlist',async (req,res)=>{
  let page = parseInt(req.query.page)
  let limitNum = parseInt(req.query.limit)
  let sqlStr = "select `user`.id,`user`.username,`user`.email,`user`.mobile,`user`.imgheader,`user`.roleid,role.rolename from user LEFT JOIN role on `user`.roleid = role.id limit ?,?"
  let arr = [(page-1)*limitNum,limitNum]
  let result = await sqlQuery(sqlStr,arr)
  let sqlStr1 = "select count(id) as usernum from user"
  let result1 = await sqlQuery(sqlStr1)
  let count = result1[0].usernum
  let options = { 
      "code":0,
      "msg":"",
      "count":count,
      "data":Array.from(result)
  }
  res.json(options)
})


router.get('/edituser',async (req,res)=>{
  let userid = req.query.id
  let sqlStr = 'select * from user where id = ?'
  let result =  await sqlQuery(sqlStr,[userid])
  let user = result[0]
  let roles = await getRoles()
  let options = {user,roles}
  res.render('admin/user/userinfo',options)
})

router.post('/selfimgupload',upload.single('imgfile'),async (req,res)=>{
  let result = rename(req)
  //将改名后的结果上传到数据库
  let username = req.query.username
  let strSql = 'update user set imgheader = ? where username = ?'
  await sqlQuery(strSql,[result.imgUrl,username])
  res.json(result)
})

router.post('/addimgupload',upload.single('imgfile'),async (req,res)=>{
  let result = rename(req)
  //将改名后的结果上传到数据库
  let username = req.query.username
  res.json(result)
})


function rename(req){
  //console.log(req.file)
  let oldPath = req.file.destination+"/"+req.file.filename
  let newPath = req.file.destination+"/"+req.file.filename+req.file.originalname
  fs.rename(oldPath,newPath,()=>{
      //console.log("改名成功")
  })
  return {
    state:'ok',
    imgUrl:"/upload/"+req.file.filename+req.file.originalname
  }
}
async function getRoles(){
  let sqlStr = 'select * from role'
  let result = await sqlQuery(sqlStr)
  return Array.from(result)
}

router.get('/adduser',async (req,res)=>{
  let roles = await getRoles()
  let options = {roles}
  res.render('admin/user/adduser',options)
})
router.post('/adduser',async (req,res)=>{
  let username = req.body.username
  let sqlStr1 = 'select * from user where username = ?'
  let result1 = await sqlQuery(sqlStr1,[username])
  if(result1.length == 0 ){
    let sqlStr = 'insert into user (username,password,email,mobile,roleid,imgheader) values(?,?,?,?,?,?)'
    let arr = [username,jiami(req.body.password),req.body.email,req.body.mobile,req.body.roleid,req.body.imgheader]
    await sqlQuery(sqlStr,arr)
    res.json({
      state:"ok",
      content:"个人信息更新成功"
    })
  }else{
    res.json({
      state:"fail",
      content:"此用户名已使用"
    })
  }
 
})

router.get('/deluser',async (req,res)=>{
  let userid = req.query.userid
  let sqlStr = 'delete from user where id = ?'
  let result = await sqlQuery(sqlStr,[userid])
  res.json({
    state:'ok',
    content:Array.from(result)
  })
})

module.exports = router;
