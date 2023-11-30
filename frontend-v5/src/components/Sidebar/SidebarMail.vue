<template>
  <div class="flex flex-col h-[calc(100vh-80px)]">
    <div style="flex: 0.3 1 0" class="1 overflow-y-auto flex flex-col gap-1">
      <SideBarItem
        v-for="item in mailStore.mailboxes"
        :key="item.path"
        :item="{
          name: item.name
        }"
        :selected="mailStore.selectedMailbox === item.path"
        @click="
          mailStore.selectedMailbox !== item.path
            ? mailStore.setMailbox(item.path)
            : () => {}
        "
      ></SideBarItem>
    </div>
    <div class="flex-1 h-full overflow-y-auto">
      <SideBarItem v-for="email in mailStore.selected?.emails" :key="email.id">
        <template #title>
          {{ email.subject }}
        </template>
        <template #subtitle>
          {{ mailStore.getSender(email) }}
        </template>
      </SideBarItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import SideBarItem from "@/components/Framework/Navigation/SideBarItem.vue";
import { useMailStore } from "@/stores/mail.store";
import TpuDivider from "@/components/Framework/Divider/TpuDivider.vue";

const mailStore = useMailStore();
</script>

<style scoped></style>
