<template>
  <span v-if="user">
    <v-hover v-slot="{ isHovering, props }">
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
          class="text-center cover"
          :size="size"
          v-bind="props"
        >
          <v-img aspect-ratio="1/1" v-if="user.avatar" :src="avatarURL" />
          <v-fade-transition v-if="isHovering && edit">
            <div @click="removeAvatar" style="cursor: pointer">
              <v-overlay absolute>
                <v-icon large>mdi-close</v-icon>
              </v-overlay>
            </div>
          </v-fade-transition>
          <v-fade-transition v-else-if="isHovering">
            <slot></slot>
          </v-fade-transition>
        </v-avatar>
        <v-avatar
          :class="{ outline: outline }"
          v-if="!user.avatar"
          class="text-center justify-center"
          justify="center"
          :size="size"
          :color="noColor ? undefined : '#0190ea'"
          v-bind="props"
        >
          <span :class="textSize" class="unselectable">
            {{ user.username.charAt(0).toUpperCase() }}
          </span>
          <v-fade-transition v-if="isHovering && edit">
            <div @click="handleClick" style="cursor: pointer">
              <v-overlay absolute>
                <v-icon large>mdi-upload</v-icon>
              </v-overlay>
            </div>
          </v-fade-transition>
          <v-fade-transition v-else-if="isHovering">
            <slot></slot>
          </v-fade-transition>
        </v-avatar>
      </span>
    </v-hover>
    <template v-if="status">
      <v-badge
        :color="$functions.userStatus(friendStatus).color"
        :offset-y="statusYOffset ?? offset"
        :offset-x="statusXOffset ?? 10"
        bordered
        :dot="dotStatus"
        v-if="friendStatus"
      >
        <v-tooltip activator="parent" location="top">
          {{ $functions.userStatus(friendStatus).text }}
        </v-tooltip>
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
    "status",
    "outline",
    "statusXOffset",
    "emulatedStatus",
    "dotStatus",
    "statusYOffset"
  ],
  data() {
    return {
      avatar: undefined
    };
  },
  computed: {
    avatarURL() {
      if (this.user.avatar?.length > 20) {
        return "https://colubrina.troplo.com/usercontent/" + this.user.avatar;
      } else {
        return "/i/" + this.user.avatar;
      }
    },
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
      } else if (this.size > 24) {
        classes += " text-h5";
      } else {
        classes += " text-h6";
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
    },
    friendStatus() {
      if (this.emulatedStatus) return this.emulatedStatus;
      if (this.user.id === this.$user.user?.id)
        return this.$user.user?.storedStatus;
      return this.$friends.friends.find((f) => f.friendId === this.user.id)
        ?.otherUser?.status;
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

<style scoped>
.outline {
  border: 2px solid #151515;
  border-radius: 50%;
}
</style>
