<template>
  <card padding class="my-4 mx-4">
    <div>
      <div class="ml-1 mb-4 flex justify-between items-center">
        <strong>{{ t("settings.security.apiKeys.title") }}</strong>
        <tpu-button icon variant="outlined" class="gap-1">
          <RiAddLine style="width: 20px" />
          {{ t("settings.security.apiKeys.actions.newAPIKey") }}
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
                session.info?.accessedFrom?.[0]?.location || t("settings.security.sessions.session.unknownLocation")
              }}
            </strong>
            <p class="text-medium-emphasis-dark">
              {{ session.info?.accessedFrom?.[0]?.ip || t("settings.security.sessions.session.unknownIPAddress") }} -
              {{ session.info?.accessedFrom?.[0]?.isp || t("settings.security.sessions.session.unknownISP") }}
            </p>
            <p class="text-medium-emphasis-dark">
              {{ t("settings.security.sessions.session.lastAccessed") }}: {{ dayjs(session.updatedAt).fromNow() || t("settings.security.sessions.session.unknownLastAccessedDate") }}
            </p>
            <p class="text-medium-emphasis-dark">
              {{ t("settings.security.sessions.session.created") }}: {{ dayjs(session.createdAt).fromNow() || t("settings.security.sessions.session.unknownCreationDate") }}
            </p>
            <p class="text-medium-emphasis-dark">
              {{ t("settings.security.sessions.session.accessedWithNumberOfIPAddresses", session?.info?.accessedFrom?.length || 0) }}
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
      name: t("settings.security.apiKeys.table.name")
    },
    {
      id: "scopes",
      name: t("settings.security.apiKeys.table.scopes")
    },
    {
      id: "expiry",
      name: t("settings.security.apiKeys.table.expiry")
    },
    {
      id: "createdAt",
      name: t("settings.security.apiKeys.table.createdAt")
    },
    {
      id: "actions",
      name: t("settings.security.apiKeys.table.actions")
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
