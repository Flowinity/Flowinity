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
import { WorkspaceResolver } from "@app/controllers/graphql/workspace.resolver"
import { CreateWorkspaceMutation } from "../../../frontend-v5/src/graphql/workspaces/createWorkspace.graphql"
import { CreateNoteMutation } from "../../../frontend-v5/src/graphql/workspaces/createNote.graphql"
import { NoteResolver } from "@app/controllers/graphql/note.resolver"
import { CreateWorkspaceFolderMutation } from "../../../frontend-v5/src/graphql/workspaces/createFolder.graphql"
import { SaveNoteMutation } from "../../../frontend-v5/src/graphql/workspaces/saveNote.graphql"
import { NoteQuery } from "../../../frontend-v5/src/graphql/workspaces/note.graphql"

let user: TestUser | null = null

let workspaceId = 0
let folderId = 0
let noteId = 0

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
        data: testData,
        id: noteId,
        manualSave: false
      }
    })
    expect(save.errors).toBeUndefined()
    expect(save.data?.saveNote.id).toBe(noteId)
  })

  test("Load note", async () => {
    const note = await gCall({
      source: NoteQuery,
      token: user?.token
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.note.id).toBe(noteId)
    expect(note.data?.note.data).toMatchObject(testData)
  })

  test("Update Workspace Document Data", async () => {
    const save = await gCall({
      source: SaveNoteMutation,
      variableValues: {
        data: testDataUpdate,
        id: noteId,
        manualSave: true
      }
    })
    expect(save.errors).toBeUndefined()
    expect(save.data?.saveNote.id).toBe(noteId)
  })

  test("Test version control", async () => {
    const note = await gCall({
      source: NoteQuery,
      token: user?.token
    })
    expect(note.errors).toBeUndefined()
    expect(note.data?.note.id).toBe(noteId)
    expect(note.data?.note.data).toMatchObject(testDataUpdate)
    expect(note.data?.note.versions[0].data).toMatchObject(testData)
  })
})

beforeAll(async () => {
  user = await getUser()
})
