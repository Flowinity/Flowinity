<template>
  <span style="position: relative">
    <v-hover v-slot="{ isHovering, props }">
      <UploadCropper
        v-model="dialog"
        aspect-ratio="1"
        title="Upload Avatar"
        @finish="changeAvatar"
        v-if="user?.id === $user.user?.id"
      />
      <v-avatar
        :size="size"
        v-bind="props"
        class="text-center justify-center undraggable position-relative"
        justify="center"
        :color="
          noColor || $functions.avatar(chat || user) ? undefined : 'primary'
        "
      >
        <v-img
          v-if="chat?.icon || user?.avatar"
          :src="$functions.avatar(chat || user)"
          class="undraggable user-avatar"
          :cover="true"
        ></v-img>
        <span v-else :class="textSize" class="unselectable">
          {{
            chat?.name?.charAt(0)?.toUpperCase() ??
            user?.username?.charAt(0)?.toUpperCase() ??
            "?"
          }}
        </span>
        <v-fade-transition v-if="isHovering && edit">
          <div style="cursor: pointer" @click="dialog = true">
            <v-overlay
              :model-value="isHovering"
              class="align-center justify-center"
              :contained="true"
              style="z-index: 20"
            >
              <v-icon large>mdi-upload</v-icon>
            </v-overlay>
          </div>
        </v-fade-transition>
        <slot :hovering="isHovering as boolean"></slot>
      </v-avatar>
      <template v-if="status && friendStatus">
        <div
          class="status"
          :class="{ 'dot-status': dotStatus }"
          :style="{
            backgroundColor: $functions.userStatus(friendStatus).color
          }"
        >
          <v-tooltip :eager="false" location="top" activator="parent">
            {{ $functions.userStatus(friendStatus).text }}
          </v-tooltip>
        </div>
      </template>
    </v-hover>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
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
    "statusYOffset",
    "light",
    "chat"
  ],
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    x() {
      return this.statusXOffset || 0 + "px";
    },
    y() {
      return this.statusYOffset || 69420 + "px";
    },
    offset() {
      return this.size / 4;
    },
    statusSize() {
      if (this.dotStatus) return 10 + "px";
      return 15 + "px";
    },
    textSize() {
      let classes = "";
      if (this.$user.contrast) {
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
    friendStatus() {
      if (!this.user) return;
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
      this.axios.delete("/user/upload/avatar").then(() => {
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
.status {
  position: absolute;
  right: 0.4rem;
  bottom: -190%;
  width: v-bind(statusSize);
  height: v-bind(statusSize);
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-background));
  z-index: 100;
}

.dot-status {
  bottom: 0;
  right: 0;
}

.outline {
  border: 2px solid #151515;
  border-radius: 50%;
}
</style>
