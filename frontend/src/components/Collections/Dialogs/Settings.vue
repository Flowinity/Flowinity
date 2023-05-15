<template>
  <CoreDialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template v-slot:title>Settings</template>
    <v-card-text v-if="collection">
      <v-text-field
        v-model="collection.name"
        autofocus
        label="Name"
        required
      ></v-text-field>
      <v-btn class="ml-n4" color="red" @click="removeBanner">
        Remove Banner
      </v-btn>
    </v-card-text>
    <v-card-actions v-if="collection" class="mt-2">
      <v-btn
        v-if="collection.userId === $user.user?.id"
        color="red"
        @click="deleteCollection"
      >
        Delete Collection
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" @click="$emit('update:modelValue', false)">
        Cancel
      </v-btn>
      <v-btn color="blue darken-1" @click="updateSettings">Update</v-btn>
    </v-card-actions>
  </CoreDialog>
</template>

<script lang="ts">
import {Collection} from "@/models/collection"
import {defineComponent} from "vue"
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue"

export default defineComponent({
  name: "CollectionSettings",
  components: {CoreDialog},
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    collection: {
      type: Object as () => Collection
    }
  },
  emits: ["update:modelValue", "refreshCollection"],
  methods: {
    async updateSettings() {
      await this.axios.patch(`/collections/${this.collection?.id}`, {
        name: this.collection?.name
      })
      this.$toast.success("Collection settings updated.")
      this.$emit("update:modelValue", false)
    },
    async deleteCollection() {
      await this.axios.delete(`/collections/${this.collection?.id}`)
      this.$router.push("/collections")
      this.$collections.init()
    },
    async removeBanner() {
      await this.axios.delete(`/collections/${this.collection?.id}/banner`)
      this.$emit("refreshCollection")
    }
  }
})
</script>

<style scoped></style>
