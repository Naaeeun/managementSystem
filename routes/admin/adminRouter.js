var express = require('express');
var router = express.Router();
var userRouter = require('./userRouter')
var newsRouter = require('./newsRouter')
var doctorRouter = require('./doctorRouter')
var patientsRouter = require('./patientsRouter');
const sqlQuery = require('../../module/mysql');

//判断是否符合条件进入后台中间件
function permisson(req,res,next){
  if(req.session.username ==undefined){
    res.render('info/info.ejs',{
      title:"尚未登录",
      content:"请重新登录,即将进入登录页",
      href:"/rl/login",
      hrefTxt:"登录页"
    })
  }else{
    next()
  }
}

/* GET users listing. */
router.get('/', permisson,function(req, res, next) {
  res.render('admin/admin.ejs',{
    username:req.session.username
  })
});
//设置后台权限的中间件
async function adminAuth(req,res,next){
  let username = req.session.username
  let sqlStr = 'select * from auth where id in (select authid from role_auth where roleid = (select roleid from user where username = ?))'
  let result = await sqlQuery(sqlStr,[username])
  let resultArr = Array.from(result)
  let httpurl = req.originalUrl
  let isAllow = resultArr.some((item,i)=>{
    return new RegExp("^"+item.authurl).test(httpurl)
  })
  if(isAllow){
    next()
  }else{
    res.render('info/info.ejs',{
      title:"无法访问",
      content:"没有权限访问该页面,请联系管理员",
      href:"/",
      hrefTxt:"首页"
    })
  }
}
// router.use(adminAuth)

//后台用户管理模块
router.use('/user',permisson,adminAuth,userRouter)
//后台新闻管理
router.use('/news',permisson,adminAuth,newsRouter)
//后台医生管理
router.use('/doctor',permisson,adminAuth,doctorRouter)
//后台患者管理
router.use('/patients',permisson,adminAuth,patientsRouter)
module.exports = router;
