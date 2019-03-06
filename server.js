const Koa = require('koa')
const views = require('koa-views')
const static = require('koa-static');
const router = require('koa-router')()
const https = require('https')
const fs = require('fs')

const app = new Koa()
const options = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem')
}

/* 静态文件服务器中间件 */
app.use(static('./static'))

/* 配置模版引擎中间件 */
app.use(views('views',{ extension:'ejs' })) // 如果这样配置不修改html后缀g改成ejs
// app.use(views('views',{ map:{ html:'ejs' } })) // 如果这样配置不修改html后缀

// 公共数据，每个路由里面都要该数据
app.use(async (ctx, next) => {
  ctx.state = {
    userName: 'cloud'
  }

  await next() // 继续向下匹配路由
})

router.get('/', async (ctx) => {
  let title = '你好ejs'
  let list = ['china', 'like', 'love', 'hi']
  let content = '<h2>这是一个h2</h2>'
  let num = 10
  await ctx.render('login/index', {
    title, list, content, num
  })
})

// 作用:启动路由
app.use(router.routes())
// 作用:这是官方文档的推荐用法,我们可以看到 router.allowedMethords() 用在 router.routes() 之后,
// 所有,在当所有的路由中间件最后使用.此时根据 ctx.status 设置 response 响应头
app.use(router.allowedMethods())

https.createServer(options, app.callback()).listen(3001)
