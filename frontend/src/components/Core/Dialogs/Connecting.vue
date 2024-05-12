<template>
  <v-dialog v-model="model" fullscreen>
    <v-card class="flex w-full h-full items-center justify-center">
      <FlowinityLogoAnimated
        :animate="true"
        style="max-height: 128px"
        color="card"
      />
      <small class="mt-2" v-if="status">
        Not connecting? Check your internet connection, or
        <a
          :href="
            $app.site.maintenance.statusPage || 'https://status.troplo.com'
          "
          target="_blank"
        >
          click here
        </a>
        to check Flowinity's status.
      </small>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";

const model = defineModel<boolean>();
const status = ref(false);
const timeout = ref<undefined | ReturnType<typeof setTimeout>>(undefined);

onMounted(() => {
  clearTimeout(timeout.value);
  timeout.value = setTimeout(() => {
    status.value = true;
  }, 10000);
});

watch(model, (val) => {
  if (val) {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      status.value = true;
    }, 10000);
  } else {
    clearTimeout(timeout.value);
    status.value = false;
  }
});
</script>

<style scoped></style>
