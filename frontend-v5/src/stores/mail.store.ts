// Utilities
import { defineStore } from "pinia";
import axios from "@/plugins/axios.ts";
import { computed, Ref, ref, watch } from "vue";
import { useApolloClient } from "@vue/apollo-composable";
import { MailStateQuery } from "@/graphql/mail/state.graphql";
import { RailMode, useAppStore } from "@/stores/app.store";

export interface MailState {
  // temp
  mailboxes: any[];
  drawer: boolean;
  mailboxDrawer: boolean;
  selectedMailbox: string;
  loading: boolean;
}

export interface Email {
  uid: number;
  from: {
    name: string;
    address: string;
  }[];
  to: {
    name: string;
    address: string;
  }[];
  subject: string;
}

export const useMailStore = defineStore("mail", () => {
  const mailboxes: Ref<any[]> = ref([]);
  const selectedMailbox = ref("INBOX");
  const loading = ref(false);
  const unreadMail = ref(0);

  function getSender(email: Email) {
    return email.from[0]?.name || email.from[0]?.address || "Unknown";
  }

  const selected = computed(() => {
    return mailboxes.value.find(
      (mailbox) => mailbox.name === selectedMailbox.value
    );
  });

  async function getMessages(mailbox: string, page: number) {
    const { data } = await axios.get(`/mail/mailbox/${mailbox}/${page}`);
    mailboxes.value.find((m) => m.name === mailbox).emails = data;
    loading.value = false;
  }
  async function setMailbox(mailbox: string) {
    loading.value = true;
    selectedMailbox.value = mailbox;
    await getMessages(mailbox, 1);
  }
  async function getMailboxes() {
    try {
      const { data } = await useApolloClient().client.query({
        query: MailStateQuery
      });
      mailboxes.value = data.mailboxes;
      unreadMail.value = data.unreadMail;
    } catch {
      //
    }
  }

  const appStore = useAppStore();
  watch(
    () => unreadMail.value,
    (val) => {
      const item = appStore.navigation.railOptions.find(
        (item) => item.id === RailMode.MAIL
      );
      if (!item) return;
      item.badge = !val ? undefined : val.toLocaleString();
    }
  );

  async function init() {
    await getMailboxes();
    setMailbox("INBOX");
  }

  return {
    mailboxes,
    unreadMail,
    init,
    setMailbox,
    getSender,
    selectedMailbox,
    selected
  };
});
