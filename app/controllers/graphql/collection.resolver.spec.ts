import "@app/lib/init-tests"
import { CollectionResolver } from "@app/controllers/graphql/collection.resolver"
import { errorConverter, gCall } from "@app/lib/test-utils/gCall"
import { UserCollectionsQuery } from "../../../frontend/src/graphql/collections/getUserCollections.graphql"
import { getUser, TestUser } from "@app/lib/test-utils/testUser"
import { beforeAll, expect } from "@jest/globals"
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

let user: TestUser | null = null

let collectionId = 0
let shareLink = ""

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
      totalItems: 0,
      totalPages: 0,
      currentPage: 0
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
      totalItems: 1,
      totalPages: 1,
      currentPage: 1
    })
    expect(collections.data?.collections?.items).toMatchObject([
      {
        id: collectionId,
        name: "Test Collection"
      }
    ])
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

  describe("Sharing", () => {
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

beforeAll(async () => {
  user = await getUser()
  console.log(user)
})
