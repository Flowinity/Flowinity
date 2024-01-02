import { gql } from "@apollo/client";

export const GetUserQuery = gql`
  query GetUserQuery {
    currentUser {
      username
      email
      pulse
      groupPrivacy
      friendRequests
      profileLayout
      description
      administrator
      darkTheme
      emailVerified
      banned
      createdAt
      inviteId
      discordPrecache
      avatar
      domainId
      totpEnable
      quota
      moderator
      subscriptionId
      itemsPerPage
      banner
      pendingAutoCollects
      scopes
      alternatePasswords {
        scopes
        totp
        name
      }
      status
      storedStatus
      weatherUnit
      themeEngine
      xp
      publicProfile
      privacyPolicyAccepted
      plan {
        quotaMax
        color
        internalName
        name
        icon
        id
      }
      domain {
        active
        domain
        id
      }
      badges {
        color
        icon
        id
        image
        name
        priority
        tooltip
      }
      excludedCollections
      id
      language
      nameColor
      subscription {
        metadata {
          hours
        }
        cancelled
      }
      insights
      notifications {
        id
        dismissed
        message
        route
        createdAt
      }
      integrations {
        type
        providerUsername
        providerUserId
        id
        error
        expiresAt
      }
      homeWidgets {
        rows {
          widgets {
            type
            props
          }
        }
        default
      }
    }
    trackedUsers {
      username
      id
      createdAt
      administrator
      moderator
      avatar
      blocked
      status
      nameColor
      bot
      nickname {
        nickname
      }
    }
    blockedUsers {
      id
      userId
      createdAt
      updatedAt
      blockedUserId
      silent
    }
  }
`;
