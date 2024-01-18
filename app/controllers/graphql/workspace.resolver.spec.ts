import { beforeAll, expect, test } from "@jest/globals"
import "@app/lib/init-tests"
import { gCall } from "@app/lib/test-utils/gCall"
import { CoreStateQuery } from "../../../frontend/src/graphql/core/state.graphql"
import { getUser, TestUser } from "@app/lib/test-utils/testUser"
import { CreateWorkspaceMutation } from "../../../frontend-v5/src/graphql/workspaces/createWorkspace.graphql"
import { CreateNoteMutation } from "../../../frontend-v5/src/graphql/workspaces/createNote.graphql"
import { CreateWorkspaceFolderMutation } from "../../../frontend-v5/src/graphql/workspaces/createFolder.graphql"
import { SaveNoteMutation } from "../../../frontend-v5/src/graphql/workspaces/saveNote.graphql"
import { NoteQuery } from "../../../frontend-v5/src/graphql/workspaces/note.graphql"
import { UpdateShareLinkMutation } from "../../../frontend-v5/src/graphql/workspaces/updateShareLink.graphql"
import { RegisterMutation } from "../../../frontend/src/graphql/auth/register.graphql"
import cryptoRandomString from "crypto-random-string"
import { DeleteWorkspaceItemMutation } from "../../../frontend-v5/src/graphql/workspaces/deleteWorkspaceItem"
import { WorkspaceItemType } from "../../../frontend-v5/src/gql/graphql"
import { resetState } from "@app/lib/init-tests"

let user: TestUser | null = null
let user2: TestUser | null = null

let workspaceId = 0
let folderId = 0
let noteId = 0
let shareLink = ""

const rid = cryptoRandomString({
  length: 10,
  type: "alphanumeric"
})

const testData = {
  time: 1699538882916,
  blocks: [
    {
      id: "aOJRIRpBGO",
      type: "paragraph",
      data: {
        text: "This is a test document."
      },
      tunes: {
        align: {
          alignment: "left"
        }
      }
    }
  ],
  version: "2.28.2"
}

const testDataUpdate = {
  time: 1699538882918,
  blocks: [
    {
      id: "ffgfgf",
      type: "paragraph",
      data: {
        text: "This is an updated test document."
      },
      tunes: {
        align: {
          alignment: "left"
        }
      }
    }
  ],
  version: "2.28.2"
}

describe("WorkspaceResolver", () => {
  test("Create Workspace", async () => {
    const workspace = await gCall({
      source: CreateWorkspaceMutation,
      variableValues: {
        input: "Test Workspace"
      },
      token: user?.token
    })

    expect(workspace.errors).toBeUndefined()
    expect(workspace.data?.createWorkspace).toMatchObject({
      id: expect.any(Number),
      name: "Test Workspace"
    })
    workspaceId = workspace.data?.createWorkspace.id
  })

  test("Create Workspace folder", async () => {
    const workspace = await gCall({
      source: CreateWorkspaceFolderMutation,
      variableValues: {
        input: {
          name: "Test Folder",
          workspaceId
        }
      },
      token: user?.token
    })

    expect(workspace.errors).toBeUndefined()
    expect(workspace.data?.createWorkspaceFolder).toMatchObject({
      id: expect.any(Number),
      name: "Test Folder"
    })
    folderId = workspace.data?.createWorkspaceFolder.id
  })
})

