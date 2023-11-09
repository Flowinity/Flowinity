import "@app/lib/init-tests"
import { CollectionResolver } from "@app/controllers/graphql/collection.resolver"
import { errorConverter, gCall } from "@app/lib/test-utils/gCall"
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
import { GalleryQuery } from "../../../frontend-v5/src/graphql/gallery/gallery.graphql"
import axios from "axios"
import fs from "fs"
import { Container } from "typedi"
import path from "path"
let user: TestUser | null = null

describe("CollectionResolver", () => {
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
    expect(gallery.data.gallery.items.length).toBe(0)
    expect(gallery.data.gallery.pager.totalItems).toBe(0)
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
      testUser as any,
      {
        filename: cryptoRandomString({ length: 12 }) + ".png",
        mimetype: "image/png",
        size: file.byteLength,
        originalname: "AuthRequired.png"
      } as any
    )
    expect(upload).toBeDefined()
  })
})

beforeAll(async () => {
  user = await getUser()
})
