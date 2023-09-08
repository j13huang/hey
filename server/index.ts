import * as Koa from "koa";
import * as mount from "koa-mount";
import { graphqlHTTP } from "koa-graphql";
import { schema } from "./graphql/schema";

const app = new Koa();

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
    }),
  ),
);

app.use(async (ctx) => {
  console.log("hello world");
  console.log(ctx.request.href);
  console.log(ctx.request.toJSON());
  //ctx.body = 'Hello World';
});

app.listen(3001);
console.log("listening on port 3001");
