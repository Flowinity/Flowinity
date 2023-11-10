import { afterAll, beforeAll, expect, test, jest } from "@jest/globals"
import "@app/lib/init-tests"
import { Container } from "typedi"
import { Context } from "@app/types/graphql/context"
import { gCall, getGqlString } from "@app/lib/test-utils/gCall"
import { CoreStateQuery } from "../../../frontend/src/graphql/core/state.graphql"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { SetExperimentInput } from "@app/classes/graphql/core/setExperiment"
import { getUser, TestUser, testUser } from "@app/lib/test-utils/testUser"
import { SetExperimentMutation } from "../../../frontend/src/graphql/core/experiments.graphql"
import { CoreResolver } from "@app/controllers/graphql/core.resolver"
import { resetState } from "@app/lib/init-tests"

let user: TestUser | null = null

test("Get core state", async () => {
  const state = await gCall({
    source: CoreStateQuery
  })
  expect(state.errors).toBeUndefined()
  expect(state).toMatchObject({
    data: {
      coreState: {
        name: "PrivateUploader",
        server: expect.any(String),
        domain: "localhost",
        connection: {
          ip: "10.0.0.1"
        }
      },
      experiments: expect.any(Array)
    }
  })
})

test("Get setup step", async () => {
  const state = await gCall({
    source: `
      query GetSetupStep {
        setupStep
      }
    `
  })
  expect(state.errors).toBeUndefined()
  expect(state.data?.setupStep).toBe(-1)
})

test("Set experiments", async () => {
  // Permitted experiment, test "PRIDE"
  const state = await gCall({
    source: SetExperimentMutation,
    variableValues: {
      input: {
        key: "PRIDE",
        value: 1
      }
    },
    token: user?.token
  })
  expect(state.errors).toBeUndefined()
  expect(state.data.setExperiment).toMatchObject({
    key: "PRIDE",
    value: "1"
  })

  // Test "PRIDE" is set
  const state2 = await gCall({
    source: CoreStateQuery,
    token: user?.token
  })
  expect(state2.errors).toBeUndefined()
  expect(state2.data?.experiments).toContainEqual({
    createdAt: "2023-11-08T00:00:00.000Z",
    description: "Enable pride theme.",
    id: "PRIDE",
    value: 1
  })

  // Set it back to 0
  await gCall({
    source: SetExperimentMutation,
    variableValues: {
      input: {
        key: "PRIDE",
        value: 0
      }
    }
  })

  // Test an invalid experiment
  const state3 = await gCall({
    source: SetExperimentMutation,
    variableValues: {
      input: {
        key: "INVALID",
        value: 1
      }
    }
  })
  expect(state3.errors).toBeDefined()
})

beforeAll(async () => {
  user = await getUser()
  await resetState()
})
