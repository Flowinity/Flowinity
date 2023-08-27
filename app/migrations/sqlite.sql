PRAGMA synchronous = OFF;
PRAGMA journal_mode = MEMORY;
BEGIN TRANSACTION;
CREATE TABLE `Announcements` (
                                 `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `userId` integer DEFAULT NULL
    ,  `content` text DEFAULT NULL
    ,  `type` varchar(255) DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
);
CREATE TABLE `AutoCollectApprovals` (
                                        `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `autoCollectRuleId` integer DEFAULT NULL
    ,  `uploadId` integer DEFAULT NULL
    ,  `collectionId` integer DEFAULT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `approved` integer DEFAULT 0
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `info` longtext DEFAULT NULL CHECK (json_valid(`info`))
);
CREATE TABLE `AutoCollectRules` (
                                    `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) DEFAULT NULL
    ,  `enabled` integer DEFAULT 1
    ,  `collectionId` integer DEFAULT NULL
    ,  `requireApproval` integer DEFAULT 1
    ,  `rules` longtext DEFAULT NULL CHECK (json_valid(`rules`))
    ,  `userId` integer DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `BadgeAssociations` (
                                     `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `badgeId` integer NOT NULL
    ,  `userId` integer NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `expiredAt` datetime DEFAULT NULL
    ,  `hidden` integer NOT NULL DEFAULT 0
);
CREATE TABLE `Badges` (
                          `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) NOT NULL
    ,  `description` varchar(255) DEFAULT NULL
    ,  `tooltip` varchar(255) DEFAULT NULL
    ,  `image` varchar(255) DEFAULT NULL
    ,  `icon` varchar(255) DEFAULT NULL
    ,  `color` varchar(255) DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `planId` integer DEFAULT NULL
    ,  `unlocked` integer NOT NULL DEFAULT 0
    ,  `priority` integer NOT NULL DEFAULT 0
);
CREATE TABLE `ChatAssociations` (
                                    `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `chatId` integer NOT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `rank` text  NOT NULL
    ,  `lastRead` integer DEFAULT NULL
    ,  `notifications` text  NOT NULL DEFAULT 'all'
    ,  `createdAt` datetime NOT NULL
    ,  `legacyUserId` integer DEFAULT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `identifier` varchar(255) DEFAULT NULL UNIQUE
);
CREATE TABLE `Chats` (
                         `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `type` text  DEFAULT NULL
    ,  `name` varchar(255) NOT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `icon` varchar(255) DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `legacyUserId` integer DEFAULT NULL
    ,  `intent` varchar(255) DEFAULT NULL
);
CREATE TABLE `CollectionItems` (
                                   `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `collectionId` integer NOT NULL
    ,  `attachmentId` integer NOT NULL
    ,  `userId` integer NOT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `identifier` varchar(255) DEFAULT NULL UNIQUE
    ,  `pinned` integer NOT NULL DEFAULT 0
);
CREATE TABLE `CollectionPins` (
                                  `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `userId` integer NOT NULL
    ,  `collectionItemId` integer NOT NULL
    ,  `collectionId` integer NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Collections` (
                               `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) NOT NULL
    ,  `image` varchar(255) DEFAULT NULL
    ,  `userId` integer NOT NULL
    ,  `shareLink` varchar(255) DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
);
CREATE TABLE `CollectionUsers` (
                                   `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `collectionId` integer NOT NULL
    ,  `read` integer DEFAULT 1
    ,  `write` integer DEFAULT 1
    ,  `accepted` integer DEFAULT 0
    ,  `recipientId` integer NOT NULL
    ,  `senderId` integer NOT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `configure` integer DEFAULT 0
    ,  `identifier` varchar(255) DEFAULT NULL UNIQUE
);
CREATE TABLE `Domains` (
                           `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `domain` varchar(191) NOT NULL
    ,  `userId` integer NOT NULL
    ,  `DNSProvisioned` integer NOT NULL DEFAULT 0
    ,  `active` integer NOT NULL DEFAULT 0
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `zone` varchar(191) DEFAULT NULL
    ,  `advanced` varchar(191) DEFAULT '0'
    ,  `subdomains` integer DEFAULT 1
    ,  `subdomainsCreate` integer DEFAULT 1
    ,  `customUserEligibility` longtext DEFAULT NULL
    ,  `restricted` text  DEFAULT 'disabled'
);
CREATE TABLE `Experiments` (
                               `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `key` varchar(255) NOT NULL
    ,  `value` varchar(255) NOT NULL
    ,  `userId` integer NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Feedback` (
                            `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `route` varchar(191) NOT NULL
    ,  `debugInfo` text DEFAULT NULL
    ,  `uploadId` integer DEFAULT NULL
    ,  `feedbackText` text NOT NULL
    ,  `starRating` integer DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `userId` integer DEFAULT NULL
);
CREATE TABLE `Folders` (
                           `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(191) NOT NULL
    ,  `internalName` varchar(191) NOT NULL
    ,  `deletable` integer DEFAULT 1
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `userId` integer DEFAULT NULL
);
CREATE TABLE `FriendNicknames` (
                                   `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `userId` integer NOT NULL
    ,  `friendId` integer NOT NULL
    ,  `nickname` varchar(255) NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Friends` (
                           `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `userId` integer NOT NULL
    ,  `friendId` integer NOT NULL
    ,  `status` text  NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Insights` (
                            `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `type` text  NOT NULL
    ,  `startDate` datetime NOT NULL
    ,  `endDate` datetime NOT NULL
    ,  `userId` integer NOT NULL
    ,  `data` longtext NOT NULL CHECK (json_valid(`data`))
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Integrations` (
                                `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `userId` integer DEFAULT NULL
    ,  `type` varchar(255) DEFAULT NULL
    ,  `accessToken` text DEFAULT NULL
    ,  `refreshToken` text DEFAULT NULL
    ,  `expiresAt` datetime DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `tokenType` varchar(255) DEFAULT NULL
    ,  `providerUsername` text DEFAULT NULL
    ,  `providerUserId` integer DEFAULT NULL
    ,  `providerUserCache` longtext DEFAULT NULL CHECK (json_valid(`providerUserCache`))
);
CREATE TABLE `Invites` (
                           `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `inviteKey` char(36) NOT NULL
    ,  `email` varchar(255) NOT NULL
    ,  `status` text  DEFAULT 'pending'
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `userId` integer NOT NULL
    ,  `registerUserId` integer DEFAULT NULL
    ,  `adminId` integer DEFAULT NULL
);
CREATE TABLE `LegacyUsers` (
                               `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `username` varchar(255) NOT NULL
    ,  `name` varchar(255) NOT NULL
    ,  `email` varchar(255) NOT NULL
    ,  `password` varchar(255) NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `emailVerified` integer NOT NULL DEFAULT 0
    ,  `admin` integer NOT NULL DEFAULT 0
    ,  `status` text  NOT NULL DEFAULT 'offline'
    ,  `storedStatus` text  NOT NULL DEFAULT 'online'
    ,  `avatar` varchar(255) DEFAULT NULL
);
CREATE TABLE `MessageAttachments` (
                                      `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `messageId` integer NOT NULL
    ,  `attachmentId` integer NOT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `legacyUserId` integer DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Messages` (
                            `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `chatId` integer NOT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `content` text NOT NULL
    ,  `type` text  DEFAULT NULL
    ,  `embeds` longtext DEFAULT NULL CHECK (json_valid(`embeds`))
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `edited` integer DEFAULT 0
    ,  `editedAt` datetime DEFAULT NULL
    ,  `replyId` integer DEFAULT NULL
    ,  `legacyUserId` integer DEFAULT NULL
    ,  `pinned` integer DEFAULT 0
);
CREATE TABLE `Notes` (
                         `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) NOT NULL
    ,  `data` longtext NOT NULL CHECK (json_valid(`data`))
    ,  `metadata` longtext DEFAULT NULL CHECK (json_valid(`metadata`))
    ,  `workspaceFolderId` integer NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `shareLink` varchar(255) DEFAULT NULL
);
CREATE TABLE `NoteVersions` (
                                `id` char(36) NOT NULL
    ,  `noteId` integer NOT NULL
    ,  `userId` integer NOT NULL
    ,  `data` longtext NOT NULL CHECK (json_valid(`data`))
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Notifications` (
                                 `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `message` varchar(255) DEFAULT NULL
    ,  `dismissed` integer DEFAULT 0
    ,  `userId` integer DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `route` varchar(255) DEFAULT NULL
);
CREATE TABLE `Plans` (
                         `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(191) DEFAULT NULL
    ,  `quotaMax` integer DEFAULT NULL
    ,  `price` integer DEFAULT NULL
    ,  `features` longtext DEFAULT NULL
    ,  `color` varchar(191) DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `internalName` varchar(191) DEFAULT NULL
    ,  `purchasable` integer DEFAULT 0
    ,  `internalFeatures` longtext DEFAULT NULL
    ,  `icon` varchar(191) DEFAULT 'mdi-plus'
);
CREATE TABLE `Pulses` (
                          `id` char(36) NOT NULL
    ,  `userId` integer NOT NULL
    ,  `action` text  DEFAULT NULL
    ,  `route` varchar(255) DEFAULT NULL
    ,  `timeSpent` integer DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `device` varchar(255) DEFAULT NULL
    ,  `sysInfo` longtext DEFAULT NULL CHECK (json_valid(`sysInfo`))
    ,  `name` varchar(255) DEFAULT NULL
    ,  `other` longtext DEFAULT NULL CHECK (json_valid(`other`))
);
CREATE TABLE `Reports` (
                           `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `reportedByUserId` integer DEFAULT NULL
    ,  `reportedUserId` integer NOT NULL
    ,  `uploadId` integer DEFAULT NULL
    ,  `message` text DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `email` varchar(255) DEFAULT NULL
);
CREATE TABLE `Sessions` (
                            `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `token` varchar(255) DEFAULT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `scopes` varchar(255) DEFAULT '*'
    ,  `type` text  DEFAULT NULL
    ,  `expiredAt` datetime DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `name` varchar(255) DEFAULT NULL
    ,  `info` longtext DEFAULT NULL CHECK (json_valid(`info`))
);
CREATE TABLE `Slideshows` (
                              `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) NOT NULL
    ,  `shareLink` varchar(255) NOT NULL
    ,  `userId` integer NOT NULL
    ,  `collectionIds` longtext NOT NULL CHECK (json_valid(`collectionIds`))
    ,  `includeGallery` integer NOT NULL DEFAULT 0
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `speed` float DEFAULT 5
    ,  `scaling` text  NOT NULL DEFAULT 'fit'
    ,  `showCaptions` integer NOT NULL DEFAULT 0
);
CREATE TABLE `Stars` (
                         `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `userId` integer NOT NULL
    ,  `attachmentId` integer NOT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Subdomains` (
                              `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `domainId` integer NOT NULL
    ,  `userId` integer NOT NULL
    ,  `zone` varchar(191) DEFAULT NULL
    ,  `cfId` varchar(191) DEFAULT NULL
    ,  `name` varchar(191) DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `advanced` integer DEFAULT 0
);
CREATE TABLE `Subscriptions` (
                                 `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `planId` integer DEFAULT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `price` integer DEFAULT NULL
    ,  `cancelled` integer DEFAULT 0
    ,  `paymentId` integer DEFAULT NULL
    ,  `expiredAt` datetime DEFAULT NULL
    ,  `cancelledAt` datetime DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `metadata` longtext DEFAULT NULL CHECK (json_valid(`metadata`))
);
CREATE TABLE `Themes` (
                          `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) DEFAULT 'A TPU Theme'
    ,  `userId` integer DEFAULT NULL
    ,  `public` integer DEFAULT 0
    ,  `theme` longtext DEFAULT NULL CHECK (json_valid(`theme`))
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Transactions` (
                                `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(191) DEFAULT NULL
    ,  `price` integer DEFAULT NULL
    ,  `paymentMethodType` text  DEFAULT 'manual'
    ,  `paymentMethodId` integer DEFAULT NULL
    ,  `createdAt` datetime DEFAULT NULL
    ,  `updatedAt` datetime DEFAULT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `hidden` integer DEFAULT 0
    ,  `coinbaseId` char(36) DEFAULT NULL
);
CREATE TABLE `Uploads` (
                           `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `attachment` varchar(255) DEFAULT NULL
    ,  `userId` integer DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `name` text DEFAULT NULL
    ,  `originalFilename` text DEFAULT NULL
    ,  `type` text  NOT NULL DEFAULT 'binary'
    ,  `urlRedirect` text DEFAULT NULL
    ,  `fileSize` integer DEFAULT 0
    ,  `deletable` integer DEFAULT 1
    ,  `folderId` integer DEFAULT NULL
    ,  `path` text DEFAULT NULL
    ,  `data` longtext DEFAULT NULL
    ,  `textMetadata` text DEFAULT NULL
);
CREATE TABLE `Users` (
                         `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `username` varchar(191) NOT NULL UNIQUE
    ,  `email` varchar(255) NOT NULL UNIQUE
    ,  `password` varchar(255) NOT NULL
    ,  `description` varchar(255) DEFAULT 'Hey, I''m a new user here!'
    ,  `darkTheme` integer DEFAULT 0
    ,  `administrator` integer DEFAULT 0
    ,  `banned` integer DEFAULT 0
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `domainId` integer DEFAULT NULL
    ,  `inviteId` integer DEFAULT NULL
    ,  `openGraph` longtext NOT NULL CHECK (json_valid(`openGraph`))
    ,  `avatar` varchar(191) DEFAULT NULL
    ,  `subdomainId` integer DEFAULT NULL
    ,  `openGraphCustomFields` longtext DEFAULT NULL
    ,  `totpSecret` varchar(191) DEFAULT NULL
    ,  `totpEnable` integer DEFAULT 0
    ,  `quota` integer DEFAULT 0
    ,  `planId` integer DEFAULT 1
    ,  `uploadNameHidden` integer DEFAULT 0
    ,  `invisibleURLs` integer DEFAULT 0
    ,  `openGraphRandomColor` integer DEFAULT 0
    ,  `customPath` varchar(191) DEFAULT '/'
    ,  `moderator` integer DEFAULT 0
    ,  `passwordResetCode` varchar(255) DEFAULT NULL
    ,  `passwordResetEnabled` integer DEFAULT 0
    ,  `passwordResetExpiry` datetime DEFAULT NULL
    ,  `credits` integer DEFAULT 0
    ,  `subscriptionId` integer DEFAULT NULL
    ,  `flowinityId` text DEFAULT NULL
    ,  `fakePath` integer DEFAULT 0
    ,  `themeId` integer DEFAULT 1
    ,  `discordPrecache` integer DEFAULT 0
    ,  `invitesV2Visible` integer DEFAULT 1
    ,  `itemsPerPage` integer NOT NULL DEFAULT 12
    ,  `banner` varchar(255) DEFAULT NULL
    ,  `alternatePasswords` longtext DEFAULT NULL CHECK (json_valid(`alternatePasswords`))
    ,  `status` text  DEFAULT 'offline'
    ,  `storedStatus` text  DEFAULT 'online'
    ,  `weatherUnit` text  DEFAULT 'celsius'
    ,  `emailVerified` integer DEFAULT 0
    ,  `emailToken` varchar(255) DEFAULT NULL
    ,  `mailToken` varchar(255) DEFAULT NULL
    ,  `themeEngine` longtext DEFAULT NULL CHECK (json_valid(`themeEngine`))
    ,  `insights` text  DEFAULT 'nobody'
    ,  `profileLayout` longtext DEFAULT NULL CHECK (json_valid(`profileLayout`))
    ,  `language` varchar(255) NOT NULL DEFAULT 'en'
    ,  `excludedCollections` longtext DEFAULT NULL CHECK (json_valid(`excludedCollections`))
);
CREATE TABLE `WorkspaceFolders` (
                                    `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) NOT NULL
    ,  `workspaceId` integer NOT NULL
    ,  `folderId` integer DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `Workspaces` (
                              `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `name` varchar(255) NOT NULL
    ,  `userId` integer NOT NULL
    ,  `icon` varchar(255) DEFAULT NULL
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
);
CREATE TABLE `WorkspaceUsers` (
                                  `id` integer NOT NULL UNIQUE PRIMARY KEY AUTOINCREMENT
    ,  `workspaceId` integer NOT NULL
    ,  `recipientId` integer NOT NULL
    ,  `senderId` integer NOT NULL
    ,  `read` integer NOT NULL DEFAULT 1
    ,  `write` integer NOT NULL DEFAULT 0
    ,  `configure` integer NOT NULL DEFAULT 0
    ,  `accepted` integer NOT NULL DEFAULT 0
    ,  `createdAt` datetime NOT NULL
    ,  `updatedAt` datetime NOT NULL
    ,  `identifier` varchar(255) DEFAULT NULL UNIQUE
);
END TRANSACTION;
