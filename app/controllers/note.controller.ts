import { Response } from "express"
import { Service } from "typedi"
import Router from "express-promise-router"
import { NoteService } from "@app/services/note.service"
import { RequestAuth } from "@app/types/express"
import auth from "@app/lib/auth"
@Service()
export class NoteController {
  router: any

  constructor(private readonly noteService: NoteService) {
    this.configureRouter()
  }

  private configureRouter(): void {
    this.router = Router()

    this.router.get(
      "/workspaces",
      auth("workspaces.view"),
      async (req: RequestAuth, res: Response) => {
        const notes = await this.noteService.getWorkspaces(req.user.id)
        res.json(notes)
      }
    )

    this.router.post(
      "/workspaces",
      auth("workspaces.create"),
      async (req: RequestAuth, res: Response) => {
        const { name } = req.body
        const workspace = await this.noteService.createWorkspace(
          name,
          req.user.id
        )
        res.json(workspace)
      }
    )

    this.router.get(
      "/workspace/:id",
      auth("workspaces.view"),
      async (req: RequestAuth, res: Response) => {
        const { id } = req.params
        const workspace = await this.noteService.getWorkspace(
          parseInt(id),
          req.user.id,
          "workspace"
        )
        res.json(workspace)
      }
    )

    this.router.get(
      "/:id",
      auth("workspaces.view", true),
      async (req: RequestAuth, res: Response) => {
        const { id } = req.params
        const note = await this.noteService.getNote(id, req.user?.id)
        res.json(note)
      }
    )

    this.router.patch(
      "/:id",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response) => {
        const { id } = req.params
        const { data, name } = req.body
        const note = await this.noteService.saveNote(
          parseInt(id),
          data,
          req.user.id,
          req.body.manualSave,
          name
        )
        res.json(note)
      }
    )

    this.router.post(
      "/",
      auth("workspaces.create"),
      async (req: RequestAuth, res: Response) => {
        const { name, workspaceFolderId } = req.body
        const note = await this.noteService.createNote(
          name,
          workspaceFolderId,
          req.user.id
        )
        res.json(note)
      }
    )

    this.router.patch(
      "/:id/share",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response) => {
        const { id } = req.params
        const note = await this.noteService.toggleShareLink(
          parseInt(id),
          req.user.id
        )
        res.json(note)
      }
    )

    this.router.post(
      "/folder",
      auth("workspaces.create"),
      async (req: RequestAuth, res: Response) => {
        const { name, workspaceId } = req.body
        const folder = await this.noteService.createFolder(
          name,
          workspaceId,
          req.user.id
        )
        res.json(folder)
      }
    )

    this.router.delete(
      "/:id",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response) => {
        const { id } = req.params
        await this.noteService.deleteNote(parseInt(id), req.user.id)
        res.sendStatus(204)
      }
    )

    this.router.delete(
      "/folder/:id",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response) => {
        const { id } = req.params
        await this.noteService.deleteFolder(parseInt(id), req.user.id)
        res.sendStatus(204)
      }
    )

    this.router.patch(
      "/folder/:id",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response) => {
        const { id } = req.params
        const { name } = req.body
        const folder = await this.noteService.renameFolder(
          parseInt(id),
          name,
          req.user.id
        )
        res.json(folder)
      }
    )

    this.router.patch(
      "/:id/restore/:version",
      auth("workspaces.modify"),
      async (req: RequestAuth, res: Response) => {
        const { id, version } = req.params
        await this.noteService.restoreVersion(
          parseInt(id),
          version,
          req.user.id
        )
        res.sendStatus(204)
      }
    )
  }
}
