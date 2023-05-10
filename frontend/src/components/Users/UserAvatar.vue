<template>
  <span v-if="user">
    <UploadCropper
      title="Upload Avatar"
      v-model="dialog"
      @finish="changeAvatar"
      aspect-ratio="1"
    />
    <v-hover v-slot="{ isHovering, props }">
      <span v-bind="props">
        <v-avatar
          :class="{ outline }"
          class="text-center justify-center undraggable"
          justify="center"
          :size="size"
          :color="
            noColor || user.avatar ? undefined : $user.theme.colors.primary
          "
        >
          <v-img
            v-if="user.avatar"
            :src="avatarURL"
            cover
            class="undraggable"
          />
          <span :class="textSize" v-else class="unselectable">
            {{ user.username.charAt(0).toUpperCase() }}
          </span>
          <v-fade-transition v-if="isHovering && edit">
            <div @click="dialog = true" style="cursor: pointer">
              <v-overlay
                contained
                :model-value="isHovering"
                class="align-center justify-center"
              >
                <v-icon large>mdi-upload</v-icon>
              </v-overlay>
            </div>
          </v-fade-transition>
          <v-fade-transition v-else-if="isHovering">
            <slot></slot>
          </v-fade-transition>
          <slot name="inline"></slot>
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
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { is } from "immutable";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";

export default defineComponent({
  name: "UserAvatar",
  components: { UploadCropper },
  props: [
    "user",
    "size",
    "noColor",
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
      dialog: false
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
        classes += "black-text";
      } else {
        classes += "white-text";
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
    removeAvatar() {
      if (!this.edit) return;
      this.axios.delete("/api/v2/user/upload/avatar").then(() => {
        this.$emit("refresh");
      });
    },
    changeAvatar(file: File) {
      if (!file || !this.edit) return;
      let formData = new FormData();
      formData.append("banner", file);
      this.axios
        .post("/user/upload/avatar", formData, {
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
  }
});
</script>

<style scoped>
.outline {
  border: 2px solid #151515;
  border-radius: 50%;
}
</style>
