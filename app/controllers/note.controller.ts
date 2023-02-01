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
          req.user.id
        )
        res.json(workspace)
      }
    )
  }
}
