//连接数据库
const db = require('../db/index')

//导入bcryptjs包进行加密
const bcrypt = require('bcryptjs')

//导入jsonwebtoken
const jwt = require('jsonwebtoken')

//注册
exports.reguser = (req, res) => {
    res.setHeader('Access-control-Allow-Origin', '*');
    res.setHeader('Access-control-Allow-Headers', '*');

    // 检查用户名和密码是否为空
    if (!req.body.username || !req.body.password) {
        return res.send('username与password不能为空');
    }

    // 检查密码与确认密码是否一致
    if (req.body.password !== req.body.confirmPassword) {
        return res.send('密码与确认密码不一致');
    }

    // 查询用户名是否被占用
    const sql = 'select * from ev_users where username=?';
    db.query(sql, [req.body.username], (err, results) => {
        if (err) return res.send(err);
        if (results.length > 0) return res.send('用户名已被占用,注册失败');

        // 给密码加密
        req.body.password = bcrypt.hashSync(req.body.password);

        // 注册
        const sql = 'insert into ev_users set ?';
        db.query(sql, [{ username: req.body.username, password: req.body.password }], (err, results) => {
            if (err) return res.send(err);
            if (results.affectedRows !== 1) return res.send('注册失败,请重新注册');

            res.send('注册成功');
        });
    });
}

//登录
exports.login = (req, res) => {
    res.setHeader('Access-control-Allow-Origin', '*');
    res.setHeader('Access-control-Allow-Headers', '*');

    console.log(req.query);

    const sql = 'select * from ev_users where username=?';

    db.query(sql, req.query.username, (err, results) => {
        if (err) return res.send(err);
        const user = { ...results[0], password: '', user_pic: '' };
        console.log(user);
        if (results.length !== 1) return res.send('没有该用户名,请先注册！');

        const compareResult = bcrypt.compareSync(req.query.password, results[0].password);

        if (!compareResult) return res.send('密码错误,登录失败');
        const jwtSecretKey = 'wenlifen No1 <>';
        const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn: '10h' });

        res.send({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + tokenStr
        });
    });
}