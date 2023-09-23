import { gql } from "@apollo/client";

export const CoreStateQuery = gql`
  query CoreStateQuery {
    friends {
      id
      status
      userId
      friendId
      user {
        username
        id
        createdAt
        administrator
        moderator
        avatar
        status
      }
    }
    experiments {
      id
      value
      description
      createdAt
    }
    workspaces {
      id
      name
      userId
      createdAt
      updatedAt
      icon
      folders {
        id
        createdAt
        updatedAt
        name
        workspaceId
        folderId
        children {
          id
          createdAt
          updatedAt
          name
          workspaceFolderId
          shareLink
        }
      }
    }
    chats {
      id
      description
      type
      background
      unread
      name
      userId
      icon
      createdAt
      updatedAt
      legacyUserId
      invites {
        id
        userId
        createdAt
        rankId
        updatedAt
        expiredAt
        invalidated
      }
      association {
        id
        hidden
        chatId
        permissions
        userId
        rank
        createdAt
        lastRead
        notifications
        legacyUserId
      }
      users {
        id
        chatId
        userId
        rank
        createdAt
        lastRead
        legacyUserId
        ranksMap
      }
      _redisSortDate
      recipient {
        id
      }
      ranks {
        id
        color
        name
        userId
        createdAt
        chatId
        updatedAt
        managed
        index
        permissionsMap
      }
    }
    collections(input: { filter: [ALL] }) {
      items {
        id
        name
        image
        userId
        shareLink
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
        preview {
          attachment {
            attachment
            id
          }
        }
        users {
          id
          createdAt
          updatedAt
          collectionId
          read
          write
          configure
          accepted
          recipientId
          senderId
          identifier
          user {
            username
            id
            administrator
            moderator
            avatar
          }
          sender {
            username
            id
            administrator
            moderator
            avatar
          }
        }
        recipient {
          id
          createdAt
          updatedAt
          collectionId
          read
          write
          configure
          accepted
          recipientId
          senderId
        }
        shared
        itemCount
        permissionsMetadata {
          write
          read
          configure
        }
      }
      pager {
        totalItems
        currentPage
        pageSize
        totalPages
        startPage
        endPage
        startIndex
        endIndex
        pages
      }
    }
    coreState {
      connection {
        ip
      }
      name
      release
      hostname
      hostnameWithProtocol
      announcements {
        userId
        content
        type
        user {
          username
          id
          createdAt
          administrator
          moderator
          avatar
        }
      }
      stats {
        users
        announcements
        usage
        collections
        collectionItems
        uploadGraph {
          data
          labels
        }
        messageGraph {
          data
          labels
        }
        pulseGraph {
          data
          labels
        }
        uploads
        invites
        inviteMilestone
        pulse
        pulses
        docs
        messages
        chats
        hours
      }
      maintenance {
        enabled
        message
        statusPage
      }
      registrations
      officialInstance
      providers {
        anilist
        lastfm
        mal
      }
      termsNoteId
      privacyNoteId
      features {
        communications
        collections
        autoCollects
        workspaces
        insights
      }
      inviteAFriend
      preTrustedDomains
      hostnames
      _redis
      server
      finishedSetup
      domain
      uptime
      uptimeSys
      commitVersion
    }
    currentUser {
      username
      email
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
      alternatePasswords {
        scopes
        totp
        name
      }
      status
      storedStatus
      weatherUnit
      themeEngine {
        theme {
          dark {
            colors {
              primary
              logo1
              logo2
              secondary
              accent
              error
              info
              success
              warning
              card
              toolbar
              sheet
              text
              dark
              gold
              background
              background2
            }
            dark
          }
          light {
            dark
          }
          amoled {
            dark
            colors {
              primary
              logo1
              logo2
              secondary
              accent
              error
              info
              success
              warning
              card
              toolbar
              sheet
              text
              dark
              gold
              background
              background2
            }
          }
        }
        fluidGradient
        gradientOffset
        version
        deviceSync
        showOnProfile
        baseTheme
        customCSS
      }
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
