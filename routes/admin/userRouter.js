var express = require('express');
var router = express.Router();
var sqlQuery = require('../../module/mysql')
var jiami = require('../../module/jiami')
var fs = require('fs')
var userListRouter = require('./user/useListRouter')
var userListRouter2 = require('./user/useListRouter2')
var authListRouter = require('./user/authListRouter')
var roleListRouter = require('./user/roleListRouter')

//引入上传模块
let multer = require('multer')
//配置上传
let upload = multer({dest:"./public/upload"})
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('用户管理');
});

//个人信息路由
router.get('/selfinfo',async (req,res)=>{
  let username = req.session.username
  let sqlStr = 'select * from user where username = ?'
  let result =  await sqlQuery(sqlStr,[username])
  let user = result[0]
  let roles = await getRoles()
  let options = {user,roles}
  res.render('admin/user/selfinfo',options)
})


router.post('/selfimgupload',upload.single('imgfile'),async (req,res)=>{
  let result = rename(req)
  //将改名后的结果上传到数据库
  let username = req.session.username
  let strSql = 'update user set imgheader = ? where username = ?'
  await sqlQuery(strSql,[result.imgUrl,username])
  res.json(result)
})

router.post('/selfinfo',async (req,res)=>{
  console.log(req.body)
  let sqlStr = 'update user set password = ?,email = ?,mobile = ?,roleid = ? where username = ?'
  let arr = [jiami(req.body.password),req.body.email,req.body.mobile,req.body.roleid,req.body.username]
  await sqlQuery(sqlStr,arr)
  res.json({
    state:'ok',
    content:'个人信息更新成功'
  })

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

router.use('/userlist1',userListRouter)
router.use('/userlist2',userListRouter2)
router.use('/authlist',authListRouter)
router.use('/rolelist',roleListRouter)
module.exports = router;
