<template>
  <v-menu
    :close-on-content-click="false"
    :model-value="modelValue"
    location="end"
    style="z-index: 4001"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:activator="{ props }">
      <slot :props="props"></slot>
    </template>
    <v-card>
      <v-card-title class="text-h6">Select Friends</v-card-title>
      <v-card-subtitle>
        You can friend people from their profile.
        <br/>
        Adding 2 or more users will create a group chat.
      </v-card-subtitle>
      <v-list max-height="400">
        <v-text-field
          v-model="search"
          autofocus
          class="mx-5 my-n1"
          label="Search"
        ></v-text-field>
        <v-list-item
          v-for="friend in friends"
          :active="selected.includes(friend.otherUser.id)"
          :value="friend.otherUser.id"
          @click="add(friend.otherUser.id)"
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
          :disabled="!selected.length"
          color="primary"
          @click="type === 'create' ? createChat() : $emit('add', selected)"
        >
          <template v-if="type === 'create'">
            {{ selected.length < 2 ? "Create DM" : "Create Group" }}
          </template>
          <template v-else>Add</template>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import {Friend} from "@/models/friend"
import {defineComponent} from "vue"
import UserAvatar from "@/components/Users/UserAvatar.vue"

export default defineComponent({
  name: "CreateChat",
  components: {UserAvatar},
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: "create"
    }
  },
  emits: ["update:modelValue", "add"],
  data() {
    return {
      search: "",
      selected: [] as number[]
    }
  },
  methods: {
    add(id: number) {
      if (this.selected.includes(id)) {
        this.selected = this.selected.filter((i) => i !== id)
      } else {
        this.selected.push(id)
      }
    },
    async createChat() {
      const data = await this.$chat.createChat(this.selected)
      this.$router.push(`/communications/${data.association.id}`)
      this.$emit("update:modelValue", false)
    }
  },
  computed: {
    friends() {
      return this.$friends.friends.filter((friend: Friend) =>
        friend.otherUser.username
          .toLowerCase()
          .includes(this.search.toLowerCase())
      ) as Friend[]
    }
  }
})
</script>

<style scoped></style>
