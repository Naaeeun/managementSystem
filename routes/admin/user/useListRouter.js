var express = require('express');
const sqlQuery = require('../../../module/mysql');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
    let page = req.query.page
    page = page ? page:1
    let sqlStr = 'select * from user limit ?,5'
    let result = await sqlQuery(sqlStr,[(parseInt(page)-1)*5])
    let options = {
        userlist:Array.from(result)
    }
    res.render('admin/user/userlist1',options)
});

router.post('/deluser',async (req,res)=>{
    let dellist = req.body['dellist[]']
    dellist.forEach((item,i)=>{
        let sqlStr = 'delete from user where id = ?'
        sqlQuery(sqlStr,item)
    });
    console.log(dellist)
    res.json({
        state:"ok",
        content:"删除成功"
    })
})



 

module.exports = router;
