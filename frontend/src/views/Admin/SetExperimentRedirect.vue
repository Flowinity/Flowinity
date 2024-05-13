<template></template>

<script lang="ts" setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useExperimentsStore } from "@/store/experiments.store";
import { useToast } from "vue-toastification";
import { isNumeric } from "@/plugins/isNumeric";
import { useAppStore } from "@/store/app.store";

const route = useRoute();
const router = useRouter();
const experimentStore = useExperimentsStore();
const appStore = useAppStore();
const toast = useToast();

const checked = ref(false);

async function setExperiment() {
  const experiment = route.params.experiment;
  const valid =
    experimentStore.experiments[<string>experiment] !== undefined &&
    experiment !== "meta";
  if (!valid) {
    if (!checked.value) {
      await experimentStore.init();
      checked.value = true;
      return setExperiment();
    } else {
      toast.error("Invalid experiment");
    }
  } else {
    const value = isNumeric(<string>route.params.value)
      ? parseInt(<string>route.params.value)
      : experimentStore.experiments[<string>experiment];
    try {
      experimentStore.setExperiment(<string>experiment, <number>value);
    } catch (e) {
      experimentStore.experiments[<string>experiment] = value;
      toast.warning("Experiment will only be set for this session");
    }
  }
  router.push(appStore.lastRoute || "/");
}

onMounted(() => {
  setExperiment();
});
</script>

<style scoped></style>
