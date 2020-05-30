
let db = require('mysql')
let express = require('express')

let app = express()

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

let connection = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'acz'
})

connection.connect();
let sql = 'SELECT s.sNo,s.sName,s.headPortraitUrl,s.checked,d.sSex,d.sAge,d.sAddress,d.sIdNum,d.sInDate,p.pName,p.pPhone FROM stus s,stu_details d,stu_parent p WHERE s.sNo = d.sNo and s.sNo = p.sNo';

connection.query(sql, (error, results, fields) => {
    if (!error) {
        app.get('/stus', (req, res) => {
            //将数据库信息返回前台
            var stus = [];
            results.forEach(function (val, index) {
                let data = {
                    stuNo: '',
                    stuName: '',
                    headPortraitUrl: '',
                    checked: '',
                    stu_details: {
                        sex: '',
                        age: '',
                        address: '',
                        IDNum: '',
                        inDate: '',
                        parents: {
                            name: '',
                            phone: ''
                        }
                    }
                };
                data.stuNo = val.sNo;
                data.stuName = val.sName;
                data.headPortraitUrl = val.headPortraitUrl;
                data.checked = eval(val.checked.toLowerCase());
                data.stu_details.sex = val.sSex;
                data.stu_details.age = val.sAge;
                data.stu_details.address = val.sAddress;
                data.stu_details.IDNum = val.sIdNum;
                data.stu_details.inDate = val.sInDate;
                data.stu_details.parents.name = val.pName;
                data.stu_details.parents.phone = val.pPhone;
                stus.push(data)
            })
            res.json(stus)
            console.log('正在访问接口……')
            // 打印前台数据
            console.log(req.query)
        }).listen(3000, '127.0.0.1')
    }
});