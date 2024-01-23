<template>
  <card padding class="my-4 mx-4">
    <div>
      <div class="ml-1 mb-4 flex justify-between items-center">
        <strong>{{ t("settings.security.apiKeys.title") }}</strong>
        <tpu-button icon variant="outlined" class="gap-1">
          <RiAddLine style="width: 20px" />
          New API Key
        </tpu-button>
      </div>
      <tpu-data-table
        :items="items.filter((item) => item.type === SessionType.Api)"
        :headers="headers.api"
      >
        <template #[`item.actions`]>
          <div class="flex">
            <tpu-button icon variant="passive">
              <RiGlobalLine style="width: 20px" />
            </tpu-button>
            <tpu-button icon variant="passive">
              <RiCloseLine style="width: 20px" />
            </tpu-button>
          </div>
        </template>
      </tpu-data-table>
    </div>
    <div class="ml-1 my-4 flex justify-between items-center">
      <strong>{{ t("settings.security.sessions.title") }}</strong>
    </div>
    <tpu-list>
      <tpu-list-item
        v-for="session in items.filter(
          (session) => session.type === SessionType.WebSession
        )"
        :key="session.id"
        tabindex="-1"
      >
        <div class="flex justify-between items-center">
          <div>
            <strong>
              {{
                session.info?.accessedFrom?.[0]?.location || "Unknown Location"
              }}
            </strong>
            <p class="text-medium-emphasis-dark">
              {{ session.info?.accessedFrom?.[0]?.ip || "Unknown" }} -
              {{ session.info?.accessedFrom?.[0]?.isp || "Unknown" }}
            </p>
            <p class="text-medium-emphasis-dark">
              Last accessed:
              {{ dayjs(session.updatedAt).fromNow() || "Unknown" }}
            </p>
            <p class="text-medium-emphasis-dark">
              Created:
              {{ dayjs(session.createdAt).fromNow() || "Unknown" }}
            </p>
            <p class="text-medium-emphasis-dark">
              Accessed with {{ session?.info?.accessedFrom?.length || 0 }} IP
              addresses.
            </p>
          </div>
          <div>
            <div class="flex">
              <tpu-button icon variant="passive">
                <RiGlobalLine style="width: 20px" />
              </tpu-button>
              <tpu-button icon variant="passive">
                <RiCloseLine style="width: 20px" />
              </tpu-button>
            </div>
          </div>
        </div>
      </tpu-list-item>
    </tpu-list>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import TpuDataTable from "@/components/Framework/Table/TpuDataTable.vue";
import { useApolloClient } from "@vue/apollo-composable";
import { SessionsQuery } from "@/graphql/user/sessions.graphql";
import { Session, SessionType } from "@/gql/graphql";
import { onMounted, ref } from "vue";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiGlobalLine from "vue-remix-icons/icons/ri-global-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";
import { useI18n } from "vue-i18n";
import TpuList from "@/components/Framework/List/TpuList.vue";
import TpuListItem from "@/components/Framework/List/TpuListItem.vue";
import dayjs from "../../plugins/dayjs";

const items = ref<Session[]>([]);
const { t } = useI18n();

const headers = {
  api: [
    {
      id: "name",
      name: "Name"
    },
    {
      id: "scopes",
      name: "Scopes"
    },
    {
      id: "expiry",
      name: "Expiry"
    },
    {
      id: "createdAt",
      name: "Created"
    },
    {
      id: "actions",
      name: "Actions"
    }
  ]
};

async function getAPIKeys() {
  const {
    data: {
      currentUser: { sessions }
    }
  } = await useApolloClient().client.query({
    query: SessionsQuery
  });
  items.value = sessions;
}

onMounted(() => {
  getAPIKeys();
});
</script>