describe("NoteResolver", () => {
  test("Create Workspace Document", async () => {
    const document = await gCall({
      source: CreateNoteMutation,
      variableValues: {
        input: {
          workspaceFolderId: folderId,
          name: "Test Document"
        }
      },
      token: user?.token
    })

    expect(document.errors).toBeUndefined()
    expect(document.data?.createNote).toMatchObject({
      id: expect.any(Number),
      name: "Test Document"
    })
    noteId = document.data?.createNote.id
  })

  test("Update Workspace Document Data", async () => {
    const save = await gCall({
      source: SaveNoteMutation,
      variableValues: {
        input: { data: testData, id: noteId, manualSave: false }
      },
      token: user?.token
    })
    expect(save.errors).toBeUndefined()
    expect(save.data?.saveNote.id).toBe(noteId)
  })

  test("Load note", async () => {
    const note = await gCall({
      source: NoteQuery,
      token: user?.token,
      variableValues: {
        input: {
          id: noteId
        }
      }
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.note.id).toBe(noteId)
    expect(note.data?.note.data).toMatchObject(testData)
  })

  test("Update Workspace Document Data", async () => {
    const save = await gCall({
      source: SaveNoteMutation,
      variableValues: {
        input: { data: testDataUpdate, id: noteId, manualSave: true }
      },
      token: user?.token
    })
    expect(save.errors).toBeUndefined()
    expect(save.data?.saveNote.id).toBe(noteId)
  })

  test("Test version control", async () => {
    const note = await gCall({
      source: NoteQuery,
      token: user?.token,
      variableValues: {
        input: {
          id: noteId
        }
      }
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.note.id).toBe(noteId)
    expect(note.data?.note.data).toMatchObject(testDataUpdate)
    expect(note.data?.note.versions[0].data).toMatchObject(testData)
  })

  test("Enable ShareLink", async () => {
    const note = await gCall({
      source: UpdateShareLinkMutation,
      token: user?.token,
      variableValues: {
        input: noteId
      }
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.toggleNoteShare.shareLink).toBeTruthy()
    shareLink = note.data?.toggleNoteShare.shareLink
  })

  test("Load note with ShareLink", async () => {
    const note = await gCall({
      source: NoteQuery,
      token: user?.token,
      variableValues: {
        input: {
          shareLink
        }
      }
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.note.id).toBe(noteId)
    expect(note.data?.note.data).toMatchObject(testDataUpdate)
    // Versions should not be returned for a ShareLink
    expect(note.data?.note.versions).toMatchObject([])
  })

  test("Load note with ShareLink unauthenticated", async () => {
    const note = await gCall({
      source: NoteQuery,
      variableValues: {
        input: {
          shareLink
        }
      }
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.note.id).toBe(noteId)
    expect(note.data?.note.data).toMatchObject(testDataUpdate)
    // Versions should not be returned for a ShareLink
    expect(note.data?.note.versions).toMatchObject([])

    // Also ensure the note cannot be viewed with id
    const note2 = await gCall({
      source: NoteQuery,
      variableValues: {
        input: {
          id: noteId
        }
      }
    })
    expect(note2.data?.note).toBeNull()
  })

  test("Load note as another user", async () => {
    const register = await gCall({
      source: RegisterMutation,
      variableValues: {
        input: {
          username: `Collectivizer${rid}`,
          email: `${rid}-reject@troplo.com`,
          password: "password12345678!"
        }
      }
    })
    expect(register.errors).toBeUndefined()
    expect(register.data?.register?.user.id).toBeGreaterThan(0)
    const user2 = await getUser(register.data?.register?.user.id)
    const note = await gCall({
      source: NoteQuery,
      token: user2?.token,
      variableValues: {
        input: {
          id: noteId
        }
      }
    })
    expect(note.data?.note).toBeNull()
  })

  test("Disable ShareLink", async () => {
    const note = await gCall({
      source: UpdateShareLinkMutation,
      token: user?.token,
      variableValues: {
        input: noteId
      }
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.toggleNoteShare.shareLink).toBeFalsy()
  })

  test("Ensure removal of ShareLink", async () => {
    const note = await gCall({
      source: NoteQuery,
      token: user?.token,
      variableValues: {
        input: {
          shareLink
        }
      }
    })
    expect(note.data?.note).toBeNull()
  })

  test("Test saving of invalid note", async () => {
    const save = await gCall({
      source: SaveNoteMutation,
      variableValues: {
        input: {
          data: {
            blocks: []
          },
          manualSave: true
        }
      },
      token: user?.token
    })
    expect(save.errors).toBeDefined()
  })
})

describe("Delete Items", () => {
  test("Attempt deletion of items via invalid user", async () => {
    for (const token of [user2?.token, undefined]) {
      const document = await gCall({
        source: DeleteWorkspaceItemMutation,
        variableValues: {
          input: {
            id: noteId,
            type: WorkspaceItemType.Note
          }
        },
        token
      })

      const folder = await gCall({
        source: DeleteWorkspaceItemMutation,
        variableValues: {
          input: {
            id: folderId,
            type: WorkspaceItemType.Folder
          }
        },
        token
      })

      const workspace = await gCall({
        source: DeleteWorkspaceItemMutation,
        variableValues: {
          input: {
            id: workspaceId,
            type: WorkspaceItemType.Workspace
          }
        },
        token
      })

      expect(document.errors).toBeDefined()
      expect(folder.errors).toBeDefined()
      expect(workspace.errors).toBeDefined()
    }
  })

  test("Delete Workspace Document", async () => {
    const coreStateBefore = await gCall({
      source: CoreStateQuery,
      token: user?.token
    })
    let findWorkspace = coreStateBefore.data?.workspaces.find(
      (w: any) => w.id === workspaceId
    )
    let findFolder = findWorkspace?.folders.find((f: any) => f.id === folderId)
    let findNote = findFolder?.children.find((n: any) => n.id === noteId)
    expect(findNote).toBeTruthy()

    const noteBefore = await gCall({
      source: NoteQuery,
      token: user?.token,
      variableValues: {
        input: {
          id: noteId
        }
      }
    })

    expect(noteBefore.data?.note).toBeTruthy()

    const document = await gCall({
      source: DeleteWorkspaceItemMutation,
      variableValues: {
        input: {
          id: noteId,
          type: WorkspaceItemType.Note
        }
      },
      token: user?.token
    })

    expect(document.errors).toBeUndefined()
    expect(document.data?.deleteWorkspaceItem).toBeTruthy()

    const note = await gCall({
      source: NoteQuery,
      token: user?.token,
      variableValues: {
        input: {
          id: noteId
        }
      }
    })

    expect(note.data?.note).toBeNull()

    const coreStateAfter = await gCall({
      source: CoreStateQuery,
      token: user?.token
    })

    findWorkspace = coreStateAfter.data?.workspaces.find(
      (w: any) => w.id === workspaceId
    )
    findFolder = findWorkspace?.folders.find((f: any) => f.id === folderId)
    findNote = findFolder?.children.find((n: any) => n.id === noteId)
    expect(findNote).toBeUndefined()
  })

  test("Delete Workspace Folder", async () => {
    const coreStateBefore = await gCall({
      source: CoreStateQuery,
      token: user?.token
    })
    let findWorkspace = coreStateBefore.data?.workspaces.find(
      (w: any) => w.id === workspaceId
    )
    let findFolder = findWorkspace?.folders.find((f: any) => f.id === folderId)
    expect(findFolder).toBeTruthy()

    const folder = await gCall({
      source: DeleteWorkspaceItemMutation,
      variableValues: {
        input: {
          id: folderId,
          type: WorkspaceItemType.Folder
        }
      },
      token: user?.token
    })

    expect(folder.errors).toBeUndefined()
    expect(folder.data?.deleteWorkspaceItem).toBeTruthy()

    const coreStateAfter = await gCall({
      source: CoreStateQuery,
      token: user?.token
    })
    findWorkspace = coreStateAfter.data?.workspaces.find(
      (w: any) => w.id === workspaceId
    )
    findFolder = findWorkspace?.folders.find((f: any) => f.id === folderId)
    expect(findFolder).toBeUndefined()
  })

  test("Delete Workspace", async () => {
    const coreStateBefore = await gCall({
      source: CoreStateQuery,
      token: user?.token
    })
    let findWorkspace = coreStateBefore.data?.workspaces.find(
      (w: any) => w.id === workspaceId
    )
    expect(findWorkspace).toBeTruthy()
    const workspace = await gCall({
      source: DeleteWorkspaceItemMutation,
      variableValues: {
        input: {
          id: workspaceId,
          type: WorkspaceItemType.Workspace
        }
      },
      token: user?.token
    })

    expect(workspace.errors).toBeUndefined()
    expect(workspace.data?.deleteWorkspaceItem).toBeTruthy()

    const coreStateAfter = await gCall({
      source: CoreStateQuery,
      token: user?.token
    })
    findWorkspace = coreStateAfter.data?.workspaces.find(
      (w: any) => w.id === workspaceId
    )
    expect(findWorkspace).toBeUndefined()
  })
})

beforeAll(async () => {
  user = await getUser()
  await resetState()
})
