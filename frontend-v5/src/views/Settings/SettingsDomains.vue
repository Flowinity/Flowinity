<template>
  <card padding class="my-4 mx-4">
    <strong class="ml-1">
      {{ t("settings.domains.title") }}
    </strong>
    <tpu-data-table :items="items" :headers="headers">
      <template #item.user="{ item }">
        <router-link
          :to="`/u/${item?.user?.username}`"
          class="flex items-center justify-center my-1"
        >
          <UserAvatar
            :user-id="item?.user?.id"
            :src="appStore.domain + item?.user?.avatar"
            size="32"
          />
          <p class="ml-1">{{ item?.user?.username }}</p>
        </router-link>
      </template>
      <template #item.actions="{ item }">
        <div class="flex justify-center">
          <tpu-button
            :disabled="userStore.user?.domainId === item.id"
            variant="passive"
            :table="true"
            @click="applyDomain(item.id)"
          >
            {{ userStore.user?.domainId === item.id ? "Applied" : "Apply" }}
          </tpu-button>
        </div>
      </template>
    </tpu-data-table>
  </card>
</template>

<script setup lang="ts">
import Card from "@/components/Framework/Card/Card.vue";
import { useI18n } from "vue-i18n";
import TpuDataTable from "@/components/Framework/Table/TpuDataTable.vue";
import { Domain } from "@/gql/graphql";
import { onMounted, ref } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { DomainQuery } from "@/graphql/domains/getDomains.graphql";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { useAppStore } from "@/stores/app.store";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import { useUserStore } from "@/stores/user.store";
import { gql } from "@apollo/client";
const appStore = useAppStore();
const userStore = useUserStore();
const items = ref<Domain[]>([]);
const headers = [
  {
    id: "domain",
    name: "Domain"
  },
  {
    id: "user",
    name: "Created by"
  },
  {
    id: "actions",
    name: "Actions"
  }
];

const { t } = useI18n();

async function getDomains() {
  const {
    data: { domains }
  } = await useApolloClient().client.query({
    query: DomainQuery
  });
  items.value = domains;
}

async function applyDomain(id: number) {
  await useApolloClient().client.mutate({
    mutation: gql`
      mutation ApplyDomain($domainId: Int!) {
        applyDomain(domainId: $domainId) {
          id
        }
      }
    `,
    variables: {
      domainId: id
    }
  });
}

onMounted(() => {
  getDomains();
});
</script>

<style scoped></style>
