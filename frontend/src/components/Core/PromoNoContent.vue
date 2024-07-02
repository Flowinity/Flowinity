<template>
  <div class="flex flex-col items-center unselectable">
    <v-icon v-if="typeof icon === 'string'" size="120">
      {{ icon }}
    </v-icon>
    <component v-else :is="icon" size="120" />
    <div class="text-center">
      <h2 class="text-2xl font-bold">
        {{ title }}
      </h2>
      <p class="text-lg">
        {{ description }}
      </p>
      <div class="mt-2" v-if="$slots.button">
        <v-btn @click="$emit('button:click')" class="font-bold">
          <slot name="button" />
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";

export default defineComponent({
  name: "PromoNoContent",
  components: { FlowinityLogo },
  props: ["icon", "title", "description"],
  emits: ["button:click"]
});
</script>
