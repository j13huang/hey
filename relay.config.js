module.exports = {
  // ...
  // Configuration options accepted by the `relay-compiler` command-line tool and `babel-plugin-relay`.
  src: "./ui",
  language: "typescript",
  schema: "./graphql/schema.graphql",
  eagerEsModules: true,
  exclude: ["**/node_modules/**", "**/__mocks__/**", "**/__generated__/**"],
};
