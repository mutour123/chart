const modules = require('../module/index')


exports.chart = async ctx => {
     await ctx.render('chart', {
         user: ctx.session.nickname
     })
}

exports.root = async ctx => {
    let data = await modules.getLogin()
    ctx.body = data
}

exports.loginHandler = async ctx => {
    let nickname = ctx.request.body.nickname
    ctx.session.nickname = nickname;
    ctx.response.redirect('/chart');
}

