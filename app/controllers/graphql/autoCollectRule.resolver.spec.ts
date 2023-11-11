import "@app/lib/init-tests"
import { AutoCollectRuleResolver } from "@app/controllers/graphql/autoCollectRule.resolver"
import supertest from "supertest"
import { getUser, TestUser } from "@app/lib/test-utils/testUser"
import { describe, test, beforeAll, expect } from "@jest/globals"
import { resetState } from "@app/lib/init-tests"
import { Container } from "typedi"
import { Application } from "@app/app"
import { AutoCollectControllerV3 } from "@app/controllers/v3/autoCollect.controller"
import { gCall } from "@app/lib/test-utils/gCall"
import { CreateCollectionMutation } from "../../../frontend-v5/src/graphql/collections/createCollection.graphql"
import {
  connectSocket,
  waitForSocketEvent
} from "@app/lib/test-utils/socketHelper"
import { Socket } from "socket.io-client"
import { AutoCollectsQuery } from "../../../frontend-v5/src/graphql/autoCollects/getAutoCollects.graphql"
import { GalleryQuery } from "../../../frontend-v5/src/graphql/gallery/gallery.graphql"
import {
  AutoCollectAction,
  GalleryType
} from "../../../frontend-v5/src/gql/graphql"
import { ActAutoCollectsMutation } from "../../../frontend-v5/src/graphql/autoCollects/actAutoCollects.graphql"

let req: supertest.SuperTest<supertest.Test> | null = null
let user: TestUser | null = null
let collectionId = 0
let ruleId = 0
let socketClient: Socket | null = null
let uploadId = 0
let itemId = 0

describe("AutoCollectRuleResolver", () => {
  beforeAll(async () => {
    const collection = await gCall({
      source: CreateCollectionMutation,
      token: user?.token,
      variableValues: {
        input: {
          name: "Test Collection"
        }
      }
    })
    expect(collection.errors).toBeUndefined()
    expect(collection.data?.createCollection).toMatchObject({
      id: expect.any(Number)
    })
    collectionId = collection.data?.createCollection.id
  })
  // Legacy API
  async function create() {
    const data = await req!
      .post("/api/v3/autoCollects/rules")
      .send({
        name: "test",
        enabled: true,
        collectionId,
        requireApproval: true
      })
      .set("Authorization", user!.token)

    ruleId = data.body.id

    const data2 = await req!
      .put(`/api/v3/autoCollects/rules/${ruleId}`)
      .send({
        rules: [
          {
            id: 1,
            rules: [
              {
                id: 1,
                operator: "contains",
                type: "metadata",
                value: "This file"
              }
            ]
          }
        ]
      })
      .set("Authorization", user!.token)

    expect(data.body).toMatchObject({
      id: expect.any(Number),
      name: "test"
    })
  }
  test("Create AutoCollect rule (legacy)", async () => {
    await create()
  })

  test("Get AutoCollect rules (legacy)", async () => {
    const data = await req!
      .get("/api/v3/autoCollects/rules")
      .set("Authorization", user!.token)

    expect(data.body).toMatchObject([
      {
        id: expect.any(Number),
        name: "test"
      }
    ])
  })

  test("Update AutoCollect rule (legacy)", async () => {
    const data = await req!
      .put(`/api/v3/autoCollects/rules/${ruleId}`)
      .send({
        name: "test2"
      })
      .set("Authorization", user!.token)

    expect(data.body).toMatchObject({
      id: ruleId,
      name: "test2"
    })

    const data2 = await req!
      .get("/api/v3/autoCollects/rules")
      .set("Authorization", user!.token)

    expect(data2.body).toMatchObject([
      {
        id: expect.any(Number),
        name: "test2"
      }
    ])
  })

  test("Delete AutoCollect rule (legacy)", async () => {
    const data = await req!
      .delete(`/api/v3/autoCollects/rules/${ruleId}`)
      .set("Authorization", user!.token)

    expect(data.statusCode).toBe(204)

    const data2 = await req!
      .get("/api/v3/autoCollects/rules")
      .set("Authorization", user!.token)

    expect(data2.body).toMatchObject([])

    await create()
  })

  test("Upload item to gallery, process, approve, and check ", async () => {
    console.log(
      `pathyes: ${
        __dirname + "/../../../frontend/src/assets/images/sidebar.png"
      }`,
      __dirname + "/../../assets/AuthRequired.png"
    )

    const socketEventPromise = waitForSocketEvent(
      socketClient,
      "autoCollectApproval",
      50000,
      (data) => {
        expect(data).toMatchObject({
          type: "new"
        })
      }
    )

    const upload = await req!
      .post("/api/v3/gallery")
      .attach("attachment", __dirname + "/../../assets/AuthRequired.png")
      .set({
        Authorization: user!.token,
        "Content-Type": "multipart/form-data"
      })

    const upload2 = await req!
      .post("/api/v3/gallery")
      .attach(
        "attachment",
        __dirname + "/../../../frontend/src/assets/images/sidebar.png"
      )
      .set({
        Authorization: user!.token,
        "Content-Type": "multipart/form-data"
      })

    expect(upload.statusCode).toBe(200)
    expect(upload2.statusCode).toBe(200)

    uploadId = upload.body.upload.id

    await socketEventPromise

    const data2 = await gCall({
      source: AutoCollectsQuery,
      token: user!.token,
      variableValues: {
        input: {}
      }
    })

    expect(data2.errors).toBeUndefined()
    expect(data2.data.autoCollects.items).toMatchObject([
      {
        id: collectionId,
        name: "Test Collection"
      }
    ])

    const data3 = await gCall({
      source: GalleryQuery,
      token: user!.token,
      variableValues: {
        input: {
          type: GalleryType.AutoCollect,
          collectionId,
          page: 1
        }
      }
    })

    expect(data3.errors).toBeUndefined()
    console.log(data3.data.gallery)
    expect(data3.data?.gallery.items[0]).toMatchObject({
      id: uploadId
    })
    itemId = data3.data?.gallery.items[0].autoCollectApproval.id

    const data4 = await gCall({
      source: ActAutoCollectsMutation,
      token: user!.token,
      variableValues: {
        input: {
          items: [itemId],
          action: AutoCollectAction.Approve
        }
      }
    })

    expect(data4.errors).toBeUndefined()
    expect(data4.data?.actOnAutoCollects.success).toBe(true)

    const data5 = await gCall({
      source: GalleryQuery,
      token: user!.token,
      variableValues: {
        input: {
          type: GalleryType.Collection,
          collectionId,
          page: 1
        }
      }
    })

    expect(data5.errors).toBeUndefined()
    const find = data5.data?.gallery.items.find((i: any) => i.id === uploadId)
    expect(find).toBeDefined()
  }, 60000)
})

beforeAll(async () => {
  await resetState()
  const server = Container.get(Application)
  req = supertest(server.app)
  user = await getUser()
  const ws = await connectSocket("/autoCollects", user!.token)
  socketClient = ws.socketClient
})
