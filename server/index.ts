import * as Koa from "koa";
import * as mount from "koa-mount";
import { graphqlHTTP } from "koa-graphql";
import { schema } from "./graphql/schema";

const app = new Koa();

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

app.use(async (ctx) => {
  console.log("hello world");
  console.log(ctx.request.href);
  console.log(ctx.request.toJSON());
  //ctx.body = 'Hello World';
});

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    err.status = err.statusCode || err.status || 500;
    throw err;
  }
});

app.listen(3001);
console.log("listening on port 3001");
