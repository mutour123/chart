const path = require('path')

const rt = require('./controller/router')
const static = require('koa-static')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const render = require('koa-ejs')

const config = require('./config')
const util = require('./utl')


const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 0,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}


const koa = require('koa')
const app = new koa()
app.keys = ['some secret hurr']

app.use(bodyParser())
app.use(session(CONFIG, app))
app.use(router.routes())
app.use( static(path.join(__dirname+ "/static")));
render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'chart',
    viewExt: 'html',
    cache: false,
    debug: false
});
const server = require('http').Server(app.callback()),
    io = require('socket.io')(server)


router.get('/', rt.root)
router.post('/loginhandler', rt.loginHandler)
router.get('/chart', rt.chart)
io.on("connection",function (socket) {
    socket.on("login",function (msg) {
        //将socket对象保存着，以便单聊使用
        config.onlineSocket.set(msg, socket)

        //如果是自己刷新，就不返回user: msg
        let loginMsg;
        if (util.isInArray(msg, config.onlineList)) {//主要是用户欢迎用户登录
            loginMsg = {
                onlineNum: config.onlineNum,
                onlineList: [...config.onlineList]
            }
        }else {
            loginMsg = {
                user: msg,
                onlineNum: config.onlineNum,
                onlineList: [...config.onlineList]
            }
        }
        loginMsg = JSON.stringify(loginMsg)
        io.emit("welcomeMes",loginMsg)
    })

    socket.on('message', function (msg) {
        msg = JSON.parse(msg)
        console.log(msg)
        if (msg.toUser) {//发给单个人
            var msgTo = {
                msgVal: msg.msgVal,
                from: msg.sendUser
            }
            msgTo = JSON.stringify(msgTo)
            config.onlineSocket.get(msg.toUser).emit('toMe', msgTo)
        }else{
            msg = JSON.stringify(msg)
            io.emit('someMsg', msg)
        }
    })
})



server.listen('3000', function () {
    console.log('server is running at port 3000...')
})
