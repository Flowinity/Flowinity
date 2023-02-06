import { Service } from "typedi"
import { Workspace } from "@app/models/workspace.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { Note } from "@app/models/note.model"
import Errors from "@app/lib/errors"
import cryptoRandomString from "crypto-random-string"

//create class of NoteData
export class NoteField {
  type:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "p"
    | "textarea"
    | "input"
    | "image"
    | "checkbox"
    | "radio"
    | "button"
  value: string | number | boolean | object
  styles: string
  creatorId: number
  lastEditorId: number
  locked: boolean
}
export class NoteData {
  fields: NoteField[]
  styles: string
  creatorId: number
  lastEditorId: number
  constructor(userId: number) {
    this.fields = [
      {
        type: "h1",
        value: "My new TPUDOC",
        styles: "",
        creatorId: userId,
        lastEditorId: userId,
        locked: false
      }
    ]
    this.styles = ""
    this.creatorId = userId
    this.lastEditorId = userId
  }
}

export class NoteDataV2 {
  blocks: object[]
}
@Service()
export class NoteService {
  constructor() {}

  async renameFolder(id: number, name: string, userId: number) {
    const folder = await this.getWorkspace(id, userId, "folder")
    if (!folder) throw Errors.NOT_FOUND
    await WorkspaceFolder.update(
      {
        name
      },
      {
        where: {
          id
        }
      }
    )
    return true
  }

  async deleteFolder(id: number, userId: number) {
    const folder = await this.getWorkspace(id, userId, "folder")
    if (!folder) throw Errors.NOT_FOUND
    await Note.destroy({
      where: {
        workspaceFolderId: id
      }
    })
    await WorkspaceFolder.destroy({
      where: {
        id
      }
    })
    return true
  }

  async deleteNote(id: number, userId: number) {
    const note = await this.getNote(id, userId)
    if (!note?.permissions?.configure) throw Errors.NOT_FOUND
    await Note.destroy({
      where: {
        id
      }
    })
    return true
  }

  async createFolder(name: string, id: number, userId: number) {
    const workspace = await Workspace.findOne({
      where: {
        id,
        userId
      }
    })
    if (!workspace) throw Errors.NOT_FOUND
    return await WorkspaceFolder.create({
      name,
      workspaceId: id
    })
  }

  async getWorkspaces(userId: number) {
    return await Workspace.findAll({
      where: {
        userId
      }
    })
  }

  async getWorkspace(id: number, userId: number, type: "workspace" | "folder") {
    const workspace = await Workspace.findOne({
      where: {
        id,
        userId
      }
    })
    if (type === "folder") {
      const workspace = await Workspace.findOne({
        where: {
          userId
        },
        include: [
          {
            model: WorkspaceFolder,
            as: "folder",
            where: {
              id
            },
            required: true
          }
        ]
      })
      if (!workspace) throw Errors.NOT_FOUND
      const folders = await WorkspaceFolder.findAll({
        where: {
          workspaceId: workspace.id
        },
        include: [
          {
            model: Note,
            as: "children"
          }
        ]
      })
      return {
        ...workspace.toJSON(),
        folders
      }
    }
    if (!workspace) throw Errors.NOT_FOUND
    const folders = await WorkspaceFolder.findAll({
      where: {
        workspaceId: workspace.id
      },
      include: [
        {
          model: Note,
          as: "children"
        }
      ]
    })
    return {
      ...workspace.toJSON(),
      folders
    }
  }

  async createWorkspace(name: string, userId: number) {
    const workspace = await Workspace.create({
      name,
      userId
    })

    const folder = await WorkspaceFolder.create({
      name: "Documents",
      workspaceId: workspace.id
    })

    await Note.create({
      name: `Document 1`,
      workspaceFolderId: folder.id,
      data: {}
    })

    return workspace
  }

  async getNote(id: number | string, userId: number) {
    const note = await Note.findOne({
      where: {
        id
      }
    })
    if (!note || !userId || id.toString().length === 64) {
      const note = await Note.findOne({
        where: {
          shareLink: id
        }
      })
      if (!note) throw Errors.NOT_FOUND
      return {
        ...note.toJSON(),
        permissions: {
          modify: false,
          configure: false,
          read: true
        }
      }
    }
    const workspace = await this.getWorkspace(
      note.workspaceFolderId,
      userId,
      "folder"
    )
    if (!workspace) throw Errors.NOT_FOUND
    return {
      ...note.toJSON(),
      permissions: {
        modify: true,
        configure: true,
        read: true
      }
    }
  }

  async saveNote(id: number, data: NoteDataV2, userId: number, name?: string) {
    const note = await Note.findOne({
      where: {
        id
      }
    })
    if (!note) throw Errors.NOT_FOUND
    const workspace = await this.getWorkspace(
      note.workspaceFolderId,
      userId,
      "folder"
    )
    if (!workspace) throw Errors.NOT_FOUND
    await note.update({
      data,
      name
    })
    return note
  }

  async createNote(name: string, workspaceFolderId: number, userId: number) {
    const workspace = await this.getWorkspace(
      workspaceFolderId,
      userId,
      "folder"
    )
    if (!workspace) throw Errors.NOT_FOUND
    return await Note.create({
      name,
      workspaceFolderId,
      data: {}
    })
  }

  async toggleShareLink(id: number, userId: number) {
    const note = await Note.findOne({
      where: {
        id
      }
    })
    if (!note) throw Errors.NOT_FOUND
    const workspace = await this.getWorkspace(
      note.workspaceFolderId,
      userId,
      "folder"
    )
    if (!workspace) throw Errors.NOT_FOUND
    const shareLink = note.shareLink
      ? null
      : await cryptoRandomString({ length: 64 })
    await note.update({
      shareLink
    })
    return {
      shareLink
    }
  }
}
