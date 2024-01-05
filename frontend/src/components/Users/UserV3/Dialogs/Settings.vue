<template>
  <CoreDialog
    v-if="$user.user.profileLayout"
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #title>
      {{ component ? `${metaComponent.name} Settings` : "Settings" }}
    </template>
    <template v-if="!component">
      <v-container>
        <v-switch
          v-model="$user.user.profileLayout.config.showStatsSidebar"
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
        <div v-for="prop of props" :key="prop.key">
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
              :items="prop.meta.options"
              :label="prop.meta.name"
              :model-value="component.props[prop.key]"
              item-value="value"
              item-title="text"
              @update:model-value="
                $emit('update', {
                  key: prop.key,
                  value: $event
                })
              "
            />
          </template>
          <template v-else-if="prop.type === 'range'">
            <v-slider
              :label="prop.key"
              :max="prop.meta.max"
              :min="prop.meta.min"
              :model-value="component.props[prop.key]"
              :step="prop.meta.step"
              thumb-label
              @update:model-value="
                $emit('update', {
                  key: prop.key,
                  value: $event
                })
              "
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
  components: { CoreDialog },
  props: ["modelValue", "user", "component", "components"],
  emits: ["update", "trigger", "update:modelValue"],
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
