import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { AvailableChatPermissionsDocument } from "@/gql/graphql";

const client = new ApolloClient({
  uri: "http://localhost:34583/graphql",
  cache: new InMemoryCache()
});

const query = client.query({
  query: AvailableChatPermissionsDocument
});
