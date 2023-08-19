import { Service } from "typedi"
import { Workspace } from "@app/models/workspace.model"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { Note } from "@app/models/note.model"
import Errors from "@app/lib/errors"
import cryptoRandomString from "crypto-random-string"
import { NoteVersion } from "@app/models/noteVersion.model"
import { WorkspaceUser } from "@app/models/workspaceUser.model"
import { User } from "@app/models/user.model"
import { Friend } from "@app/models/friend.model"
import { WorkspacesDownloadService } from "@app/services/workspaces/download.service"
import { BadRequestError } from "routing-controllers"
import { partialUserBase } from "@app/classes/graphql/user/partialUser"

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
  constructor(private readonly downloadService: WorkspacesDownloadService) {}

  async renameWorkspace(id: number, name: string, userId: number) {
    const workspace = await this.getWorkspace(id, userId, "workspace")
    if (!workspace) throw Errors.NOT_FOUND
    await Workspace.update(
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

  async getRecent(userId: number) {
    return await Workspace.findAll({
      include: [
        {
          model: WorkspaceFolder,
          as: "folders",
          include: [
            {
              model: Note,
              as: "notes",
              attributes: {
                exclude: ["data"]
              },
              include: [
                {
                  model: WorkspaceFolder,
                  as: "folder",
                  attributes: ["id", "name"]
                }
              ],
              order: [["updatedAt", "DESC"]]
            }
          ],
          limit: 12
        }
      ],
      where: {
        userId
      },
      order: [["updatedAt", "DESC"]]
    })
  }

  async restoreVersion(id: number, version: string, userId: number) {
    const note = await this.getNote(id, userId)
    if (!note?.permissions?.modify) throw Errors.NOT_FOUND

    const versionData = note.versions.find((v: Note) => v.id === version)
    if (!versionData) throw Errors.NOT_FOUND

    await Note.update(
      {
        data: versionData.data
      },
      {
        where: {
          id
        }
      }
    )

    return true
  }

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

  async deleteWorkspace(id: number, userId: number) {
    const workspace = await this.getWorkspace(id, userId, "workspace")
    console.log(workspace)
    if (!workspace?.permissionsMetadata?.configure) throw Errors.NOT_FOUND
    const notes = await Note.findAll({
      include: [
        {
          model: WorkspaceFolder,
          as: "folder",
          required: true,
          where: {
            workspaceId: id
          }
        }
      ]
    })

    await Note.destroy({
      where: {
        id: notes.map((n) => n.id)
      }
    })

    await WorkspaceFolder.destroy({
      where: {
        workspaceId: id
      }
    })

    await Workspace.destroy({
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
    const workspaces = await Workspace.findAll({
      where: {
        userId
      },
      include: [
        {
          model: WorkspaceUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ]
        },
        {
          model: WorkspaceFolder,
          as: "folders",
          include: [
            {
              model: Note,
              as: "children",
              attributes: ["id", "name", "createdAt", "updatedAt"]
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    })

    const shared = await Workspace.findAll({
      include: [
        {
          model: WorkspaceFolder,
          as: "folders",
          include: [
            {
              model: Note,
              as: "children",
              attributes: ["id", "name", "createdAt", "updatedAt"]
            }
          ]
        },
        {
          model: WorkspaceUser,
          as: "users",
          include: [
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ]
        },
        {
          model: WorkspaceUser,
          as: "recipient",
          required: true,
          where: {
            recipientId: userId
          },
          include: [
            {
              model: User,
              as: "user",
              attributes: partialUserBase
            }
          ]
        },
        {
          model: User,
          as: "user",
          attributes: partialUserBase
        }
      ]
    })

    return [
      ...workspaces.map((workspace) => workspace.toJSON()),
      ...shared.map((workspace) => {
        return {
          ...workspace.toJSON(),
          shared: true,
          permissionsMetadata: {
            write: workspace.dataValues.recipient.dataValues.write,
            configure: workspace.dataValues.recipient.dataValues.configure,
            read: workspace.dataValues.recipient.dataValues.read
          }
        }
      })
    ]
  }

  async getWorkspace(id: number, userId: number, type: "workspace" | "folder") {
    const include = [
      {
        model: WorkspaceUser,
        as: "users",
        include: [
          {
            model: User,
            as: "user",
            attributes: partialUserBase
          }
        ]
      },
      {
        model: WorkspaceFolder,
        as: "folders",
        include: [
          {
            model: Note,
            as: "children",
            attributes: ["id", "name", "createdAt", "updatedAt"]
          }
        ]
      },
      {
        model: User,
        as: "user",
        attributes: partialUserBase
      }
    ]
    const workspace = await Workspace.findOne({
      where: {
        id,
        userId
      },
      include
    })
    if (type === "folder") {
      const workspace = await Workspace.findOne({
        where: {
          userId
        },
        include: [
          ...include,
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
      if (!workspace) {
        const workspace = await Workspace.findOne({
          include: [
            ...include,
            {
              model: WorkspaceFolder,
              as: "folder",
              where: {
                id
              },
              required: true
            },
            {
              model: WorkspaceUser,
              as: "recipient",
              required: true,
              where: {
                recipientId: userId
              }
            }
          ]
        })
        if (!workspace) throw Errors.NOT_FOUND
        return {
          ...workspace.toJSON(),
          shared: true,
          permissionsMetadata: {
            write: workspace.dataValues.recipient.dataValues.write,
            configure: workspace.dataValues.recipient.dataValues.configure,
            read: workspace.dataValues.recipient.dataValues.read
          }
        }
      }
      return {
        ...workspace.toJSON(),
        shared: false,
        permissionsMetadata: {
          write: true,
          configure: true,
          read: true
        }
      }
    }
    if (!workspace) {
      const workspace = await Workspace.findOne({
        where: {
          id
        },
        include: [
          ...include,
          {
            model: WorkspaceUser,
            as: "recipient",
            required: true,
            where: {
              recipientId: userId
            }
          }
        ]
      })
      if (!workspace) throw Errors.NOT_FOUND
      return {
        ...workspace.toJSON(),
        shared: true,
        permissionsMetadata: {
          write: workspace.dataValues.recipient.dataValues.write,
          configure: workspace.dataValues.recipient.dataValues.configure,
          read: workspace.dataValues.recipient.dataValues.read
        }
      }
    }
    return {
      ...workspace.toJSON(),
      shared: false,
      permissionsMetadata: {
        write: true,
        configure: true,
        read: true
      }
    }
  }

  async getFolder(id: number, userId: number) {
    const folder = await WorkspaceFolder.findOne({
      where: {
        id
      },
      include: [
        {
          model: Note,
          as: "children",
          attributes: [
            "id",
            "name",
            "createdAt",
            "updatedAt",
            "data",
            "shareLink"
          ]
        }
      ]
    })
    if (!folder) throw Errors.NOT_FOUND
    console.log(folder.name)
    const workspace = await this.getWorkspace(
      folder.workspaceId,
      userId,
      "workspace"
    )
    if (!workspace) throw Errors.NOT_FOUND
    return folder
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

  async getNote(id: number | string, userId: number | undefined) {
    const note = await Note.findOne({
      where: {
        id
      },
      include: [
        {
          model: NoteVersion,
          as: "versions",
          limit: 50,
          order: [["createdAt", "DESC"]]
        }
      ]
    })
    if (!note || !userId || id.toString().length === 64) {
      const note = await Note.findOne({
        where: {
          shareLink: id
        },
        attributes: {
          exclude: ["versions"]
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

  async renameNote(id: number, name: string, userId: number) {
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
    if (!workspace?.permissionsMetadata?.write) throw Errors.NOT_FOUND
    await Note.update(
      {
        name
      },
      {
        where: {
          id
        }
      }
    )
    return note
  }

  async saveNote(
    id: number,
    data: NoteDataV2,
    userId: number,
    manualSave: boolean = false,
    name?: string
  ) {
    let note = await Note.findOne({
      where: {
        id
      },
      include: [
        {
          model: NoteVersion,
          as: "versions",
          limit: 50,
          order: [["createdAt", "DESC"]]
        }
      ]
    })
    if (!note) throw Errors.NOT_FOUND
    const workspace = await this.getWorkspace(
      note.workspaceFolderId,
      userId,
      "folder"
    )
    if (!workspace?.permissionsMetadata?.write) throw Errors.NOT_FOUND
    if (!note.versions) note.versions = []

    const latestSave = note.versions[0]
    let versions = note.versions
    if (
      !latestSave ||
      new Date().getTime() - new Date(latestSave?.createdAt).getTime() >
        5 * 60 * 1000 ||
      (manualSave &&
        new Date().getTime() - new Date(latestSave?.createdAt).getTime() >
          30 * 1000)
    ) {
      const version = await NoteVersion.create({
        noteId: note.id,
        data,
        userId
      })
      versions = [version, ...versions]
    }
    await Note.update(
      {
        data,
        name
      },
      {
        where: {
          id
        }
      }
    )
    return {
      ...note.toJSON(),
      versions: versions.slice(0, 50)
    }
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

  async removeUserFromWorkspace(workspaceId: number, recipientId: number) {
    const result = await WorkspaceUser.destroy({
      where: {
        workspaceId,
        recipientId
      }
    })

    if (!result) throw Errors.WORKSPACE_USER_NOT_FOUND

    return result
  }

  async addUserToWorkspace(
    workspaceId: number,
    senderId: number,
    username: string,
    write: boolean,
    configure: boolean,
    read: boolean
  ) {
    const workspace = await Workspace.findOne({
      where: {
        id: workspaceId
      }
    })

    if (!workspace) {
      throw Errors.WORKSPACE_NOT_FOUND
    }

    const user = await User.findOne({
      where: {
        username
      },
      attributes: ["id", "username", "avatar", "email"]
    })

    if (!user) {
      throw Errors.USER_NOT_FOUND
    }

    if (workspace.userId === user.id) {
      throw Errors.CANNOT_ADD_OWNER
    }

    const friend = await Friend.findOne({
      where: {
        userId: senderId,
        friendId: user.id,
        status: "accepted"
      }
    })

    if (!friend) {
      throw Errors.NOT_FRIENDS_WITH_USER_COLLECTION
    }

    return {
      ...(
        await WorkspaceUser.create({
          workspaceId,
          recipientId: user.id,
          senderId: senderId,
          write,
          configure,
          read,
          identifier: workspaceId + "-" + user.id
        })
      ).dataValues,
      user,
      workspace: {
        id: workspace.id,
        name: workspace.name
      }
    }
  }

  async updateUser(
    workspaceId: number,
    recipientId: number,
    write: boolean,
    configure: boolean,
    read: boolean
  ) {
    const result = await WorkspaceUser.update(
      {
        write,
        configure,
        read
      },
      {
        where: {
          workspaceId,
          recipientId
        }
      }
    )

    if (!result) throw Errors.WORKSPACE_USER_NOT_FOUND

    return result
  }

  async getWorkspacePermissions(
    workspaceId: number,
    userId: number,
    permission: "read" | "write" | "configure"
  ) {
    const workspace = await WorkspaceUser.findOne({
      where: {
        workspaceId,
        recipientId: userId
      }
    })

    if (!workspace) {
      const workspace = await Workspace.findOne({
        where: {
          id: workspaceId,
          userId
        }
      })

      if (!workspace) throw Errors.WORKSPACE_USER_NOT_FOUND

      return true
    }

    return workspace[permission]
  }

  async downloadNote(note: Note, type: "tpudoc" | "html" | "docx") {
    console.log(note.data, type)
    switch (type) {
      case "tpudoc": {
        return note.data
      }
      case "html": {
        return await this.downloadService.html(<NoteDataV2>note.data)
      }
      case "docx": {
        return await this.downloadService.docx(<NoteDataV2>note.data)
      }
      default: {
        throw new BadRequestError("Invalid type, must be tpudoc, html or docx")
      }
    }
  }
}
