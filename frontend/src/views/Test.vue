<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="#0190ea" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>My Awesome Website</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <h1>Welcome to my awesome website!</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eu
          mauris vel enim mollis pulvinar. In hac habitasse platea dictumst.
          Proin accumsan, velit id gravida convallis, quam tellus fringilla mi,
          vel dictum dolor enim in urna.
        </p>
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; 2023 My Awesome Website</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      drawer: false,
      items: [
        { title: "Home", icon: "mdi-home", link: "/" },
        { title: "About", icon: "mdi-information-outline", link: "/about" },
        { title: "Contact", icon: "mdi-email", link: "/contact" }
      ]
    };
  }
};
</script>
