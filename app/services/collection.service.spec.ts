import { afterAll, expect, test } from "@jest/globals"
import "../lib/init-tests"
import { CollectionService } from "@app/services/collection.service"
import { CollectionControllerV3 } from "@app/controllers/v3/collection.controller"
import { Container } from "typedi"
import { CacheService } from "@app/services/cache.service"

const collectionService = Container.get(CollectionService)
const collectionController = Container.get(CollectionControllerV3)
const cacheService = Container.get(CacheService)
const collectionShareId =
  "1d198996d324f7219ae0e2b4d78eecec4ef8a72c673526276b1481699775d997"

const collectionConfigureId = "292"

test("ShareLink Collection", async () => {
  await cacheService.generateShareLinkCache()
  const collection = await collectionController.getCollection(
    null,
    collectionShareId
  )
  const gallery = await collectionController.getCollectionGallery(
    null,
    1,
    "newest",
    "",
    false,
    true,
    "newest",
    collectionShareId
  )

  expect(collection).toHaveProperty("id")
  expect(gallery).toHaveProperty("gallery")
})

test("Get Auth Collection", async () => {
  const user = await authMock(1, "collections.view", true)
  const collection = await collectionController.getCollection(
    user,
    collectionConfigureId
  )
  console.log(collection.name)
  const gallery = await collectionController.getCollectionGallery(
    user,
    1,
    "newest",
    "",
    false,
    true,
    "newest",
    collectionConfigureId
  )
  expect(collection).toHaveProperty("id")
  expect(gallery).toHaveProperty("gallery")
})

test("Get Collections", async () => {
  const user = await authMock(1, "collections.view", true)
  if (!user) throw new Error("User not found")
  const collections = await collectionController.getCollections(user, "all", "")
  expect(Array.isArray([collections])).toBe(true)
})

test("Toggle Share", async () => {
  const user = await authMock(1, "collections.view", true)
  if (!user) throw new Error("User not found")
  const collection = await collectionController.updateShareLink(user, {
    id: parseInt(collectionConfigureId),
    type: "link"
  })
  expect(collection).toHaveProperty("shareLink")
  const collection2 = await collectionController.updateShareLink(user, {
    id: parseInt(collectionConfigureId),
    type: "nobody"
  })
  expect(collection2).toHaveProperty("shareLink")
})

test("Random Collection Item", async () => {
  const user = await authMock(1, "collections.view", true)
  if (!user) throw new Error("User not found")
  const collection = await collectionController.getRandomAttachment(
    user,
    collectionConfigureId
  )
  expect(collection).toHaveProperty("id")
})

test("Random Collection Item Unauth", async () => {
  await cacheService.generateShareLinkCache()
  const collection = await collectionController.getRandomAttachment(
    null,
    collectionShareId
  )
  expect(collection).toHaveProperty("id")
})

test("Add and Remove Item", async () => {
  const user = await authMock(1, "collections.view", true)
  if (!user) throw new Error("User not found")

  async function addToCollection() {
    try {
      if (!user) throw new Error("User not found")
      const collection = await collectionController.addAttachmentToCollection(
        user,
        {
          collectionId: parseInt(collectionConfigureId),
          attachmentId: 49038
        }
      )
      console.log(collection)
      expect(collection).toHaveProperty("id")
    } catch (e) {
      if (e.message === "identifier must be unique") {
        await removeFromCollection()
      }
    }

    async function removeFromCollection() {
      try {
        if (!user) throw new Error("User not found")
        await collectionController.removeAttachmentFromCollection(
          user,
          parseInt(collectionConfigureId),
          49038
        )
      } catch (e) {
        console.log(e)
      }
    }
  }
})

it("Change Collection Name", async () => {
  const user = await authMock(1, "collections.view", true)
  if (!user) throw new Error("User not found")
  const collection = await collectionController.updateCollection(
    user,
    parseInt(collectionConfigureId),
    {
      name: Math.random().toString(36).substring(7)
    }
  )
  expect(collection).toHaveProperty("name")

  const getCollection = await collectionController.getCollection(
    user,
    collectionConfigureId
  )
  expect(getCollection).toHaveProperty("name")
  expect(getCollection.name).toBe(collection.name)
})

it("Create and Delete Collection", async () => {
  const user = await authMock(1, "collections.view", true)
  if (!user) throw new Error("User not found")
  const collection = await collectionController.createCollection(user, {
    name: Math.random().toString(36).substring(7)
  })

  expect(collection).toHaveProperty("name")

  const getUserCollectionsBeforeDelete =
    await collectionController.getCollections(user, "all", "")

  const findCollection = getUserCollectionsBeforeDelete.find(
    (c) => c.id === collection.id
  )
  expect(findCollection).toHaveProperty("name")

  await collectionController.deleteCollection(user, collection.id)

  try {
    await collectionController.getCollection(user, collection.id)
    throw new Error("Collection not deleted")
  } catch {
    // pass
    const getUserCollectionsAfterDelete =
      await collectionController.getCollections(user, "all", "")
    const findCollection = getUserCollectionsAfterDelete.find(
      (c) => c.id === collection.id
    )
    expect(findCollection).toBeUndefined()
  }
})

it("Add and Remove User from Collection", async () => {
  const user = await authMock(1, "collections.view", true)
  if (!user) throw new Error("User not found")

  async function addUser() {
    if (!user) throw new Error("User not found")
    try {
      const collection = await collectionController.addUserToCollection(
        user,
        parseInt(collectionConfigureId),
        {
          username: "Jolt707",
          read: true,
          write: true,
          configure: false
        }
      )
      expect(collection).toHaveProperty("id")
    } catch (e) {
      if (e.message === "This user is already in the collection.") {
        await removeUser()
      }
    }
  }

  async function removeUser() {
    if (!user) throw new Error("User not found")
    try {
      const collection = await collectionController.removeUserFromCollection(
        user,
        parseInt(collectionConfigureId),
        6
      )
      expect(collection).toBeUndefined()
    } catch (e) {
      console.log(e)
    }
  }

  await addUser()
  await removeUser()
})

afterAll(async () => {
  await new Promise((r) => setTimeout(r, 3000))
  await redis.disconnect()
})
