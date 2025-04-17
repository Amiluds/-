const express = require('express');

const router = express.Router();

//导入函数模块
const router_handler = require('../router_handler/user')
//注册
router.post('/reguser', router_handler.reguser)

//登录
router.get('/login', router_handler.login)


module.exports = router