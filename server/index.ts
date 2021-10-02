import * as Koa from "koa";

const app = new Koa();

app.use(async (ctx) => {
  console.log("hello world");
  console.log(ctx.request.href);
  //ctx.body = 'Hello World';
});

app.listen(3001);
console.log("listening on port 3001");
