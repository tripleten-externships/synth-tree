import { builder } from "./graphql/builder";
import './graphql/lesson/lessonType'
import './graphql/lesson/lesson.queries'
import { generateAllCrud } from "./graphql/__generated__/autocrud";

generateAllCrud({ exclude: ['Lesson'] });


builder.queryType({});
builder.mutationType({});

export const schema = builder.toSchema({});
