import { defineStore } from "pinia";
import { ref } from "vue";

export const useFrameworkStore = defineStore("framework", () => {
  const dialogsOpened = ref(0);

  return { dialogsOpened };
});
