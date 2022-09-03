import * as fs from "fs";
import { printSchema } from "graphql";
import { schema } from "../server/graphql/schema";

fs.writeFileSync("graphql/schema.graphql", printSchema(schema));
