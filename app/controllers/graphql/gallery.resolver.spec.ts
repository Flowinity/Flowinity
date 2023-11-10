import "@app/lib/init-tests"
import { CollectionResolver } from "@app/controllers/graphql/collection.resolver"
import { gCall } from "@app/lib/test-utils/gCall"
import { UserCollectionsQuery } from "../../../frontend/src/graphql/collections/getUserCollections.graphql"
import { getUser, testUser, TestUser } from "@app/lib/test-utils/testUser"
import { beforeAll, expect, jest } from "@jest/globals"
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
let user: TestUser | null = null

let uploadId = 0
let attachment = ""

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
    const file = fs.readFileSync(__dirname + "/../../assets/AuthRequired.png")
    console.log(user!.token)
    const galleryController = Container.get(GalleryControllerV3)
    // mock global.queue
    //@ts-ignore
    global.queue = {
      queue: {
        add: jest.fn()
      }
    } as any
    const upload = await galleryController.upload(
      user as any,
      {
        filename: cryptoRandomString({ length: 12 }) + ".png",
        mimetype: "image/png",
        size: file.byteLength,
        originalname: "AuthRequired.png"
      } as any
    )
    expect(upload).toBeDefined()
    uploadId = upload.upload.id
    attachment = upload.upload.attachment
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
    expect(gallery.data.gallery.items[0].name).toBe("test-again.png")
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
})
