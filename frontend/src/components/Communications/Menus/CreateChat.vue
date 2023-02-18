<template>
  <v-menu
    @update:model-value="$emit('update:modelValue', $event)"
    :close-on-content-click="false"
    location="end"
    :model-value="modelValue"
    style="z-index: 4001"
  >
    <template v-slot:activator="{ props }">
      <slot :props="props"></slot>
    </template>
    <v-card>
      <v-card-title class="text-h6">Select Friends</v-card-title>
      <v-card-subtitle
        >You can friend people from their profile.<br />Adding 2 or more users
        will create a group chat.</v-card-subtitle
      >
      <v-list>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-5 my-n1"
          autofocus
        ></v-text-field>
        <v-list-item
          v-for="friend in friends"
          :value="friend.otherUser.id"
          @click="add(friend.otherUser.id)"
          :active="selected.includes(friend.otherUser.id)"
        >
          <template v-slot:prepend>
            <UserAvatar
              :user="friend.otherUser"
              class="mr-3"
              size="38"
            ></UserAvatar>
          </template>
          <template v-slot:append>
            <v-list-item-action start>
              <v-checkbox-btn
                :model-value="selected.includes(friend.otherUser.id)"
                color="primary"
              ></v-checkbox-btn>
            </v-list-item-action>
          </template>

          <v-list-item-title>{{ friend.otherUser.username }}</v-list-item-title>

          <v-list-item-subtitle>
            Friends since {{ $date(friend.createdAt).format("DD/MM/YYYY") }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="createChat"
          :disabled="!selected.length"
          >{{ selected.length < 2 ? "Create DM" : "Create Group" }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Friend } from "@/models/friend";
import { defineComponent } from "vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";

export default defineComponent({
  name: "CreateChat",
  components: { UserAvatar },
  props: ["modelValue"],
  emits: ["update:modelValue"],
  data() {
    return {
      search: "",
      selected: [] as number[]
    };
  },
  methods: {
    add(id: number) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((i) => i !== id);
      } else {
        this.selected.push(id);
      }
    },
    async createChat() {
      const data = await this.$chat.createChat(this.selected);
      this.$router.push(`/communications/${data.association.id}`);
      this.$emit("update:modelValue", false);
    }
  },
  computed: {
    friends() {
      return this.$friends.friends.filter((friend: Friend) =>
        friend.otherUser.username
          .toLowerCase()
          .includes(this.search.toLowerCase())
      ) as Friend[];
    }
  }
});
</script>

<style scoped></style>
