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
  password: '12345',
  database: 'acz_mini'
})
connection.connect();

var stus = [];
let count = 0;

app.get('/stus', (req, res) => {
  console.log(++count + '. 正在访问接口' + req.url + "......");
  getStus();
  res.json(stus)
  res.end()
})

app.get('/inState', (req, res) => {
  console.log(++count + '. 正在访问接口' + req.url + "......");
  const {state,no} = req.query
  inState(state,no);
  res.end()
})

app.get('/getState',(req,res) => {
  console.log(++count + '. 正在访问接口' + req.url + "......");
  const {no} = req.query;
  let selSql = `SELECT * FROM kaoqin WHERE stuNo = ${no} ORDER BY id desc LIMIT 1`;
  new Promise( (resolve, reject) => {
    connection.query(selSql,(err, results) => {
      if(err) reject(err);
      console.log('[SUCCESS]'+selSql);
      resolve(results[0])
    })
  }).then(result=>{
    res.json(result);
    res.end();
  })
})

app.get('/getStateList',(req,res) => {
  console.log(++count + '. 正在访问接口' + req.url + "......");
  const {date,nums} = req.query;
  let selSql = `SELECT k.id,k.state,k.datetime,s.sName FROM kaoqin k,stus s WHERE s.sNo = k.stuNo AND DATE_FORMAT(k.datetime,'%Y-%m-%d') = '${date}'  ORDER BY id desc LIMIT 0,${nums}`;
  new Promise( (resolve, reject) => {
    connection.query(selSql,(err, results) => {
      if(err) reject(err);
      console.log('[SUCCESS]'+selSql);
      resolve(results)
    })
  }).then(result=>{
    res.json(result);
    res.end();
  })
})

app.get('/inPj',(req, res) => {
  console.log(++count + '. 正在访问接口' + req.url + "......");
  const {subject,week,stuNo,contentId,stars} = req.query;
  inPj(subject,week,stuNo,contentId,stars);
  res.end();
})

app.get('/getPj',(req, res) => {
  console.log(++count + '. 正在访问接口' + req.url + "......");
  const {stuNo} = req.query;
  let sql = `SELECT * FROM (SELECT * FROM pj WHERE stuNo = '${stuNo}' ORDER BY id DESC) a GROUP BY contentId `;
  new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if(err) reject(err);
      console.log('[SUCCESS]'+ sql);
      resolve(results)
    })
  }).then(result => {
    res.json(result);
    res.end();
  })
})

app.get('/getPjContent', (req, res) => {
  console.log(++count + '. 正在访问接口' + req.url + "......");
  let sql = `SELECT * FROM pj_content`;
  new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if(err) reject(err);
      console.log('[SUCCESS]'+sql);
      resolve(results);
    })
  }).then(result=>{
    res.json(result)
    res.end();
  })
})

app.listen(3000, '127.0.0.1')

function getStus() {
  let sql = 'SELECT s.sNo,s.sName,s.grade,s.classes,s.headPortraitUrl,s.checked,s.sSex,s.sAge,s.address,s.sIdNum,s.inDate,s.pName,s.pPhone FROM stus s';
  connection.query(sql, (error, results) => {
    stus = [];
    results.forEach(function (val, index) {
      let data = {
        stuNo: '',
        stuName: '',
        grade: '',
        classes: '',
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
      data.grade = val.grade;
      data.classes = val.classes;
      data.headPortraitUrl = val.headPortraitUrl;
      data.checked = eval(val.checked.toLowerCase());
      data.stu_details.sex = val.sSex;
      data.stu_details.age = val.sAge;
      data.stu_details.address = val.address;
      data.stu_details.IDNum = val.sIdNum;
      data.stu_details.inDate = val.inDate;
      data.stu_details.parents.name = val.pName;
      data.stu_details.parents.phone = val.pPhone;
      stus.push(data)
    })
  })
}

function inState(state,no) {
  // 数据库插入数据
  let inSql = `INSERT into kaoqin(stuNo,datetime,state) VALUES('${no}',CURRENT_TIMESTAMP,${state})`;
  connection.query(inSql, (err, results) => {
    if(err){
      throw err;
    }else {
      console.log('[SUCCESS]'+inSql);
    }
  })
}

function getState(no) {
  // 数据库获取数据
  let selSql = `SELECT * FROM kaoqin WHERE stuNo = ${no} ORDER BY id desc LIMIT 1`;
  let stuState = {
    stuNo: '',
    datetime: '',
    state: ''
  };
  return connection.query(selSql, (err, results) => {
    if(err){
      throw err;
    }else {
      console.log('[SUCCESS]'+selSql);
      const data = results[0];
      stuState.stuNo = data.stuNo;
      stuState.datetime = data.datetime;
      stuState.state = data.state;
      // console.log(stuState)
    }
  })
}

function inPj(subject,week,stuNo,contentId,stars){
  let sql = `INSERT into pj(stuNo,week,subject,contentId,stars) VALUES('${stuNo}',${week},${subject},'${contentId}',${stars})`;
  connection.query(sql, (err, results) => {
    if(err) throw err;
    console.log('[SUCCESS]'+sql);
  })
}
