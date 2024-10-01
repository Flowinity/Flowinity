import { useEndpointsStore } from "@/store/endpoints.store";

export function setupEndpoints(app) {
  useEndpointsStore().fetchEndpoints();
}
