<template>
  <div>
    <v-text-field
      v-if="typeof value === 'string' || typeof value === 'number'"
      :label="<string>persistentKey + (persistentKey.includes('flowinity') ? ' (deprecated)' : '')"
      :model-value="value"
      :type="
        ['password', 'token', 'secret', 'key'].some((s) =>
          persistentKey.toLowerCase().includes(s)
        )
          ? 'password'
          : undefined
      "
      @update:model-value="
        $emit('update:object', {
          key: persistentKey,
          value: typeof value === 'number' ? parseInt($event) : $event
        })
      "
    />
    <v-switch
      v-else-if="typeof value === 'boolean'"
      :disabled="name === 'officialInstance'"
      :label="name"
      :model-value="value"
      class="mb-n6"
      @update:model-value="
        $emit('update:object', { key: persistentKey, value: $event })
      "
    />
    <v-textarea
      v-else-if="Array.isArray(value)"
      :label="name"
      :model-value="JSON.stringify(value, null)"
      @update:model-value="
        $emit('update:object', {
          key: persistentKey,
          value: parse($event)
        })
      "
    />
    <div
      v-for="(value2, name2, i) in value"
      v-else-if="typeof value === 'object' && !Array.isArray(value)"
    >
      <v-card-text v-if="i === 0" style="padding: 0">{{ name }}:</v-card-text>
      <ConfigObject
        :config="value2"
        :deep="deep + 1"
        :name="name2"
        :persistentKey="persistentKey + '.' + name2"
        :style="deepStyle"
        :value="value2"
        @update:object="$emit('update:object', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import VueMonacoEditor from "@guolao/vue-monaco-editor";

export default defineComponent({
  name: "ConfigObject",
  props: ["config", "name", "value", "deep", "persistentKey"],
  components: {VueMonacoEditor},
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
