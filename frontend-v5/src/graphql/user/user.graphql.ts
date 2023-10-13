import { gql } from "@apollo/client";

export const GetUserQuery = gql`
  query GetUserQuery {
    currentUser {
      username
      email
      description
      administrator
      darkTheme
      emailVerified
      banned
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
      }
      integrations {
        type
        providerUsername
        providerUserId
        providerUserCache
        createdAt
        id
        error
        expiresAt
      }
    }
  }
`;
