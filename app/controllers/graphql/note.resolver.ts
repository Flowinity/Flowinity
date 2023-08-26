import {
  Arg,
  Authorized,
  Ctx,
  Field,
  FieldResolver,
  Info,
  Int,
  Mutation,
  Query,
  Resolver,
  Root
} from "type-graphql"
import { UserUtilsService } from "@app/services/userUtils.service"
import { User } from "@app/models/user.model"
import { Service } from "typedi"
import { Session } from "@app/models/session.model"
import { Op } from "sequelize"
import { Experiment } from "@app/models/experiment.model"
import { Subscription } from "@app/models/subscription.model"
import { Domain } from "@app/models/domain.model"
import { Plan } from "@app/models/plan.model"
import { Theme } from "@app/models/theme.model"
import { Integration } from "@app/models/integration.model"
import { Badge } from "@app/models/badge.model"
import { Includeable } from "sequelize"
import { Context } from "@app/types/graphql/context"
import { GraphQLResolveInfo } from "graphql/type"
import { Notification } from "@app/models/notification.model"
import { CollectionService } from "@app/services/collection.service"
import { Collection } from "@app/models/collection.model"
import {
  CollectionFilter,
  CollectionInput,
  PermissionsMetadata,
  UserCollectionsInput
} from "@app/classes/graphql/collections/collections"
import { CollectionUser } from "@app/models/collectionUser.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Upload } from "@app/models/upload.model"
import {
  partialUserBase,
  PartialUserBase
} from "@app/classes/graphql/user/partialUser"
import { AccessLevel } from "@app/enums/admin/AccessLevel"
import { Authorization } from "@app/lib/graphql/AuthChecker"
import { GraphQLError } from "graphql/error"
import { PagerResponse } from "@app/classes/graphql/gallery/galleryResponse"
import { Workspace } from "@app/models/workspace.model"
import { NoteService } from "@app/services/note.service"
import { WorkspaceFolder } from "@app/models/workspaceFolder.model"
import { WorkspaceUser } from "@app/models/workspaceUser.model"
import { Note } from "@app/models/note.model"
import { NoteVersion } from "@app/models/noteVersion.model"
import { NoteInput } from "@app/classes/graphql/workspaces/noteInput"
import { NotePermissionsMetadata } from "@app/classes/graphql/workspaces/note"
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
        input.id || input.shareLink,
        ctx.user?.id
      )
    } catch {
      return null
    }
  }
}