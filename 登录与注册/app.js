const express = require('express');
const app = express();

//接收body数据
app.use(express.urlencoded({ extended: false }));


//实现跨越资源共享
const cors = require('cors');
app.use(cors());

//解析Token
const expressJWT = require('express-jwt');
const config = require('./config');

app.use(expressJWT({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({ path: [/^\/api\//] }))

//导入路由器
const user = require('./router/user');
app.use('/api', user)


app.listen(3030, () => {
    console.log('success! http://127.0.0.1:3030');
})