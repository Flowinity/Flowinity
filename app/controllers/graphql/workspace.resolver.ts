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
    return await Workspace.findAll({
      where: {
        userId: ctx.user.id
      }
    })
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
}
