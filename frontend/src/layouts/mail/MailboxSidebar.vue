<template>
  <v-navigation-drawer
    permanent
    color="dark"
    floating
    v-model="$mail.mailboxDrawer"
  >
    <v-list nav>
      <v-list-item
        v-for="email in $mail.selected?.emails"
        :to="`/mail/${$mail.selectedMailbox}/${email.seq}`"
      >
        <v-list-item-title>{{ email.subject }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ $mail.getSender(email) }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "MailboxSidebar"
};
</script>

<style scoped></style>
