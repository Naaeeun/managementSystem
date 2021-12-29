let mysql = require('mysql')
let options = {
    host:"localhost",
    port:"3306",
    user:"root",
    password:"1234",
    database:"医院管理"
}
let con = mysql.createConnection(options)
con.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log('数据库连接成功')
    }
})
async function sqlQuery(strSql,arr){
    return new Promise((resolve,reject)=>{
        con.query(strSql,arr,(err,results)=>{
            if(err){
                reject(err)
            }else{
                resolve(results)
            }
        })
    })
}
module.exports = sqlQuery