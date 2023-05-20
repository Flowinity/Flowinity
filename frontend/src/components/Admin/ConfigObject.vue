<template>
  <div>
    <v-text-field
      @update:model-value="
        $emit('update:object', {
          key: persistentKey,
          value: typeof value === 'number' ? parseInt($event) : $event
        })
      "
      :model-value="value"
      :label="<string>persistentKey + (persistentKey.includes('flowinity') ? ' (deprecated)' : '')"
      v-if="typeof value === 'string' || typeof value === 'number'"
      :type="
        ['password', 'token', 'secret', 'key'].some((s) =>
          persistentKey.toLowerCase().includes(s)
        )
          ? 'password'
          : undefined
      "
    />
    <v-switch
      v-else-if="typeof value === 'boolean'"
      :model-value="value"
      :label="name"
      :disabled="name === 'officialInstance'"
      @update:model-value="
        $emit('update:object', { key: persistentKey, value: $event })
      "
      class="mb-n6"
    />
    <v-textarea
      v-else-if="Array.isArray(value)"
      :model-value="JSON.stringify(value, null)"
      :label="name"
      @update:model-value="
        $emit('update:object', {
          key: persistentKey,
          value: parse($event)
        })
      "
    />
    <div
      v-for="(value, name2, i) in value"
      v-else-if="typeof value === 'object' && !Array.isArray(value)"
    >
      <v-card-text style="padding: 0" v-if="i === 0">{{ name }}:</v-card-text>
      <ConfigObject
        :style="deepStyle"
        :value="value"
        :name="name2"
        :config="value"
        :deep="deep + 1"
        @update:object="$emit('update:object', $event)"
        :persistentKey="persistentKey + '.' + name2"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VueMonacoEditor from "@guolao/vue-monaco-editor";

export default defineComponent({
  name: "ConfigObject",
  props: ["config", "name", "value", "deep", "persistentKey"],
  components: { VueMonacoEditor },
  computed: {
    deepStyle() {
      return {
        paddingLeft: `${(this.deep + 1) * 10}px`
      };
    }
  },
  methods: {
    parse(value: string) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return null;
      }
    }
  }
});
</script>

<style scoped></style>
