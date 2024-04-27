import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { Service } from "typedi"
import { Context } from "@app/types/graphql/context"
import { PartialUserBase } from "@app/classes/graphql/user/partialUser"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { Workspace } from "@app/models/workspace.model"
import { NoteService } from "@app/services/note.service"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { WorkspaceUser } from "@app/models/workspaceUser.model"
import {
  CreateWorkspaceFolderInput,
  DeleteWorkspaceItemInput,
  WorkspaceItemType
} from "@app/classes/graphql/workspaces/noteInput"

@Resolver(Workspace)
@Service()
export class WorkspaceResolver {
  constructor(private workspaceService: NoteService) {}

  @Authorization({
    scopes: ["workspaces.view"],
    userOptional: true
  })
  @Query(() => [Workspace])
  async workspaces(@Ctx() ctx: Context) {
    if (!ctx.user) return []
    const owned = await Workspace.findAll({
      where: {
        userId: ctx.user.id
      }
    })
    const shared = await Workspace.findAll({
      include: [
        {
          model: WorkspaceUser,
          as: "recipient",
          where: {
            recipientId: ctx.user.id
          }
        }
      ]
    })
    return [...owned, ...shared]
  }

  @FieldResolver(() => [WorkspaceUser])
  async users(@Root() workspace: Workspace) {
    return await workspace.$get("users")
  }

  @FieldResolver(() => PartialUserBase)
  async user(@Root() workspace: Workspace) {
    return await workspace.$get("user")
  }

  @FieldResolver(() => [WorkspaceFolder])
  async folders(@Root() workspace: Workspace) {
    return await workspace.$get("folders")
  }

  @Authorization({
    scopes: ["workspaces.create"]
  })
  @Mutation(() => WorkspaceFolder, {
    description: "Create a new Workspace Folder."
  })
  async createWorkspaceFolder(
    @Arg("input", () => CreateWorkspaceFolderInput)
    input: CreateWorkspaceFolderInput,
    @Ctx() ctx: Context
  ) {
    try {
      return await this.workspaceService.createFolder(
        input.name,
        input.workspaceId,
        ctx.user!!.id
      )
    } catch {
      throw new GraphQLError(
        "Workspace not found. Perhaps you don't have access?"
      )
    }
  }

  @Authorization({
    scopes: ["workspaces.create"]
  })
  @Mutation(() => Workspace, {
    description: "Create workspace"
  })
  async createWorkspace(
    @Arg("input", () => String, {
      description: "Name of workspace"
    })
    name: string,
    @Ctx() ctx: Context
  ) {
    try {
      return await this.workspaceService.createWorkspace(name, ctx.user!!.id)
    } catch {
      throw new GraphQLError(
        "Failed to create Workspace. Please try again later."
      )
    }
  }

  @Authorization({
    scopes: ["workspaces.modify"]
  })
  @Mutation(() => Boolean, {
    description: "Delete a Note."
  })
  async deleteWorkspaceItem(
    @Arg("input", () => DeleteWorkspaceItemInput)
    input: DeleteWorkspaceItemInput,
    @Ctx() ctx: Context
  ) {
    try {
      switch (input.type) {
        case WorkspaceItemType.NOTE:
          await this.workspaceService.deleteNote(input.id, ctx.user!!.id)
          break
        case WorkspaceItemType.FOLDER:
          await this.workspaceService.deleteFolder(input.id, ctx.user!!.id)
          break
        case WorkspaceItemType.WORKSPACE:
          await this.workspaceService.deleteWorkspace(input.id, ctx.user!!.id)
          break
      }
      return true
    } catch {
      throw new GraphQLError(
        `Failed to delete ${input.type}. Perhaps you don't have access?`
      )
    }
  }
}
