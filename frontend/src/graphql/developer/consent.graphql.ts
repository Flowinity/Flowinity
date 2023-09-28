import { gql } from "@apollo/client";

export const OauthAppConsentQuery = gql`
  query OauthAppConsent($input: MyAppInput!) {
    availableChatPermissions {
      id
      description
      name
      createdAt
      updatedAt
      group
    }
    oauthAppConsent(input: $input) {
      id
      name
      icon
      shortCode
      verified
      redirectUri
      description
      scopes
      userId
      botId
      private
      bot {
        username
        id
        createdAt
        avatar
        bot
      }
      token
    }
  }
`;

export const AddBotToChat = gql`
  mutation AddBotToChat($input: AddBotToChatInput!) {
    addBotToChat(input: $input) {
      id
    }
  }
`;
