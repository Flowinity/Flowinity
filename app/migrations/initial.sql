-- Host: localhost
-- Generation Time: May 15, 2023 at 04:25 PM
-- Server version: 10.11.2-MariaDB-log

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Database: `upload`
--

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `Announcements` (
  `id` bigint(20) NOT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `autocollectapprovals`
--

CREATE TABLE `AutoCollectApprovals` (
  `id` bigint(20) NOT NULL,
  `autoCollectRuleId` bigint(20) DEFAULT NULL,
  `uploadId` bigint(20) DEFAULT NULL,
  `collectionId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `approved` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`info`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `autocollectrules`
--

CREATE TABLE `AutoCollectRules` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `collectionId` bigint(20) DEFAULT NULL,
  `requireApproval` tinyint(1) DEFAULT 1,
  `rules` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`rules`)),
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `badgeassociations`
--

CREATE TABLE `BadgeAssociations` (
  `id` int(11) NOT NULL,
  `badgeId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `expiredAt` datetime DEFAULT NULL,
  `hidden` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `badges`
--

CREATE TABLE `Badges` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `tooltip` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `planId` int(11) DEFAULT NULL,
  `unlocked` tinyint(1) NOT NULL DEFAULT 0,
  `priority` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chatassociations`
--

CREATE TABLE `ChatAssociations` (
  `id` int(11) NOT NULL,
  `chatId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `rank` enum('owner','admin','member') NOT NULL,
  `lastRead` int(11) DEFAULT NULL,
  `notifications` enum('all','none','mentions') NOT NULL DEFAULT 'all',
  `createdAt` datetime NOT NULL,
  `legacyUserId` int(11) DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  `identifier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chats`
--

CREATE TABLE `Chats` (
  `id` int(11) NOT NULL,
  `type` enum('direct','group','channel') DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `legacyUserId` int(11) DEFAULT NULL,
  `intent` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collectionitems`
--

CREATE TABLE `CollectionItems` (
  `id` bigint(20) NOT NULL,
  `collectionId` bigint(20) NOT NULL,
  `attachmentId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `identifier` varchar(255) DEFAULT NULL,
  `pinned` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collectionpins`
--

CREATE TABLE `CollectionPins` (
  `id` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `collectionItemId` bigint(20) NOT NULL,
  `collectionId` bigint(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `Collections` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `userId` bigint(20) NOT NULL,
  `shareLink` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collectionusers`
--

CREATE TABLE `CollectionUsers` (
  `id` bigint(20) NOT NULL,
  `collectionId` bigint(20) NOT NULL,
  `read` tinyint(1) DEFAULT 1,
  `write` tinyint(1) DEFAULT 1,
  `accepted` tinyint(1) DEFAULT 0,
  `recipientId` bigint(20) NOT NULL,
  `senderId` bigint(20) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `configure` tinyint(1) DEFAULT 0,
  `identifier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `domains`
--

CREATE TABLE `Domains` (
  `id` bigint(20) NOT NULL,
  `domain` varchar(191) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `DNSProvisioned` tinyint(1) NOT NULL DEFAULT 0,
  `active` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `zone` varchar(191) DEFAULT NULL,
  `advanced` varchar(191) DEFAULT '0',
  `subdomains` tinyint(1) DEFAULT 1,
  `subdomainsCreate` tinyint(1) DEFAULT 1,
  `customUserEligibility` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `restricted` enum('disabled','user','premium') DEFAULT 'disabled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `experiments`
--

CREATE TABLE `Experiments` (
  `id` int(11) NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `Feedback` (
  `id` bigint(20) NOT NULL,
  `route` varchar(191) NOT NULL,
  `debugInfo` text DEFAULT NULL,
  `uploadId` bigint(20) DEFAULT NULL,
  `feedbackText` text NOT NULL,
  `starRating` int(11) DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `folders`
--

CREATE TABLE `Folders` (
  `id` bigint(20) NOT NULL,
  `name` varchar(191) NOT NULL,
  `internalName` varchar(191) NOT NULL,
  `deletable` tinyint(1) DEFAULT 1,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friendnicknames`
--

CREATE TABLE `FriendNicknames` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `friendId` int(11) NOT NULL,
  `nickname` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `Friends` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `friendId` int(11) NOT NULL,
  `status` enum('incoming','outgoing','accepted') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `insights`
--

CREATE TABLE `Insights` (
  `id` int(11) NOT NULL,
  `type` enum('weekly','monthly','yearly') NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `userId` int(11) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `integrations`
--

CREATE TABLE `Integrations` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `accessToken` text DEFAULT NULL,
  `refreshToken` text DEFAULT NULL,
  `expiresAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `tokenType` varchar(255) DEFAULT NULL,
  `providerUsername` text DEFAULT NULL,
  `providerUserId` int(11) DEFAULT NULL,
  `providerUserCache` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`providerUserCache`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invites`
--

CREATE TABLE `Invites` (
  `id` bigint(20) NOT NULL,
  `inviteKey` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` bigint(20) NOT NULL,
  `registerUserId` bigint(20) DEFAULT NULL,
  `adminId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `legacyusers`
--

CREATE TABLE `LegacyUsers` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `emailVerified` tinyint(1) NOT NULL DEFAULT 0,
  `admin` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('online','busy','away','offline','invisible') NOT NULL DEFAULT 'offline',
  `storedStatus` enum('online','busy','away','invisible') NOT NULL DEFAULT 'online',
  `avatar` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messageattachments`
--

CREATE TABLE `MessageAttachments` (
  `id` int(11) NOT NULL,
  `messageId` int(11) NOT NULL,
  `attachmentId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `legacyUserId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `Messages` (
  `id` int(11) NOT NULL,
  `chatId` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `content` text NOT NULL,
  `type` enum('message','leave','join','pin','administrator','rename','system') DEFAULT NULL,
  `embeds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`embeds`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `edited` tinyint(1) DEFAULT 0,
  `editedAt` datetime DEFAULT NULL,
  `replyId` int(11) DEFAULT NULL,
  `legacyUserId` int(11) DEFAULT NULL,
  `pinned` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `Notes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `workspaceFolderId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `shareLink` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `noteversions`
--

CREATE TABLE `NoteVersions` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `noteId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `Notifications` (
  `id` bigint(20) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  `dismissed` tinyint(1) DEFAULT 0,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `route` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `Plans` (
  `id` bigint(20) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `quotaMax` bigint(20) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `color` varchar(191) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `internalName` varchar(191) DEFAULT NULL,
  `purchasable` tinyint(1) DEFAULT 0,
  `internalFeatures` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `icon` varchar(191) DEFAULT 'mdi-plus'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pulses`
--

CREATE TABLE `Pulses` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` bigint(20) NOT NULL,
  `action` enum('focus','item-collected','gallery-page-change','other','page-change','collection-page-change','auto-collect-rejected','auto-collect-accepted') DEFAULT NULL,
  `route` varchar(255) DEFAULT NULL,
  `timeSpent` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `device` varchar(255) DEFAULT NULL,
  `sysInfo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`sysInfo`)),
  `name` varchar(255) DEFAULT NULL,
  `other` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`other`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `Reports` (
  `id` bigint(20) NOT NULL,
  `reportedByUserId` int(11) DEFAULT NULL,
  `reportedUserId` bigint(20) NOT NULL,
  `uploadId` bigint(20) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `Sessions` (
  `id` bigint(20) NOT NULL,
  `token` varchar(255) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `scopes` varchar(255) DEFAULT '*',
  `type` enum('api','session') DEFAULT NULL,
  `expiredAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `info` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`info`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `slideshows`
--

CREATE TABLE `Slideshows` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `shareLink` varchar(255) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `collectionIds` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`collectionIds`)),
  `includeGallery` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `speed` float DEFAULT 5,
  `scaling` enum('stretch','fit','fill','original','tile') NOT NULL DEFAULT 'fit',
  `showCaptions` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `stars`
--

CREATE TABLE `Stars` (
  `id` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `attachmentId` bigint(20) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subdomains`
--

CREATE TABLE `Subdomains` (
  `id` bigint(20) NOT NULL,
  `domainId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `zone` varchar(191) DEFAULT NULL,
  `cfId` varchar(191) DEFAULT NULL,
  `name` varchar(191) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `advanced` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `Subscriptions` (
  `id` bigint(20) NOT NULL,
  `planId` bigint(20) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `cancelled` tinyint(1) DEFAULT 0,
  `paymentId` bigint(20) DEFAULT NULL,
  `expiredAt` datetime DEFAULT NULL,
  `cancelledAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `themes`
--

CREATE TABLE `Themes` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT 'A TPU Theme',
  `userId` bigint(20) DEFAULT NULL,
  `public` tinyint(1) DEFAULT 0,
  `theme` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`theme`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `Transactions` (
  `id` bigint(20) NOT NULL,
  `name` varchar(191) DEFAULT NULL,
  `price` bigint(20) DEFAULT NULL,
  `paymentMethodType` enum('crypto','paypal','manual','stripe','credits') DEFAULT 'manual',
  `paymentMethodId` bigint(20) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `hidden` tinyint(1) DEFAULT 0,
  `coinbaseId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `uploads`
--

CREATE TABLE `Uploads` (
  `id` bigint(20) NOT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `userId` bigint(20) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `name` text DEFAULT NULL,
  `originalFilename` text DEFAULT NULL,
  `type` enum('image','video','link','binary','text','audio','paste','dir') NOT NULL DEFAULT 'binary',
  `urlRedirect` text DEFAULT NULL,
  `fileSize` bigint(20) DEFAULT 0,
  `deletable` tinyint(1) DEFAULT 1,
  `folderId` bigint(20) DEFAULT NULL,
  `path` text DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `textMetadata` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `Users` (
  `id` bigint(20) NOT NULL,
  `username` varchar(191) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT 'Hey, I''m a new user here!',
  `darkTheme` tinyint(1) DEFAULT 0,
  `administrator` tinyint(1) DEFAULT 0,
  `banned` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `domainId` bigint(20) DEFAULT NULL,
  `inviteId` bigint(20) DEFAULT NULL,
  `openGraph` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`openGraph`)),
  `avatar` varchar(191) DEFAULT NULL,
  `subdomainId` bigint(20) DEFAULT NULL,
  `openGraphCustomFields` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `totpSecret` varchar(191) DEFAULT NULL,
  `totpEnable` tinyint(1) DEFAULT 0,
  `quota` bigint(20) DEFAULT 0,
  `planId` bigint(20) DEFAULT 1,
  `uploadNameHidden` tinyint(1) DEFAULT 0,
  `invisibleURLs` tinyint(1) DEFAULT 0,
  `openGraphRandomColor` tinyint(1) DEFAULT 0,
  `customPath` varchar(191) DEFAULT '/',
  `moderator` tinyint(1) DEFAULT 0,
  `passwordResetCode` varchar(255) DEFAULT NULL,
  `passwordResetEnabled` tinyint(1) DEFAULT 0,
  `passwordResetExpiry` datetime DEFAULT NULL,
  `credits` bigint(20) DEFAULT 0,
  `subscriptionId` bigint(20) DEFAULT NULL,
  `flowinityId` text DEFAULT NULL,
  `fakePath` tinyint(1) DEFAULT 0,
  `themeId` bigint(20) DEFAULT 1,
  `discordPrecache` tinyint(1) DEFAULT 0,
  `invitesV2Visible` tinyint(1) DEFAULT 1,
  `itemsPerPage` int(11) NOT NULL DEFAULT 12,
  `banner` varchar(255) DEFAULT NULL,
  `alternatePasswords` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`alternatePasswords`)),
  `status` enum('online','idle','offline','busy') DEFAULT 'offline',
  `storedStatus` enum('online','idle','busy','invisible') DEFAULT 'online',
  `weatherUnit` enum('celsius','fahrenheit','kelvin') DEFAULT 'celsius',
  `emailVerified` tinyint(1) DEFAULT 0,
  `emailToken` varchar(255) DEFAULT NULL,
  `mailToken` varchar(255) DEFAULT NULL,
  `themeEngine` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`themeEngine`)),
  `insights` enum('everyone','friends','nobody') DEFAULT 'nobody',
  `profileLayout` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`profileLayout`)),
  `language` varchar(255) NOT NULL DEFAULT 'en',
  `excludedCollections` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`excludedCollections`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workspacefolders`
--

CREATE TABLE `WorkspaceFolders` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `workspaceId` int(11) NOT NULL,
  `folderId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workspaces`
--

CREATE TABLE `Workspaces` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `userId` int(11) NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workspaceusers`
--

CREATE TABLE `WorkspaceUsers` (
  `id` int(11) NOT NULL,
  `workspaceId` int(11) NOT NULL,
  `recipientId` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 1,
  `write` tinyint(1) NOT NULL DEFAULT 0,
  `configure` tinyint(1) NOT NULL DEFAULT 0,
  `accepted` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `identifier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `Announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `autocollectapprovals`
--
ALTER TABLE `AutoCollectApprovals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `autocollectrules`
--
ALTER TABLE `AutoCollectRules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `collectionId` (`collectionId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `badgeassociations`
--
ALTER TABLE `BadgeAssociations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `badges`
--
ALTER TABLE `Badges`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chatassociations`
--
ALTER TABLE `ChatAssociations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identifier` (`identifier`);

--
-- Indexes for table `chats`
--
ALTER TABLE `Chats`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collectionitems`
--
ALTER TABLE `CollectionItems`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identifier` (`identifier`),
  ADD KEY `collectionId` (`collectionId`),
  ADD KEY `attachmentId` (`attachmentId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `collectionpins`
--
ALTER TABLE `CollectionPins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `collectionItemId` (`collectionItemId`),
  ADD KEY `collectionId` (`collectionId`);

--
-- Indexes for table `collections`
--
ALTER TABLE `Collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `shareLink` (`shareLink`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `collectionusers`
--
ALTER TABLE `CollectionUsers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identifier` (`identifier`),
  ADD KEY `collectionId` (`collectionId`),
  ADD KEY `recipientId` (`recipientId`),
  ADD KEY `senderId` (`senderId`);

--
-- Indexes for table `domains`
--
ALTER TABLE `Domains`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`),
  ADD UNIQUE KEY `zone` (`zone`);

--
-- Indexes for table `experiments`
--
ALTER TABLE `Experiments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `Feedback`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `folders`
--
ALTER TABLE `Folders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `friendnicknames`
--
ALTER TABLE `FriendNicknames`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `friends`
--
ALTER TABLE `Friends`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `insights`
--
ALTER TABLE `Insights`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `integrations`
--
ALTER TABLE `Integrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invites`
--
ALTER TABLE `Invites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `inviteKey` (`inviteKey`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `userId` (`userId`),
  ADD KEY `registerUserId` (`registerUserId`),
  ADD KEY `adminId` (`adminId`);

--
-- Indexes for table `legacyusers`
--
ALTER TABLE `LegacyUsers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `messageattachments`
--
ALTER TABLE `MessageAttachments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_pinned` (`pinned`);

--
-- Indexes for table `notes`
--
ALTER TABLE `Notes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `noteversions`
--
ALTER TABLE `NoteVersions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `note_versions_note_id` (`noteId`),
  ADD KEY `note_versions_user_id` (`userId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `dismissed` (`dismissed`),
  ADD KEY `UserId` (`userId`),
  ADD KEY `createdAt` (`createdAt`);

--
-- Indexes for table `plans`
--
ALTER TABLE `Plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pulses`
--
ALTER TABLE `Pulses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `route` (`route`),
  ADD KEY `other` (`other`(768)),
  ADD KEY `name` (`name`),
  ADD KEY `device` (`device`),
  ADD KEY `action` (`action`);

--
-- Indexes for table `reports`
--
ALTER TABLE `Reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `Sessions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD KEY `sessions_token` (`token`),
  ADD KEY `sessions_user_id` (`userId`),
  ADD KEY `sessions_type` (`type`),
  ADD KEY `sessions_scopes` (`scopes`);

--
-- Indexes for table `slideshows`
--
ALTER TABLE `Slideshows`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stars`
--
ALTER TABLE `Stars`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `attachmentId` (`attachmentId`);

--
-- Indexes for table `subdomains`
--
ALTER TABLE `Subdomains`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `Subscriptions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `themes`
--
ALTER TABLE `Themes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uploads`
--
ALTER TABLE `Uploads`
  ADD PRIMARY KEY (`id`),
  ADD KEY `UserId` (`userId`),
  ADD KEY `attachment` (`attachment`),
  ADD KEY `type` (`type`),
  ADD KEY `deletable` (`deletable`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `subdomainId` (`subdomainId`),
  ADD KEY `username_2` (`username`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `workspacefolders`
--
ALTER TABLE `WorkspaceFolders`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workspaces`
--
ALTER TABLE `Workspaces`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `workspaceusers`
--
ALTER TABLE `WorkspaceUsers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identifier` (`identifier`),
  ADD KEY `workspace_users_workspace_id` (`workspaceId`),
  ADD KEY `workspace_users_recipient_id` (`recipientId`),
  ADD KEY `workspace_users_sender_id` (`senderId`),
  ADD KEY `workspace_users_read` (`read`),
  ADD KEY `workspace_users_write` (`write`),
  ADD KEY `workspace_users_configure` (`configure`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `Announcements`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `autocollectapprovals`
--
ALTER TABLE `AutoCollectApprovals`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `autocollectrules`
--
ALTER TABLE `AutoCollectRules`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `badgeassociations`
--
ALTER TABLE `BadgeAssociations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `badges`
--
ALTER TABLE `Badges`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chatassociations`
--
ALTER TABLE `ChatAssociations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chats`
--
ALTER TABLE `Chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collectionitems`
--
ALTER TABLE `CollectionItems`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collectionpins`
--
ALTER TABLE `CollectionPins`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `Collections`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collectionusers`
--
ALTER TABLE `CollectionUsers`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domains`
--
ALTER TABLE `Domains`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `experiments`
--
ALTER TABLE `Experiments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `Feedback`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `folders`
--
ALTER TABLE `Folders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friendnicknames`
--
ALTER TABLE `FriendNicknames`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `Friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `insights`
--
ALTER TABLE `Insights`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `integrations`
--
ALTER TABLE `Integrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `invites`
--
ALTER TABLE `Invites`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `legacyusers`
--
ALTER TABLE `LegacyUsers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messageattachments`
--
ALTER TABLE `MessageAttachments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `Messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notes`
--
ALTER TABLE `Notes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `Notifications`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `Plans`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `Reports`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `Sessions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `slideshows`
--
ALTER TABLE `Slideshows`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stars`
--
ALTER TABLE `Stars`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subdomains`
--
ALTER TABLE `Subdomains`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `Subscriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `themes`
--
ALTER TABLE `Themes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `Transactions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `uploads`
--
ALTER TABLE `Uploads`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `Users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workspacefolders`
--
ALTER TABLE `WorkspaceFolders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workspaces`
--
ALTER TABLE `Workspaces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workspaceusers`
--
ALTER TABLE `WorkspaceUsers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `autocollectrules`
--
ALTER TABLE `AutoCollectRules`
  ADD CONSTRAINT `autocollectrules_ibfk_1` FOREIGN KEY (`collectionId`) REFERENCES `Collections` (`id`),
  ADD CONSTRAINT `autocollectrules_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`);

--
-- Constraints for table `collectionpins`
--
ALTER TABLE `CollectionPins`
  ADD CONSTRAINT `collectionpins_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `collectionpins_ibfk_2` FOREIGN KEY (`collectionItemId`) REFERENCES `CollectionItems` (`id`),
  ADD CONSTRAINT `collectionpins_ibfk_3` FOREIGN KEY (`collectionId`) REFERENCES `Collections` (`id`);

--
-- Constraints for table `invites`
--
ALTER TABLE `Invites`
  ADD CONSTRAINT `invites_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `invites_ibfk_2` FOREIGN KEY (`registerUserId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `invites_ibfk_3` FOREIGN KEY (`adminId`) REFERENCES `Users` (`id`);

--
-- Constraints for table `pulses`
--
ALTER TABLE `Pulses`
  ADD CONSTRAINT `pulses_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`);

--
-- Constraints for table `stars`
--
ALTER TABLE `Stars`
  ADD CONSTRAINT `stars_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`),
  ADD CONSTRAINT `stars_ibfk_2` FOREIGN KEY (`attachmentId`) REFERENCES `Uploads` (`id`);
COMMIT;
