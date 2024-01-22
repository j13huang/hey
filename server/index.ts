import * as Koa from "koa";
import * as mount from "koa-mount";
import { createHandler } from "graphql-http/lib/use/koa";
import * as koaRouter from "@koa/router";
//import * as koaBodyparser from "koa-bodyparser";
//import { graphqlHTTP } from "koa-graphql";
import { schema } from "./graphql/schema";
import koaPlayground from "graphql-playground-middleware-koa";

const app = new Koa();
app.use(mount("/graphql", createHandler({ schema })));

const router = new koaRouter();
//app.use(koaBodyparser());
router.all(
  "/playground",
  koaPlayground({
    endpoint: "/graphql",
    settings: {
      //"schema.polling.enable": false
    },
  }),
);

/*
function formatError(error) {
  const errorDetails = error.message.startsWith("{") ? JSON.parse(error.message) : error.message;
  return {
    message: errorDetails.text,
    locations: error.locations,
    stack: error.stack ? error.stack.split("\n") : [],
    path: error.path,
    errorCode: errorDetails.code ?? 500,
  };
}

app.use(
  mount(
    "/graphql",
    graphqlHTTP({
      schema: schema,
      graphiql:
        process.env.NODE_ENV === "production"
          ? false
          : {
              editorTheme: "ambiance",
            },
      customFormatErrorFn: formatError,
    }),
  ),
);
*/

/*
app.use(async (ctx, next) => {
  console.log("hello world");
  //console.log(ctx.request.href);
  //console.log(ctx.request.toJSON());
  //ctx.body = "Hello World";
});
*/

app.use(router.routes()).use(router.allowedMethods());

/*
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log("caught error", err);
    err.status = err.statusCode || err.status || 500;
    throw err;
  }
});
*/

app.on("error", (err) => {
  console.log("caught error", err);
  //err.status = err.statusCode || err.status || 500;
});

app.listen(3001);
console.log("listening on port 3001");
