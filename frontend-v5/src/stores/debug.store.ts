import { defineStore } from "pinia";
import { ref, watch } from "vue";

type Operation = {
  id: string;
  name: string;
  args: any;
  result: any;
  time: number;
  type: "query" | "mutation" | "subscription";
};

export const useDebugStore = defineStore("debug", () => {
  const recentOperations = ref<Operation[]>([]);

  watch(recentOperations, (value) => {
    if (value.length > 100) {
      recentOperations.value = value.slice(0, 100);
    }
  });

  return {
    recentOperations
  };
});
