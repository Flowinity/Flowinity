// Utilities
import { defineStore } from "pinia"
import axios from "@/plugins/axios"

export interface ExperimentsState {
  experiments: Record<string, string>
  experimentsInherit: Record<string, string>
}

export const useExperimentsStore = defineStore("experiments", {
  state: () =>
    ({
      experiments: {},
      experimentsInherit: {}
    } as ExperimentsState),
  getters: {},
  actions: {
    async init() {
      const experiments = localStorage.getItem("experimentsStore")
      if (experiments) {
        try {
          this.experiments = JSON.parse(experiments)
        } catch {
          //
        }
      }
      const { data } = await axios.get("/core/experiments")
      this.experiments = {
        ...data,
        ...JSON.parse(localStorage.getItem("experiments") || "{}")
      }
      this.experimentsInherit = data
      localStorage.setItem("experimentsStore", JSON.stringify(data))
    }
  }
})
