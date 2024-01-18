import "@app/lib/init-tests"
import { gCall } from "@app/lib/test-utils/gCall"
import { errorConverter } from "@app/lib/test-utils/errorConverter"
import { UserCollectionsQuery } from "../../../frontend/src/graphql/collections/getUserCollections.graphql"
import { getUser, TestUser } from "@app/lib/test-utils/testUser"
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
import { FriendAction, GalleryType } from "../../../frontend-v5/src/gql/graphql"
import fs from "fs"
import { Container } from "typedi"
import { GalleryControllerV3 } from "@app/controllers/v3/gallery.controller"
import {
  AddToCollectionMutation,
  RemoveFromCollectionMutation
} from "../../../frontend-v5/src/graphql/collections/addToCollection.graphql"
import { GalleryQuery } from "../../../frontend-v5/src/graphql/gallery/gallery.graphql"
import { Collection } from "../../../frontend-v5/src/gql/graphql"
import { resetState } from "@app/lib/init-tests"
let user: TestUser | null = null

let collectionId = 0
let shareLink = ""
let collectionId2 = 0

let friendToShare: TestUser | null = null

const rid = cryptoRandomString({
  length: 10,
  type: "alphanumeric"
})

describe("CollectionResolver", () => {
  async function getCollections() {
    return await gCall({
      source: UserCollectionsQuery,
      token: user?.token,
      variableValues: {
        input: {
          page: 1
        }
      }
    })
  }

  test("Get collections", async () => {
    const collections = await getCollections()
    expect(collections.errors).toBeUndefined()
    expect(collections.data?.collections?.pager).toMatchObject({
      totalItems: expect.any(Number),
      totalPages: expect.any(Number),
      currentPage: expect.any(Number)
    })
  })

  test("Create collection", async () => {
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

    // Ensure the collections have been updated
    const collections = await getCollections()
    expect(collections.errors).toBeUndefined()
    expect(collections.data?.collections?.pager).toMatchObject({
      totalItems: expect.any(Number),
      totalPages: expect.any(Number),
      currentPage: expect.any(Number)
    })
    const contains = collections.data?.collections?.items?.some(
      (c: Collection) => c.id === collectionId
    )
    expect(contains).toBe(true)
  })

  test("Get collection", async () => {
    const collection = await gCall({
      source: CollectionQuery,
      token: user?.token,
      variableValues: {
        input: {
          id: collectionId
        }
      }
    })
    expect(collection.errors).toBeUndefined()
    expect(collection.data?.collection).toMatchObject({
      id: collectionId,
      name: "Test Collection"
    })
  })

  test("Get collection gallery", async () => {
    const gallery = await gCall({
      source: GalleryQuery,
      token: user?.token,
      variableValues: {
        input: {
          page: 1,
          collectionId,
          type: GalleryType.Collection
        }
      }
    })
    expect(gallery.errors).toBeUndefined()
    expect(gallery.data?.gallery).toMatchObject({
      items: [],
      pager: {
        currentPage: 0,
        totalItems: 0,
        totalPages: 0
      }
    })
  })

  describe("Sharing", () => {
    test("Create a user to share with", async () => {
      const u = await gCall({
        source: RegisterMutation,
        variableValues: {
          input: {
            username: `Collectivizer${rid}`,
            password: rid,
            email: `${rid}-collectivizer@example.com`
          }
        }
      })
      console.log(JSON.stringify(u.errors, null, 2))
      expect(u.errors).toBeUndefined()
      expect(u.data?.register).toMatchObject({
        user: {
          id: expect.any(Number),
          username: `Collectivizer${rid}`,
          email: `${rid}-collectivizer@example.com`
        },
        token: expect.any(String)
      })
      friendToShare = await getUser(u.data.register.user.id)
    })

    test("Set ShareLink", async () => {
      const update = await gCall({
        source: UpdateCollectionMutation,
        token: user?.token,
        variableValues: {
          input: {
            collectionId,
            shareLink: true
          }
        }
      })
      expect(update.data.updateCollection).toMatchObject({
        shareLink: expect.any(String),
        name: "Test Collection",
        id: collectionId
      })
      shareLink = update.data.updateCollection.shareLink
    })

    test("Get collection from ShareLink", async () => {
      const collection = await gCall({
        source: CollectionQuery,
        variableValues: {
          input: {
            shareLink
          }
        }
      })
      expect(collection.errors).toBeUndefined()
      expect(collection.data?.collection).toMatchObject({
        id: collectionId,
        name: "Test Collection"
      })
    })

    test("Get collection from ShareLink logged in", async () => {
      const collection = await gCall({
        source: CollectionQuery,
        token: user?.token,
        variableValues: {
          input: {
            shareLink
          }
        }
      })
      expect(collection.errors).toBeUndefined()
      expect(collection.data?.collection).toMatchObject({
        id: collectionId,
        name: "Test Collection"
      })
    })

    test("Get collection from ShareLink as another user", async () => {
      const collection = await gCall({
        source: CollectionQuery,
        token: friendToShare?.token,
        variableValues: {
          input: {
            shareLink
          }
        }
      })
      expect(collection.errors).toBeUndefined()
      expect(collection.data?.collection).toMatchObject({
        id: collectionId,
        name: "Test Collection"
      })
    })

    test("Remove ShareLink", async () => {
      const update = await gCall({
        source: UpdateCollectionMutation,
        token: user?.token,
        variableValues: {
          input: {
            collectionId,
            shareLink: false
          }
        }
      })
      expect(update.data.updateCollection).toMatchObject({
        shareLink: null,
        name: "Test Collection",
        id: collectionId
      })
    })

    test("Ensure removal of ShareLink", async () => {
      const collection = await gCall({
        source: CollectionQuery,
        variableValues: {
          input: { shareLink }
        }
      })
      expect(collection.errors).toBeUndefined()
      expect(collection.data?.collection).toBeNull()
    })

    test("Add user to collection", async () => {
      // Should fail as they are not friends
      const share1 = await gCall({
        source: AddCollectionUserMutation,
        token: user?.token,
        variableValues: {
          input: {
            collectionId,
            userId: friendToShare!.id,
            read: true,
            write: true,
            configure: true
          }
        }
      })

      console.log(JSON.stringify(share1.errors, null, 2))
      expect(share1.errors).toMatchObject([
        errorConverter(undefined, "NOT_FRIENDS_WITH_USER_COLLECTION")
      ])

      // Friend user
      const friend = await gCall({
        source: AddFriendMutation,
        token: user?.token,
        variableValues: {
          input: {
            userId: friendToShare!.id,
            action: FriendAction.Send
          }
        }
      })
      expect(friend.errors).toBeUndefined()
      const accept = await gCall({
        source: AddFriendMutation,
        token: friendToShare?.token,
        variableValues: {
          input: {
            userId: user!.id,
            action: FriendAction.Accept
          }
        }
      })
      expect(accept.errors).toBeUndefined()
      expect(accept.data?.friend).toBe(true)
      expect(friend.data?.friend).toBe(true)

      // Should succeed as they are friends
      const share2 = await gCall({
        source: AddCollectionUserMutation,
        token: user?.token,
        variableValues: {
          input: {
            collectionId,
            userId: friendToShare!.id,
            read: true,
            write: true,
            configure: true
          }
        }
      })
      expect(share2.errors).toBeUndefined()
    })

    test("Get collection from shared user", async () => {
      const collection = await gCall({
        source: CollectionQuery,
        token: friendToShare?.token,
        variableValues: {
          input: {
            id: collectionId
          }
        }
      })
      expect(collection.errors).toBeUndefined()
      expect(collection.data?.collection).toMatchObject({
        id: collectionId,
        name: "Test Collection"
      })
    })

    test("Change permissions of shared user", async () => {
      const share2 = await gCall({
        source: UpdateCollectionUserPermissionsMutation,
        token: user?.token,
        variableValues: {
          input: {
            collectionId,
            userId: friendToShare!.id,
            read: true,
            write: false,
            configure: false
          }
        }
      })
      expect(share2.errors).toBeUndefined()
      expect(share2.data?.updateCollectionUserPermissions).toMatchObject({
        id: expect.any(Number),
        read: true,
        write: false,
        configure: false
      })
    })

    test("Try and update collection name without permission", async () => {
      const update = await gCall({
        source: UpdateCollectionMutation,
        token: friendToShare?.token,
        variableValues: {
          input: {
            collectionId,
            name: "Test Collection 69"
          }
        }
      })
      expect(update.errors).toMatchObject([
        errorConverter(undefined, "COLLECTION_NOT_FOUND")
      ])
    })

    test("Remove user from collection", async () => {
      const share2 = await gCall({
        source: RemoveCollectionUser,
        token: user?.token,
        variableValues: {
          input: {
            collectionId,
            userId: friendToShare!.id
          }
        }
      })
      expect(share2.errors).toBeUndefined()
      expect(share2.data?.removeCollectionUser).toMatchObject({ success: true })
    })

    test("Ensure removal of user from collection", async () => {
      const collection = await gCall({
        source: CollectionQuery,
        token: friendToShare?.token,
        variableValues: {
          input: {
            id: collectionId
          }
        }
      })
      expect(collection.errors).toBeUndefined()
      expect(collection.data?.collection).toBeNull()
    })
  })

  test("Update collection name", async () => {
    const update = await gCall({
      source: UpdateCollectionMutation,
      token: user?.token,
      variableValues: {
        input: {
          collectionId,
          name: "Test Collection 2"
        }
      }
    })
    expect(update.data.updateCollection).toMatchObject({
      shareLink: null,
      name: "Test Collection 2",
      id: collectionId
    })

    // Ensure the collection has been updated
    const collection = await gCall({
      source: CollectionQuery,
      token: user?.token,
      variableValues: {
        input: {
          id: collectionId
        }
      }
    })
    expect(collection.errors).toBeUndefined()
    expect(collection.data?.collection).toMatchObject({
      id: collectionId,
      name: "Test Collection 2"
    })
  })
})

