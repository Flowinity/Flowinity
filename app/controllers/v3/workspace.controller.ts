import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Patch,
  Post
} from "routing-controllers"
import { Service } from "typedi"
import { Auth } from "@app/lib/auth"
import Errors from "@app/lib/errors"
import { User } from "@app/models/user.model"
import { NoteDataV2, NoteService } from "@app/services/note.service"

@Service()
@JsonController("/notes")
export class WorkspaceControllerV3 {
  constructor(private readonly noteService: NoteService) {}

  @Get("/workspaces")
  async getWorkspaces(@Auth("workspaces.view") user: User) {
    return await this.noteService.getWorkspaces(user.id)
  }

  @Post("/workspaces")
  async createWorkspace(
    @Auth("workspaces.create") user: User,
    @Body()
    body: {
      name: string
    }
  ) {
    return await this.noteService.createWorkspace(body.name, user.id)
  }

  @Get("/workspace/:workspaceId")
  async getWorkspace(
    @Auth("workspaces.view") user: User,
    @Param("workspaceId") workspaceId: number
  ) {
    return await this.noteService.getWorkspace(
      workspaceId,
      user.id,
      "workspace"
    )
  }

  @Get("/recent")
  async getRecentNotes(@Auth("workspaces.view") user: User) {
    return await this.noteService.getRecent(user.id)
  }

  @Get("/:noteId")
  async getNote(
    @Auth("workspaces.view", false) user: User,
    @Param("noteId") noteId: number | string
  ) {
    return await this.noteService.getNote(noteId, user?.id)
  }

  @Patch("/:noteId")
  async updateNote(
    @Auth("workspaces.modify") user: User,
    @Param("noteId") noteId: number,
    @Body()
    body: {
      name?: string
      data?: NoteDataV2
      manualSave?: boolean
    }
  ) {
    if (body.name && !body.data) {
      return await this.noteService.renameNote(noteId, body.name, user.id)
    }

    if (body.data) {
      return await this.noteService.saveNote(
        noteId,
        body.data,
        user.id,
        body.manualSave,
        body.name
      )
    }

    throw Errors.INVALID_PARAMETERS
  }

  @Patch("/workspaces/:workspaceId")
  async updateWorkspace(
    @Auth("workspaces.modify") user: User,
    @Param("workspaceId") workspaceId: number,
    @Body()
    body: {
      name: string
    }
  ) {
    return await this.noteService.renameWorkspace(
      workspaceId,
      body.name,
      user.id
    )
  }

  @Post("")
  async createNote(
    @Auth("workspaces.create") user: User,
    @Body()
    body: {
      name: string
      workspaceFolderId: number
    }
  ) {
    return await this.noteService.createNote(
      body.name,
      body.workspaceFolderId,
      user.id
    )
  }

  @Patch("/:id/share")
  async shareNote(
    @Auth("workspaces.modify") user: User,
    @Param("id") id: number
  ) {
    return await this.noteService.toggleShareLink(id, user.id)
  }

  @Post("/folder")
  async createFolder(
    @Auth("workspaces.create") user: User,
    @Body()
    body: {
      name: string
      workspaceId: number
    }
  ) {
    return await this.noteService.createFolder(
      body.name,
      body.workspaceId,
      user.id
    )
  }

  @Delete("/:id")
  async deleteNote(
    @Auth("workspaces.modify") user: User,
    @Param("id") id: number
  ) {
    return await this.noteService.deleteNote(id, user.id)
  }

  @Delete("/workspace/:id")
  async deleteWorkspace(
    @Auth("workspaces.modify") user: User,
    @Param("id") id: number
  ) {
    return await this.noteService.deleteWorkspace(id, user.id)
  }

  @Delete("/folder/:id")
  async deleteFolder(
    @Auth("workspaces.modify") user: User,
    @Param("id") id: number
  ) {
    return await this.noteService.deleteFolder(id, user.id)
  }

  @Patch("/folder/:id")
  async updateFolder(
    @Auth("workspaces.modify") user: User,
    @Param("id") id: number,
    @Body()
    body: {
      name: string
    }
  ) {
    return await this.noteService.renameFolder(id, body.name, user.id)
  }

  @Patch("/:noteId/restore/:versionId")
  async restoreNote(
    @Auth("workspaces.modify") user: User,
    @Param("noteId") noteId: number,
    @Param("versionId") versionId: string
  ) {
    await this.noteService.restoreVersion(noteId, versionId, user.id)
  }

  // TPU Workspaces collaboration sharing code -- to port from v2 to v3
  /*
      this.router.all(
      "/workspace/:id/*",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          if (!req.user.administrator) throw Errors.COMING_SOON
          const id = parseInt(req.params.id)
          const check = await this.noteService.getWorkspacePermissions(
            id,
            req.user.id,
            "configure"
          )
          if (!check) throw Errors.WORKSPACE_NO_PERMISSION
          next()
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.post(
      "/workspace/:id/user",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const id = parseInt(req.params.id)
          const { username } = req.body
          await this.noteService.addUserToWorkspace(
            id,
            req.user.id,
            username,
            req.body.write,
            req.body.configure,
            true
          )
          res.sendStatus(204)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.delete(
      "/workspace/:id/user/:userId",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const id = parseInt(req.params.id)
          const userId = parseInt(req.params.userId)
          await this.noteService.removeUserFromWorkspace(id, userId)
          res.sendStatus(204)
        } catch (e) {
          next(e)
        }
      }
    )

    this.router.patch(
      "/workspace/:id/user",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response, next: NextFunction) => {
        try {
          const id = parseInt(req.params.id)
          const userId = req.body.id
          await this.noteService.updateUser(
            id,
            userId,
            req.body.write,
            req.body.configure,
            true
          )
          res.sendStatus(204)
        } catch (e) {
          next(e)
        }
      }
    )
   */
}
