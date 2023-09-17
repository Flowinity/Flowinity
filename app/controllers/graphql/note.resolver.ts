import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { NoteService } from "@app/services/note.service"
import { Note } from "@app/models/note.model"
import { NoteVersion } from "@app/models/noteVersion.model"
import {
  CreateNoteInput,
  NoteInput,
  SaveNoteInput
} from "@app/classes/graphql/workspaces/noteInput"

@Resolver(Note)
@Service()
export class NoteResolver {
  constructor(private workspaceService: NoteService) {}

  @FieldResolver(() => [NoteVersion])
  async versions(@Root() note: Note, @Ctx() ctx: Context) {
    if (ctx.meta.shareLink) return []
    return note.$get("versions")
  }

  @Authorization({
    scopes: ["workspaces.view"],
    userOptional: true
  })
  @Query(() => Note, {
    nullable: true
  })
  async note(
    @Arg("input", () => NoteInput) input: NoteInput,
    @Ctx() ctx: Context
  ): Promise<Note | null> {
    if (!input.id && !input.shareLink)
      throw new GraphQLError("No id or shareLink provided")
    try {
      if (input.shareLink) ctx.meta.shareLink = true
      return await this.workspaceService.getNote(
        input.id || input.shareLink || 0,
        ctx.user?.id
      )
    } catch {
      return null
    }
  }

  @Authorization({
    scopes: ["workspaces.modify"]
  })
  @Mutation(() => Note)
  async saveNote(
    @Arg("input", () => SaveNoteInput) input: SaveNoteInput,
    @Ctx() ctx: Context
  ): Promise<Note> {
    try {
      return await this.workspaceService.saveNote(
        input.id,
        input.data,
        ctx.user!!.id,
        input.manualSave,
        input.name
      )
    } catch {
      throw new GraphQLError(
        "Failed to save note. Perhaps you don't have access?"
      )
    }
  }

  @Authorization({
    scopes: ["workspaces.create"]
  })
  @Mutation(() => Note)
  async createNote(
    @Arg("input", () => CreateNoteInput) input: CreateNoteInput,
    @Ctx() ctx: Context
  ) {
    try {
      return await this.workspaceService.createNote(
        input.name,
        input.workspaceFolderId,
        ctx.user!!.id
      )
    } catch {
      throw new GraphQLError(
        "Failed to create note. Perhaps you don't have access to the Workspace?"
      )
    }
  }

  @Authorization({
    scopes: ["workspaces.modify"]
  })
  @Mutation(() => Note, {
    description: "Toggle the ShareLink for a Note."
  })
  async toggleNoteShare(
    @Arg("input", () => Int, {
      description: "ID of Note"
    })
    input: number,
    @Ctx() ctx: Context
  ) {
    await this.workspaceService.toggleShareLink(input, ctx.user!!.id)
    return await this.note(
      {
        id: input
      },
      ctx
    )
  }
}
