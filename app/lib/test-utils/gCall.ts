import { generateSchema } from "@app/lib/generateSchema"
import { DocumentNode, ExecutionResult, graphql, Source } from "graphql"
import { User } from "@app/models/user.model"
import generateContext from "@app/classes/graphql/middleware/generateContext"
import { expect } from "@jest/globals"
import { GraphQLSchema } from "graphql/type"

interface Options {
  source: string | Source | DocumentNode
  variableValues?: Record<string, any>
  userId?: string
  user?: User
  token?: string
}

export function getGqlString(doc: DocumentNode): string {
  return doc.loc && doc.loc.source.body ? doc.loc.source.body : ""
}

let schema: GraphQLSchema | null = null

export async function gCall<T>({
  source,
  variableValues,
  userId,
  user,
  token
}: Options): Promise<ExecutionResult<T | any>> {
  if (!schema) schema = await generateSchema()
  return graphql({
    schema,
    source:
      typeof source === "string" ? source : getGqlString(<DocumentNode>source),
    variableValues,
    contextValue: await generateContext({
      req: {
        headers: {
          authorization: token ?? "",
          "x-tpu-client": "TestSuite",
          "x-tpu-client-version": "0.0.1"
        },
        ip: "10.0.0.1"
      },
      request: {
        headers: {
          get: (key: string) => {
            if (key === "X-TPU-Client") return "TestSuite"
            if (key === "X-TPU-Client-Version") return "0.0.1"
            if (key === "Authorization") return token ?? ""
            return ""
          }
        }
      }
    })
  })
}

export function errorConverter(message?: string, code?: string) {
  if (!message && !code)
    throw new Error("You must provide either a message or a code")
  return {
    message: message ?? expect.any(String),
    locations: [
      {
        line: expect.any(Number),
        column: expect.any(Number)
      }
    ],
    path: [expect.any(String)],
    ...(code
      ? {
          extensions: {
            code
          }
        }
      : {})
  }
}
