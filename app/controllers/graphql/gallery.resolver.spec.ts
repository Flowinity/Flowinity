import "@app/lib/init-tests"
import { CollectionResolver } from "@app/controllers/graphql/collection.resolver"
import { gCall } from "@app/lib/test-utils/gCall"
import { UserCollectionsQuery } from "../../../frontend/src/graphql/collections/getUserCollections.graphql"
import { getUser, testUser, TestUser } from "@app/lib/test-utils/testUser"
import { beforeAll, expect, jest, beforeEach, afterEach } from "@jest/globals"
import { CreateCollectionMutation } from "../../../frontend-v5/src/graphql/collections/createCollection.graphql"
import { CollectionQuery } from "../../../frontend-v5/src/graphql/collections/getCollection.graphql"
import { UpdateCollectionMutation } from "../../../frontend-v5/src/graphql/collections/updateCollection.graphql"
import { RegisterMutation } from "../../../frontend/src/graphql/auth/register.graphql"
import {
  AddCollectionUserMutation,
  RemoveCollectionUser,
  UpdateCollectionUserPermissionsMutation
} from "../../../frontend-v5/src/graphql/collections/collectionUser.graphql"
import cryptoRandomString from "crypto-random-string"
import { AddFriendMutation } from "../../../frontend-v5/src/graphql/friends/addFriend.graphql"
import { FriendAction } from "../../../frontend-v5/src/gql/graphql"
import { GalleryResolver } from "@app/controllers/graphql/gallery.resolver"
import { GalleryControllerV3 } from "@app/controllers/v3/gallery.controller"
import {
  DeleteUploadMutation,
  GalleryQuery,
  UpdateUploadMutation
} from "../../../frontend-v5/src/graphql/gallery/gallery.graphql"
import axios from "axios"
import fs from "fs"
import { Container } from "typedi"
import path from "path"
import { StarUploadMutation } from "../../../frontend-v5/src/graphql/gallery/starUpload"
import { GalleryType } from "../../../frontend-v5/src/gql/graphql"
import { resetState } from "@app/lib/init-tests"
import { Application } from "@app/app"
import { Server } from "@app/server"
let user: TestUser | null = null
import http from "http"
import supertest from "supertest"
import { AddressInfo } from "net"
import Client, { io, Manager, Socket } from "socket.io-client"
import {
  connectSocket,
  waitForSocketEvent
} from "@app/lib/test-utils/socketHelper"

let uploadId = 0
let attachment = ""
let req: supertest.SuperTest<supertest.Test> | null = null
let server: http.Server | null = null
let socketClient: Socket | null = null

describe("GalleryResolver", () => {
  test("Get user gallery", async () => {
    const gallery = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1
        }
      },
      token: user!.token
    })
    console.log(JSON.stringify(gallery.errors, null, 2))
    expect(gallery.errors).toBeUndefined()
    expect(gallery.data.gallery.items.length).toBeGreaterThanOrEqual(0)
    expect(gallery.data.gallery.pager.totalItems).toBeGreaterThanOrEqual(0)
  })

  test("Upload file", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    const socketEventPromise = waitForSocketEvent(
      socketClient,
      "create",
      1000,
      (data) => {
        expect(data).toMatchObject([
          {
            upload: {
              id: expect.any(Number),
              name: expect.any(String),
              attachment: expect.any(String)
            },
            url: expect.any(String)
          }
        ])
      }
    )

    console.log(socketClient?.connected + " connected")

    const upload = await req!
      .post("/api/v3/gallery")
      .attach("attachment", __dirname + "/../../assets/AuthRequired.png")
      .set({
        Authorization: user!.token,
        "Content-Type": "multipart/form-data"
      })

    await socketEventPromise

    console.log("body + ", upload.body)

    expect(upload.status).toBe(200)
    expect(upload.body).toMatchObject({
      url: expect.any(String),
      upload: {
        id: expect.any(Number),
        name: expect.any(String),
        attachment: expect.any(String)
      }
    })

    uploadId = upload.body.upload.id
    attachment = upload.body.upload.attachment
  })

  test("Update upload name", async () => {
    const update = await gCall({
      source: UpdateUploadMutation,
      variableValues: {
        input: {
          uploadId,
          name: "test-again.png"
        }
      },
      token: user!.token
    })
    expect(update.errors).toBeUndefined()

    const gallery = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1
        }
      },
      token: user!.token
    })
    expect(gallery.errors).toBeUndefined()
    expect(
      gallery.data.gallery.items.find((i: any) => i.id === uploadId)?.name
    ).toBe("test-again.png")
  })

  test("Test starring of upload & get stars", async () => {
    const star = await gCall({
      source: StarUploadMutation,
      variableValues: {
        input: {
          attachment
        }
      },
      token: user!.token
    })
    expect(star.errors).toBeUndefined()
    expect(star.data.starUpload).toMatchObject({
      status: true
    })

    const stars = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          type: GalleryType.Starred
        }
      },
      token: user!.token
    })
    expect(stars.errors).toBeUndefined()
    expect(stars.data.gallery.items).toMatchObject([
      {
        attachment
      }
    ])
  })

  test("Remove star & validate", async () => {
    const remove = await gCall({
      source: StarUploadMutation,
      variableValues: {
        input: {
          attachment
        }
      },
      token: user!.token
    })
    expect(remove.errors).toBeUndefined()
    expect(remove.data.starUpload).toMatchObject({
      status: false
    })

    const stars = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          type: GalleryType.Starred
        }
      },
      token: user!.token
    })
    expect(stars.errors).toBeUndefined()
    expect(stars.data.gallery.items).toMatchObject([])
  })

  test("Delete upload", async () => {
    const deleteUpload = await gCall({
      source: DeleteUploadMutation,
      variableValues: {
        input: {
          items: [uploadId]
        }
      },
      token: user!.token
    })
    expect(deleteUpload.errors).toBeUndefined()
    expect(deleteUpload.data.deleteUploads).toMatchObject({
      success: true
    })
  })
})

beforeAll(async () => {
  user = await getUser()
  await resetState()
  const app = Container.get(Application)
  req = supertest(app.app)
  const ws = await connectSocket("/gallery", user!.token)
  socketClient = ws.socketClient
})
