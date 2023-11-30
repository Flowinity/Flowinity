<template>
  <div>
    <v-text-field
      v-if="typeof value === 'string' || typeof value === 'number'"
      :model-value="value"
      :label="
        persistentKey +
        (persistentKey.includes('flowinity') ? ' (deprecated)' : '')
      "
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
      :model-value="value"
      :label="name"
      :disabled="name === 'officialInstance'"
      class="mb-n6"
      @update:model-value="
        $emit('update:object', { key: persistentKey, value: $event })
      "
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
      v-for="(value2, key2, i) in value"
      v-else-if="typeof value === 'object' && !Array.isArray(value)"
      :key="key2"
    >
      <v-card-text v-if="i === 0" style="padding: 0">{{ name }}:</v-card-text>
      <ConfigObject
        :style="deepStyle"
        :value="value2"
        :name="key2"
        :deep="deep + 1"
        :persistent-key="persistentKey + '.' + key2"
        @update:object="$emit('update:object', $event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    name: { type: [String, undefined] },
    value: { type: Object },
    deep: { type: Number },
    persistentKey: { type: String }
  },
  emits: ["update:object"],
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
