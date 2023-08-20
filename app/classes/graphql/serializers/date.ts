import { GraphQLScalarType } from "graphql/type"
import { Kind } from "graphql/language"

export const DateType = new GraphQLScalarType({
  name: "Date",
  //@ts-ignore
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10)
    }
    return null
  },
  //@ts-ignore
  parseValue(value: string): Date {
    return new Date(value)
  },
  //@ts-ignore
  serialize(value: string | Date): string {
    return typeof value === "string" ? value : value.toISOString()
  }
})
