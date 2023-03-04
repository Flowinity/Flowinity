import Gallery from "./Gallery.vue";
import vuetify from "@/plugins/vuetify";

describe("<Gallery />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(Gallery, {
      global: {
        plugins: [vuetify]
      }
    });
  });
});
