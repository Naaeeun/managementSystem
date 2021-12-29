var express = require('express');
var router = express.Router();
let sqlQuery = require('../../module/mysql')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/news/newslist')
});

router.get('/newslist/addnews',(req,res)=>{
  res.render('admin/news/addnews')
})

router.post('/newslist/addnews1',async (req,res)=>{
  let title = req.body.title
  let author = req.body.author
  let pubtime = new Date().getTime()
  let content =  req.body.content
  let sqlStr = "insert into article (title,author,pubtime,content) values (?,?,?,?)"
  await sqlQuery(sqlStr,[title,author,pubtime,content])
  res.send('页面上传成功')
})

router.get('/newslist/newspage',async (req,res)=>{
  let sqlStr = 'select * from article limit 0,1'
  let result = await sqlQuery(sqlStr)
  let options = {
    article:result[0]
  }
  res.render('admin/news/newspage',options)
})

module.exports = router;
