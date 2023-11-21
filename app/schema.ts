import { User } from "@app/models/user.model"
import { Badge } from "@app/models/badge.model"
import { Collection } from "@app/models/collection.model"
import { Upload } from "@app/models/upload.model"
import { routingControllersToSpec } from "routing-controllers-openapi"
import { BadgeAssociation } from "@app/models/badgeAssociation.model"
import {
  JsonSchemaManager,
  OpenApi3Strategy
  //@ts-ignore
} from "@alt3/sequelize-to-json-schemas"
import { getMetadataArgsStorage } from "routing-controllers"
import { CollectionItem } from "@app/models/collectionItem.model"
import { Announcement } from "@app/models/announcement.model"
import { Chat } from "@app/models/chat.model"
import { ChatAssociation } from "@app/models/chatAssociation.model"
import { Message } from "@app/models/message.model"
import { CollectionUser } from "@app/models/collectionUser.model"
import { Invite } from "@app/models/invite.model"
import { MessageAttachment } from "@app/models/messageAttachment.model"
import { LegacyUser } from "@app/models/legacyUser.model"
import { Plan } from "@app/models/plan.model"
import { Experiment } from "@app/models/experiment.model"
import { AutoCollectRule } from "@app/models/autoCollectRule.model"
import { AutoCollectApproval } from "@app/models/autoCollectApproval.model"
import { Theme } from "@app/models/theme.model"
import { Domain } from "@app/models/domain.model"
import { Subscription } from "@app/models/subscription.model"
import { Integration } from "@app/models/integration.model"
import { FriendNickname } from "@app/models/friendNickname"
import { Friend } from "@app/models/friend.model"
import { Star } from "@app/models/star.model"

const schemaManager = new JsonSchemaManager()

export class ApiSchema {
  static generateSchema = () => {
    const storage = getMetadataArgsStorage()
    return JSON.parse(
      JSON.stringify(
        routingControllersToSpec(
          storage,
          {
            routePrefix: "/api/v4"
          },
          {
            components: {
              schemas: {
                User: schemaManager.generate(User, new OpenApi3Strategy()),
                Badge: schemaManager.generate(Badge, new OpenApi3Strategy()),
                Collection: schemaManager.generate(
                  Collection,
                  new OpenApi3Strategy()
                ),
                CollectionItem: schemaManager.generate(
                  CollectionItem,
                  new OpenApi3Strategy()
                ),
                CollectionUser: schemaManager.generate(
                  CollectionUser,
                  new OpenApi3Strategy()
                ),
                Upload: schemaManager.generate(Upload, new OpenApi3Strategy()),
                BadgeAssociation: schemaManager.generate(
                  BadgeAssociation,
                  new OpenApi3Strategy()
                ),
                Announcement: schemaManager.generate(
                  Announcement,
                  new OpenApi3Strategy()
                ),
                Chat: schemaManager.generate(Chat, new OpenApi3Strategy()),
                ChatAssociation: schemaManager.generate(
                  ChatAssociation,
                  new OpenApi3Strategy()
                ),
                Message: schemaManager.generate(
                  Message,
                  new OpenApi3Strategy()
                ),
                MessageAttachment: schemaManager.generate(
                  MessageAttachment,
                  new OpenApi3Strategy()
                ),
                LegacyUser: schemaManager.generate(
                  LegacyUser,
                  new OpenApi3Strategy()
                ),
                Invite: schemaManager.generate(Invite, new OpenApi3Strategy()),
                Plan: schemaManager.generate(Plan, new OpenApi3Strategy()),
                Experiment: schemaManager.generate(
                  Experiment,
                  new OpenApi3Strategy()
                ),
                AutoCollectRule: schemaManager.generate(
                  AutoCollectRule,
                  new OpenApi3Strategy()
                ),
                AutoCollectApproval: schemaManager.generate(
                  AutoCollectApproval,
                  new OpenApi3Strategy()
                ),
                Theme: schemaManager.generate(Theme, new OpenApi3Strategy()),
                Domain: schemaManager.generate(Domain, new OpenApi3Strategy()),
                Subscription: schemaManager.generate(
                  Subscription,
                  new OpenApi3Strategy()
                ),
                Integration: schemaManager.generate(
                  Integration,
                  new OpenApi3Strategy()
                ),
                FriendNickname: schemaManager.generate(
                  FriendNickname,
                  new OpenApi3Strategy()
                ),
                Friend: schemaManager.generate(Friend, new OpenApi3Strategy()),
                Star: schemaManager.generate(Star, new OpenApi3Strategy())
              },
              securitySchemes: {
                tpuApiKey: {
                  type: "apiKey",
                  in: "header",
                  name: "Authorization"
                }
              }
            },
            security: [
              {
                tpuApiKey: []
              }
            ],
            basePath: "/api/v4",
            info: {
              title: "TroploPrivateUploader API",
              version: "4.0.0",
              description: "API documentation for TPU."
            },
            schemes: ["https"]
          }
        )
      )
        .replaceAll("api v3", "APIv3")
        .replaceAll("V 3", "V3")
        .replaceAll("V 2", "V2")
        .replaceAll("V 1", "V1")
        .replaceAll("V 4", "V4")
    )
  }
}
