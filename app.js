const path = require('path')

const rt = require('./controller/router')
const static = require('koa-static')
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const session = require('koa-session');
const render = require('koa-ejs');

const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


const koa = require('koa')
const app = new koa()
app.keys = ['some secret hurr'];
app.use(bodyParser())
app.use(session(CONFIG, app));
app.use(router.routes());
app.use( static(path.join(__dirname+ "/static")));
render(app, {
    root: path.join(__dirname, 'view'),
    layout: 'chart',
    viewExt: 'html',
    cache: false,
    debug: false
});
const server = require('http').Server(app.callback()),
    io = require('socket.io')(server);


router.get('/', rt.root)
router.post('/loginhandler', rt.loginHandler)
router.get('/chart', rt.chart);
io.on("connection",function (socket) {

    socket.on("login",function (msg) {
        io.emit("welcomeMes",msg);
    })

    socket.on('message', function (msg) {
        console.log(msg);
        io.emit('someMsg', msg);
    })
})



server.listen('3000', function () {
    console.log('server is running at port 3000...')
})
