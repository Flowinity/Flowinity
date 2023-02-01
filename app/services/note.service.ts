import { Service } from "typedi"
import { Workspace } from "@app/models/workspace.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { Note } from "@app/models/note.model"
import Errors from "@app/lib/errors"

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
@Service()
export class NoteService {
  constructor() {}

  async getWorkspaces(userId: number) {
    return await Workspace.findAll({
      where: {
        userId
      }
    })
  }

  async getWorkspace(id: number, userId: number) {
    const workspace = await Workspace.findOne({
      where: {
        id,
        userId
      }
    })
    if (!workspace) throw Errors.NOT_FOUND
    let folders = await WorkspaceFolder.findAll({
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
      name: `${name} Workspace's Document`,
      workspaceFolderId: folder.id,
      data: new NoteData(userId)
    })

    return workspace
  }
}
