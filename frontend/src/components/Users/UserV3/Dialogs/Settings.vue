<template>
  <CoreDialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="600px"
    v-if="$user.changes.profileLayout"
  >
    <template v-slot:title>
      {{ component ? `${metaComponent.name} Settings` : "Settings" }}
    </template>
    <template v-if="!component">
      <v-container>
        <v-switch
          v-model="$user.changes.profileLayout.config.showStatsSidebar"
          label="Stats sidebar"
          @change="
            $user.save();
            $emit('trigger');
          "
        />
      </v-container>
    </template>
    <template v-else>
      <v-container>
        <div v-for="prop of props">
          <template v-if="prop.type === 'number'">
            <v-text-field
              :label="prop.key"
              :model-value="component.props[prop.key]"
              type="number"
              @update:model-value="
                $emit('update', {
                  key: prop.key,
                  value: parseInt($event || '0')
                })
              "
            />
          </template>
          <template v-else-if="prop.type === 'string'">
            <v-text-field
              :label="prop.key"
              :model-value="component.props[prop.key]"
              @update:model-value="
                $emit('update', {
                  key: prop.key,
                  value: $event
                })
              "
            />
          </template>
          <template v-else-if="prop.type === 'boolean'">
            <v-switch
              :label="prop.meta?.name || prop.key"
              :model-value="component.props[prop.key]"
              @update:model-value="
                $emit('update', {
                  key: prop.key,
                  value: $event
                })
              "
            />
          </template>
          <template v-else-if="prop.type === 'select'">
            <v-select
              :label="prop.meta.name"
              :items="prop.meta.options"
              :model-value="component.props[prop.key]"
              @update:model-value="
                $emit('update', {
                  key: prop.key,
                  value: $event
                })
              "
              item-title="text"
              item-key="value"
            />
          </template>
          <template v-else-if="prop.type === 'range'">
            <v-slider
              :label="prop.key"
              :min="prop.meta.min"
              :max="prop.meta.max"
              :step="prop.meta.step"
              :model-value="component.props[prop.key]"
              @update:model-value="
                $emit('update', {
                  key: prop.key,
                  value: $event
                })
              "
              thumb-label
            />
          </template>
        </div>
      </v-container>
      <div v-if="!props?.length">
        <v-container>
          <v-alert type="info" variant="tonal">
            This component has no settings.
          </v-alert>
        </v-container>
      </div>
    </template>
  </CoreDialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CoreDialog from "@/components/Core/Dialogs/Dialog.vue";
import { Component } from "@/types/userv3";

export default defineComponent({
  name: "UserV3Settings",
  components: { CoreDialog },
  props: ["modelValue", "user", "component", "components"],
  computed: {
    metaComponent() {
      return (
        this.components.find(
          (component: Component) => component.id === this.component.name
        ) || { name: "Unknown" }
      );
    },
    props() {
      return Object.entries(this.metaComponent?.props || {}).map(
        ([key, value]) => ({
          key,
          value,
          meta: this.components.find(
            (component: Component) => component.id === this.component.name
          )?.meta[key],
          type:
            this.components.find(
              (component: Component) => component.id === this.component.name
            )?.meta[key]?.type || typeof value
        })
      );
    }
  }
});
</script>

<style scoped></style>
