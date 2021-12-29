var express = require('express');
var router = express.Router();
var crypto = require('crypto')
var sqlQuery = require('../../module/mysql')

function jiami(str){
    let salt = "fasnijqnfeqdfqw"
    let obj = crypto.createHash('md5')
    str = salt+str
    obj.update(str)
    return obj.digest('hex')
}

/* GET users listing. */
router.get('/login', function(req, res, next) {
    res.render('login/login.ejs')
});

router.get('/register', function(req, res, next) {
    res.render('login/register.ejs')
});


router.post('/register',async (req,res)=>{
    let username = req.body.username
    let password = req.body.password
    let sqlStr = "select * from user where username = ?"
    let result =  await sqlQuery(sqlStr,[username])
    
    if(result.length!=0){
        res.render('info/info.ejs',{
            title:"注册失败",
            content:"用户已存在",
            href:"/rl/register",
            hrefTxt:"注册页"
        })
    }else{
        sqlStr = "insert into user (username,password,roleid) values(?,?,1)"
        await sqlQuery(sqlStr,[username,jiami(password)]) 
        res.render('info/info.ejs',{
            title:"注册成功",
            content:"即将进入登录页面",
            href:"/rl/login",
            hrefTxt:"登录页"
        })

    }

})

router.post('/login',async (req,res)=>{
    let sqlStr = "select * from user where username=? and password=?"
    let username = req.body.username
    let password = req.body.password
    let result = await sqlQuery(sqlStr,[username,jiami(password)])
    if(result.length==0){
        res.render('info/info.ejs',{
            title:"登录失败",
            content:"用户或密码错误",
            href:"/rl/login",
            hrefTxt:"登录页"
        })
    }else{
        req.session.username = username
        res.render('info/info.ejs',{
            title:"登录成功",
            content:"即将跳转至后台页面",
            href:"/admin",
            hrefTxt:"后台"
        })
    }
})

//退出登录
router.get('/loginout',(req,res)=>{
    req.session.destroy()
    res.render('info/info.ejs',{
        title:"退出登录成功",
        content:"即将跳转至登录页面",
        href:"/rl/login",
        hrefTxt:"登录"
    })
})

module.exports = router;
