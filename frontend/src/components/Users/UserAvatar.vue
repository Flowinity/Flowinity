<template>
  <span v-if="user">
    <v-hover v-slot="{ hover }">
      <span>
        <v-file-input
          hide-input
          ref="fileInput"
          style="display: none"
          truncate-length="15"
          v-model="avatar"
          v-if="edit"
        ></v-file-input>
        <v-avatar
          v-if="user.avatar"
          :src="'/i/' + user.avatar"
          class="text-center"
          :size="size"
        >
          <v-img
            aspect-ratio="1/1"
            v-if="user.avatar"
            :src="'/i/' + user.avatar"
          />
          <v-fade-transition v-if="hover && edit">
            <div @click="removeAvatar" style="cursor: pointer">
              <v-overlay absolute>
                <v-icon large>mdi-close</v-icon>
              </v-overlay>
            </div>
          </v-fade-transition>
        </v-avatar>
        <v-avatar
          v-if="!user.avatar"
          class="text-center justify-center"
          justify="center"
          :size="size"
          :color="noColor ? '' : 'primary'"
        >
          <span :class="textSize">
            {{ user.username.charAt(0).toUpperCase() }}
          </span>
          <v-fade-transition v-if="hover && edit">
            <div @click="handleClick" style="cursor: pointer">
              <v-overlay absolute>
                <v-icon large>mdi-upload</v-icon>
              </v-overlay>
            </div>
          </v-fade-transition>
        </v-avatar>
      </span>
    </v-hover>
    <template v-if="status">
      <v-badge color="success" :offset-y="offset" offset-x="10" bordered>
      </v-badge>
    </template>
    <template v-if="(size > 60 || forceBadges) && !noBadges">
      <v-tooltip top v-if="user.administrator || user.admin">
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-badge color="primary" overlap>
              <template v-slot:badge>
                <div class="d-flex align-center justify-center">
                  <v-icon>mdi-shield</v-icon>
                </div>
              </template>
            </v-badge>
          </span>
        </template>
        <span>TPU Administrator</span>
      </v-tooltip>
      <v-tooltip top v-else-if="user.moderator">
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-badge color="success" overlap>
              <template v-slot:badge>
                <div class="d-flex align-center justify-center">
                  <v-icon>mdi-shield</v-icon>
                </div>
              </template>
            </v-badge>
          </span>
        </template>
        <span>TPU Moderator</span>
      </v-tooltip>
      <v-tooltip top v-else-if="user.plan?.internalName !== 'FREE'">
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <v-badge :color="user.plan?.color" overlap>
              <template v-slot:badge>
                <div class="d-flex align-center justify-center">
                  <v-icon>{{ user.plan?.icon }}</v-icon>
                </div>
              </template>
            </v-badge>
          </span>
        </template>
        <span>TPU {{ user.plan?.name }}</span>
      </v-tooltip>
    </template>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserAvatar",
  props: [
    "user",
    "size",
    "noColor",
    "forceBadges",
    "noBadges",
    "edit",
    "status"
  ],
  data() {
    return {
      avatar: undefined
    };
  },
  computed: {
    offset() {
      return this.size / 4;
    },
    textSize() {
      let classes = "";
      //@ts-ignore
      if (this.contrast === "black") {
        classes += "black--text";
      } else {
        classes += "white--text";
      }
      if (this.size > 80) {
        classes += " text-h4";
      } else {
        classes += " text-h5";
      }
      return classes;
    },
    contrast() {
      return "white";
      /*return window.__TROPLO_INTERNALS_GLOBALS.contrastColor(
        this.$store.state.user?.plan?.color,
        this.$store.state.user?.plan?.internalName === "GOLD",
        this.$vuetify.theme.themes[this.$vuetify.theme.dark ? "dark" : "light"]
      )*/
    }
  },
  methods: {
    handleClick() {
      if (!this.edit) return;
      //@ts-ignore
      this.$refs.fileInput.$refs.input.click();
    },
    removeAvatar() {
      if (!this.edit) return;
      this.axios.delete("/api/v2/user/avatar").then(() => {
        this.$emit("refresh");
      });
    },
    changeAvatar() {
      if (!this.avatar || !this.edit) return;
      let formData = new FormData();
      formData.append("avatar", this.avatar);
      this.axios
        .post("/api/v2/user/avatar", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(() => {
          this.$emit("refresh");
        });
    }
    /*calcOffset() {
      if (this.user.administrator || this.user.admin || this.user.moderator) {
        return 11
      } else {
        return 0
      }
    }*/
  },
  watch: {
    avatar() {
      this.changeAvatar();
    }
  }
});
</script>

<style scoped></style>
