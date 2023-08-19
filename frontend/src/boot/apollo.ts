import { App } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";

export default function setup(app: App) {
  const httpLink = new HttpLink({
    uri: "/graphql"
  });

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    headers: {
      Authorization: localStorage.getItem("token") || ""
    }
  });

  // Create a provider
  const apolloProvider = createApolloProvider({
    defaultClient: apolloClient
  });

  app.use(apolloProvider);
  app.config.globalProperties.$apollo = apolloClient;
}
