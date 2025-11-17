import { builder } from "./graphql/builder";
import "./graphql/lesson/lessonType";
import "./graphql/lesson/lesson.queries";
import { generateAllCrud } from "./graphql/__generated__/autocrud";
import './graphql/lesson/lesson.mutations'

generateAllCrud({ exclude: ["Lesson"] });

builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
