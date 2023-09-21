import { App } from "vue";
import { createApolloProvider } from "@vue/apollo-option";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { useToast } from "vue-toastification";
import { useUserStore } from "@/store/user.store";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import functions from "@/plugins/functions";

function getToken(app: App) {
  return (
    app.config.globalProperties.$app.token ?? localStorage.getItem("token")
  );
}

export default function setup(app: App) {
  const toast = useToast();
  const httpLink = new HttpLink({
    uri: "/graphql"
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      for (const error of graphQLErrors) {
        if (error.extensions?.code === "UNAUTHORIZED") {
          localStorage.removeItem("token");
          const user = useUserStore();
          user.user = null;
        } else if (error.extensions?.code === "BAD_USER_INPUT") {
          for (const err of error.extensions.validationErrors as any[]) {
            const values: string[] = Object.values(err.constraints);

            for (const value of values) {
              toast.error(functions.charUp(value) + ".");
            }
          }
        } else if (error.extensions?.code === "CHAT_NOT_FOUND") {
          if (
            app.config.globalProperties.$route.path.startsWith(
              "/communications/"
            )
          ) {
            app.config.globalProperties.$router.push("/communications/home");
          }
        } else {
          toast.error(error.message);
        }
      }
    }

    if (networkError) {
      //
    }
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: "/graphql",
      connectionParams: {
        token: localStorage.getItem("token") || "",
        clientVersion: import.meta.env.TPU_VERSION,
        clientName: "TPUvNEXT4"
      }
    })
  );

  const authLink = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = getToken(app);
    operation.setContext({
      headers: {
        authorization: token,
        clientVersion: import.meta.env.TPU_VERSION,
        clientName: "TPUvNEXT"
      }
    });
    return forward(operation);
  });

  const appLink = from([authLink, errorLink, httpLink, wsLink]);

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: appLink,
    cache: new InMemoryCache({
      addTypename: true
    }),
    connectToDevTools: true
  });

  // Create a provider
  const apolloProvider = createApolloProvider({
    defaultClient: apolloClient
  });
  app.config.globalProperties.$apollo = apolloClient;

  app.use(apolloProvider);
}
