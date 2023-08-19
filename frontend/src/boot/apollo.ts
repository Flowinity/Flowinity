import { App } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache,
  NextLink,
  Operation
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { useToast } from "vue-toastification";
import { setContext } from "@apollo/client/link/context";

export default function setup(app: App) {
  const toast = useToast();
  const httpLink = new HttpLink({
    uri: "/graphql"
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem("token");
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token || ""
      }
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        toast.error(error.message);
      }
    }

    if (networkError) {
      //
    }
  });

  const appLink = from([errorLink, authLink, httpLink]);

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: appLink,
    cache: new InMemoryCache({
      addTypename: false
    }),
    connectToDevTools: true,
    headers: {
      Authorization: localStorage.getItem("token") || ""
    }
  });

  // Create a provider
  const apolloProvider = createApolloProvider({
    defaultClient: apolloClient
  });
  app.config.globalProperties.$apollo = apolloClient;

  app.use(apolloProvider);
}
