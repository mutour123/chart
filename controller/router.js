const modules = require('../module/index')
const config = require('../config')

exports.chart = async ctx => {
    if (!ctx.session.nickname){
        ctx.response.redirect('/')
    }else {
        await ctx.render('chart', {
            user: ctx.session.nickname,
            onlineNum: config.onlineNum
        })
    }
}

exports.root = async ctx => {
    let data = await modules.getLogin()
    ctx.body = data
}

exports.loginHandler = async ctx => {
    let nickname = ctx.request.body.nickname
    if (config.onlineList.has(nickname)){//如果已经存在
        ctx.body="用户已存在"
    }else{//在服务器创建用户
        ctx.session.nickname = nickname//写入session
        config.onlineList.add(nickname)//存放到服务器上表示此人在线
        ++config.onlineNum//在线人数加一
        ctx.response.redirect('/chart')//重定向到chart
    }
}

