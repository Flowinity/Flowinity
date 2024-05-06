import type { App } from "vue";
import {
  ApolloClient,
  ApolloLink,
  from,
  HttpLink,
  InMemoryCache
} from "@apollo/client/core";
import { onError } from "@apollo/client/link/error";
import { useToast } from "vue-toastification";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import functions from "@/plugins/functions";
import {
  DefaultApolloClient,
  provideApolloClient
} from "@vue/apollo-composable";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { createApolloProvider } from "@vue/apollo-option";
import { getMainDefinition } from "@apollo/client/utilities";
import { split } from "@apollo/client";
import { useAppStore } from "@/stores/app.store";
import { useDebugStore } from "@/stores/debug.store";
import { watch } from "vue";
import { useUserStore } from "@/stores/user.store";

function getToken() {
  return localStorage.getItem("token");
}

export default function setup(app: App) {
  const toast = useToast();
  const debugStore = useDebugStore();

  const debugLink = new ApolloLink((operation, forward) => {
    const id = new Date().getTime() + "-" + Math.random();
    const startTime = performance.now();
    debugStore.recentOperations.unshift({
      id,
      name: operation.operationName,
      args: operation.variables,
      result: {},
      time: 0,
      type: operation.query.definitions[0]?.operation,
      timestamp: new Date().getTime(),
      pending: true,
      sdl: operation.query.loc?.source.body
    });
    return forward(operation).map((response) => {
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;

      const op = debugStore.recentOperations.find((op) => op.id === id);

      if (op) {
        op.pending = false;
        op.result = response;
        op.time = elapsedTime;
      }

      return response;
    });
  });

  let restartRequestedBeforeConnected = false;
  let gracefullyRestart = () => {
    restartRequestedBeforeConnected = true;
  };

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      const ctx = operation.getContext();
      for (const error of graphQLErrors) {
        if (error.extensions?.code === "UNAUTHORIZED") {
          console.log("ERROR LOGOUT THROWN");
          console.log(error);
          //localStorage.removeItem("token");
          //const user = useUserStore();
          //user.user = null;
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
        } else if (
          error.extensions?.code === "WEATHER_NOT_RESPONDING" ||
          error.extensions?.code === "EXPERIMENT_NOT_ALLOWED"
        ) {
          continue;
        } else if (
          error.extensions?.code === "USERNAME_TAKEN" &&
          app.config.globalProperties.$route.path === "/"
        ) {
          continue;
        } else if (!ctx.noToast) {
          toast.error(error.message);
        }
      }
    }

    if (networkError) {
      //
    }
  });

  const userStore = useUserStore();
  let reconnect = false;

  const wsClient = createClient({
    url: `wss://${import.meta.env.VITE_API_URL}/graphql`,
    connectionParams: async () => {
      return {
        authorization: userStore.token,
        "x-tpu-client-version": import.meta.env.TPU_VERSION,
        "x-tpu-client": "Flowinity5",
        "x-tpu-resumable-state-id": crypto.randomUUID()
      };
    },
    lazy: false,
    keepAlive: 5000,
    on: {
      error: () => {
        console.log("[Flowinity/GraphQL] Disconnected from socket.");
        const appStore = useAppStore();
        reconnect = true;
        appStore.connected = false;
      },
      connected: (socket: any) => {
        const appStore = useAppStore();
        if (reconnect) {
          appStore.connected = true;
        }
        console.log("[Flowinity/GraphQL] Connected to socket.");
        gracefullyRestart = () => {
          if (socket.readyState === WebSocket.OPEN) {
            appStore.connected = false;
            socket.close(4205, "Client Restart");
          }
        };

        // just in case you were eager to restart
        if (restartRequestedBeforeConnected) {
          restartRequestedBeforeConnected = false;
          gracefullyRestart();
        }
      }
    }
  });

  const wsLink = new GraphQLWsLink(wsClient);

  const authLink = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    const token = getToken();
    operation.setContext({
      headers: {
        authorization: token,
        "x-tpu-client-version": import.meta.env.TPU_VERSION,
        "x-tpu-client": "TPUv5 (Flowinity)"
      }
    });
    return forward(operation);
  });

  const cleanTypeName = new ApolloLink((operation, forward) => {
    if (operation.variables) {
      const omitTypename = (key: any, value: any) =>
        key === "__typename" ? undefined : value;
      operation.variables = JSON.parse(
        JSON.stringify(operation.variables),
        omitTypename
      );
    }
    return forward(operation).map((data) => {
      return data;
    });
  });

  const appLink = from([cleanTypeName, authLink, errorLink, debugLink, wsLink]);

  if (import.meta.env.DEV) {
    loadDevMessages();
    loadErrorMessages();
  }

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: appLink,
    cache: new InMemoryCache({
      addTypename: true
    }),
    connectToDevTools: import.meta.env.DEV
  });

  app.config.globalProperties.$apollo = apolloClient;

  const apolloProvider = createApolloProvider({
    defaultClient: apolloClient
  });

  app.use(apolloProvider);
  app.provide(DefaultApolloClient, apolloClient);
  app.provide("wsClient", wsClient);

  provideApolloClient(apolloClient);

  watch(
    () => userStore.token,
    () => {
      gracefullyRestart();
    }
  );
}
