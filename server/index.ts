import * as Koa from 'koa';
import * as serve from 'koa-static';

const app = new Koa();

app.use(async (ctx) => { console.log("hello world");
console.log(ctx.request.href)
//ctx.body = 'Hello World';
});

app.use(serve(__dirname + '/ui'));

app.listen(3000);
console.log('listening on port 3000');