let uploadId = 0
let attachment = ""
let uploadIdFriendToShare = 0
let attachmentFriendToShare = ""

describe("CollectionItemResolver", () => {
  beforeAll(async () => {
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
    const uploadFriendToShare = await galleryController.upload(
      friendToShare as any,
      {
        filename: cryptoRandomString({ length: 12 }) + ".png",
        mimetype: "image/png",
        size: file.byteLength,
        originalname: "AuthRequired.png"
      } as any
    )
    expect(upload).toBeDefined()
    uploadIdFriendToShare = uploadFriendToShare.upload.id
    attachmentFriendToShare = uploadFriendToShare.upload.attachment
    uploadId = upload.upload.id
    attachment = upload.upload.attachment
  })

  test("Add item to collection", async () => {
    const add = await gCall({
      source: AddToCollectionMutation,
      variableValues: {
        input: {
          collectionId,
          items: [uploadId]
        }
      },
      token: user?.token
    })
    expect(add.errors).toBeUndefined()
    expect(add.data.addToCollection).toMatchObject([
      {
        id: expect.any(Number)
      }
    ])

    const gallery = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          collectionId,
          type: GalleryType.Collection
        }
      },
      token: user?.token
    })
    expect(gallery.errors).toBeUndefined()
    expect(gallery.data?.gallery.items[0].id).toBe(uploadId)
  })

  test("Create secondary collection", async () => {
    const collection = await gCall({
      source: CreateCollectionMutation,
      token: user?.token,
      variableValues: {
        input: {
          name: "Secondary Collection"
        }
      }
    })
    expect(collection.errors).toBeUndefined()
    expect(collection.data?.createCollection).toMatchObject({
      id: expect.any(Number)
    })
    collectionId2 = collection.data?.createCollection.id
  })

  test("Add item to secondary collection", async () => {
    const add = await gCall({
      source: AddToCollectionMutation,
      variableValues: {
        input: {
          collectionId: collectionId2,
          items: [uploadId]
        }
      },
      token: user?.token
    })
    expect(add.errors).toBeUndefined()
    expect(add.data.addToCollection).toMatchObject([
      {
        id: expect.any(Number)
      }
    ])
  })

  test("Add user back to collection with write permissions", async () => {
    const share2 = await gCall({
      source: AddCollectionUserMutation,
      token: user?.token,
      variableValues: {
        input: {
          collectionId,
          userId: friendToShare!.id,
          read: true,
          write: true,
          configure: false
        }
      }
    })
    expect(share2.errors).toBeUndefined()
    expect(share2.data?.addCollectionUser).toMatchObject({
      id: expect.any(Number)
    })
  })

  test("Test collection hiding", async () => {
    const gallery = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          collectionId: collectionId,
          type: GalleryType.Collection
        }
      },
      token: friendToShare?.token
    })
    expect(gallery.errors).toBeUndefined()

    // Find the item
    const item = gallery.data?.gallery.items.find(
      (item: any) => item.id === uploadId
    )
    expect(item).toBeDefined()
    // ensure the secondary collection is not in collections field
    const collection = item.collections.find((c: any) => c.id === collectionId2)
    expect(collection).toBeUndefined()
    expect(item.collections).toHaveLength(1)

    // Ensure the secondary collection is in the collections field for other user
    const gallery2 = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          collectionId: collectionId,
          type: GalleryType.Collection
        }
      },
      token: user?.token
    })
    expect(gallery2.errors).toBeUndefined()

    const item2 = gallery2.data?.gallery.items.find(
      (item: any) => item.id === uploadId
    )
    expect(item2).toBeDefined()
    const collection2 = item2.collections.find(
      (c: any) => c.id === collectionId2
    )
    expect(collection2).toBeDefined()
    expect(item2.collections).toHaveLength(2)
  })

  test("Remove item from collection of other user (should fail)", async () => {
    const remove = await gCall({
      source: RemoveFromCollectionMutation,
      variableValues: {
        input: {
          collectionId,
          items: [uploadId]
        }
      },
      token: friendToShare?.token
    })
    expect(remove.errors).toMatchObject([
      errorConverter(undefined, "ATTACHMENT_NOT_FOUND")
    ])
  })

  test("Add user upload to collection", async () => {
    const add = await gCall({
      source: AddToCollectionMutation,
      variableValues: {
        input: {
          collectionId,
          items: [uploadIdFriendToShare]
        }
      },
      token: friendToShare?.token
    })
    expect(add.errors).toBeUndefined()
    expect(add.data.addToCollection).toMatchObject([
      {
        id: expect.any(Number)
      }
    ])

    const gallery = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          collectionId,
          type: GalleryType.Collection
        }
      },
      token: friendToShare?.token
    })
    expect(gallery.errors).toBeUndefined()
    const contains = gallery.data?.gallery.items.some(
      (item: any) => item.id === uploadIdFriendToShare
    )
    expect(contains).toBe(true)
  })

  test("Add configure permissions to user", async () => {
    const share2 = await gCall({
      source: UpdateCollectionUserPermissionsMutation,
      token: user?.token,
      variableValues: {
        input: {
          collectionId,
          userId: friendToShare!.id,
          read: true,
          write: true,
          configure: true
        }
      }
    })
    expect(share2.errors).toBeUndefined()
    expect(share2.data?.updateCollectionUserPermissions).toMatchObject({
      id: expect.any(Number),
      read: true,
      write: true,
      configure: true
    })
  })

  test("Remove item from collection of other user (should succeed)", async () => {
    const remove = await gCall({
      source: RemoveFromCollectionMutation,
      variableValues: {
        input: {
          collectionId,
          items: [uploadIdFriendToShare]
        }
      },
      token: friendToShare?.token
    })
    expect(remove.errors).toBeUndefined()
    expect(remove.data.removeFromCollection).toBe(1)

    const gallery = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          collectionId,
          type: GalleryType.Collection
        }
      },
      token: friendToShare?.token
    })
    expect(gallery.errors).toBeUndefined()
    const contains = gallery.data?.gallery.items.some(
      (item: any) => item.id === uploadIdFriendToShare
    )
    expect(contains).toBe(false)
  })

  test("Add item to collection of other user (should fail)", async () => {
    const add = await gCall({
      source: AddToCollectionMutation,
      variableValues: {
        input: {
          collectionId,
          items: [uploadIdFriendToShare]
        }
      },
      token: user?.token
    })
    expect(add.errors).toMatchObject([
      errorConverter(undefined, "ATTACHMENT_NOT_FOUND")
    ])
  })

  test("Demote to read permissions", async () => {
    const share2 = await gCall({
      source: UpdateCollectionUserPermissionsMutation,
      token: user?.token,
      variableValues: {
        input: {
          collectionId,
          userId: friendToShare!.id,
          read: true,
          write: false,
          configure: false
        }
      }
    })
    expect(share2.errors).toBeUndefined()
    expect(share2.data?.updateCollectionUserPermissions).toMatchObject({
      id: expect.any(Number)
    })
  })

  test("Add user item to collection (should fail)", async () => {
    const add = await gCall({
      source: AddToCollectionMutation,
      variableValues: {
        input: {
          collectionId,
          items: [uploadIdFriendToShare]
        }
      },
      token: friendToShare?.token
    })
    expect(add.errors).toMatchObject([
      errorConverter(undefined, "COLLECTION_NOT_FOUND")
    ])
  })

  test("Remove item from collection", async () => {
    const remove = await gCall({
      source: RemoveFromCollectionMutation,
      variableValues: {
        input: {
          collectionId,
          items: [uploadId]
        }
      },
      token: user?.token
    })
    expect(remove.errors).toBeUndefined()
    expect(remove.data.removeFromCollection).toBe(1)

    const gallery = await gCall({
      source: GalleryQuery,
      variableValues: {
        input: {
          page: 1,
          collectionId,
          type: GalleryType.Collection
        }
      },
      token: user?.token
    })
    expect(gallery.errors).toBeUndefined()
    expect(gallery.data?.gallery.items).toMatchObject([])
  })
})

beforeAll(async () => {
  await resetState()
  user = await getUser()
})
