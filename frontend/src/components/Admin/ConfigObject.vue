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
      :label="
        persistentKey +
        (persistentKey.includes('flowinity') ? ' (deprecated)' : '')
      "
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
      v-for="(value2, key2, i) in value"
      :key="key2"
      v-else-if="typeof value === 'object' && !Array.isArray(value)"
    >
      <v-card-text style="padding: 0" v-if="i === 0">{{ name }}:</v-card-text>
      <ConfigObject
        :style="deepStyle"
        :value="value2"
        :name="key2"
        :deep="deep + 1"
        @update:object="$emit('update:object', $event)"
        :persistentKey="persistentKey + '.' + key2"
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
