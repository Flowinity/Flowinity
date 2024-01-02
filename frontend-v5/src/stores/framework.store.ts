import { defineStore } from "pinia";
import { ref } from "vue";
import theme from "@/plugins/theme";
import { useRouter } from "vue-router";

export const useFrameworkStore = defineStore("framework", () => {
  const router = useRouter();
  const dialogsOpened = ref(0);
  const breakpoints = ref({
    mobile: false,
    sm: false,
    md: false,
    lg: true,
    xl: false,
    "2xl": false,
    "3xl": false
  });
  type Breakpoints = keyof typeof breakpoints.value;

  function refreshBreakpoints() {
    const keys = Object.keys(theme.screens) as Breakpoints[];
    keys.sort((a, b) => {
      const screenA = parseInt(theme.screens[a], 10);
      const screenB = parseInt(theme.screens[b], 10);
      return screenB - screenA;
    });

    for (const key of keys) {
      const val = window.innerWidth >= parseInt(theme.screens[key], 10);
      breakpoints.value[key] = val;
      if (val) {
        for (const k in theme.screens as Breakpoints[]) {
          if (key === k) break;
          breakpoints.value[k] = false;
        }
        break;
      }
    }

    // if all are false, set mobile to true
    const breakpointsExceptMobile = { ...breakpoints.value, mobile: undefined };
    breakpoints.value.mobile = !Object.values(breakpointsExceptMobile).some(
      (v) => v
    );
  }

  window.addEventListener("resize", refreshBreakpoints);
  refreshBreakpoints();

  async function push(path: string) {
    await router.push(path);
  }

  return { dialogsOpened, breakpoints, push };
});
