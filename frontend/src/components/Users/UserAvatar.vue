<template>
  <span style="position: relative">
    <v-hover v-slot="{ isHovering, props }">
      <UploadCropper
        v-if="(edit && user?.id === $user.user?.id) || (edit && overrideId)"
        v-model="dialog"
        aspect-ratio="1"
        title="Upload Avatar"
        type="userProfile"
        @finish="changeAvatar"
        @remove="removeAvatar"
      />
      <v-avatar
        :size="size"
        v-bind="props"
        class="text-center justify-center undraggable position-relative user-avatar-parent"
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
        />
        <span v-else :class="textSize" class="unselectable">
          {{
            user?.username?.charAt(0)?.toUpperCase() ??
            chat?.name?.charAt(0)?.toUpperCase() ??
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
        <slot :hovering="isHovering as boolean" />
      </v-avatar>
      <template v-if="status && friendStatus">
        <div
          class="status align-center justify-center d-flex"
          :class="{ 'dot-status': dotStatus, 'typing-status': typing }"
          :style="{
            backgroundColor:
              friendStatus === UserStatus.Idle
                ? 'rgb(var(--v-theme-background))'
                : functions.userStatus(friendStatus).color
          }"
        >
          <v-tooltip :eager="false" location="top" activator="parent">
            {{ statusTooltip || $functions.userStatus(friendStatus).text }}
          </v-tooltip>
          <transition>
            <slot v-if="!typing" name="status-content">
              <div
                v-if="friendStatus === UserStatus.Busy"
                class="rounded do-not-disturb"
                :class="{ lg: !dotStatus }"
              />
              <RiMoonFill
                v-else-if="friendStatus === UserStatus.Idle"
                style="stroke-width: 1px; transform: rotate(-90deg)"
                :style="{
                  strokeColor: functions.userStatus(friendStatus).color,
                  fill: functions.userStatus(friendStatus).color
                }"
              />
              <RiCheckLine
                v-else-if="friendStatus === UserStatus.Online"
                style="fill: black"
                :style="{
                  height: statusSize,
                  width: statusSize
                }"
              />
              <div v-else style="background: #101113; border-radius: 100%" />
            </slot>
            <div v-else class="d-inline-flex align-center justify-center">
              <div class="dot" style="margin-right: 2px"></div>
              <div class="dot" style="margin-right: 2px"></div>
              <div class="dot"></div>
            </div>
          </transition>
        </div>
        <!-- TODO: reimplement mobile status
        <span v-else>
          <v-tooltip :eager="false" location="top" activator="parent">
            {{ $functions.userStatus(friendStatus).text }}
          </v-tooltip>
          <v-icon
            class="status"
            :class="{ 'dot-status': dotStatus }"
            :size="dotStatus ? 'x-small' : undefined"
            :color="$functions.userStatus(friendStatus).color"
          >
            mdi-cellphone
          </v-icon>
        </span>
        -->
      </template>
    </v-hover>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UploadCropper from "@/components/Core/Dialogs/UploadCropper.vue";
import { UserStatus, UserStoredStatus } from "@/gql/graphql";
import functions from "@/plugins/functions";
import RiMoonFill from "@/components/Icons/v5/ri-moon-fill.vue";
import RiCheckLine from "@/components/Icons/v5/ri-check-line.vue";

export default defineComponent({
  name: "UserAvatar",
  components: { RiCheckLine, RiMoonFill, UploadCropper },
  props: [
    "user",
    "size",
    "noColor",
    "edit",
    "status",
    "outline",
    "statusXOffset",
    "emulatedStatus",
    "dotStatus",
    "statusYOffset",
    "light",
    "chat",
    "overrideId",
    "bot",
    "typing",
    "statusTooltip"
  ],
  emits: ["refresh"],
  data() {
    return {
      dialog: false
    };
  },
  computed: {
    functions() {
      return functions;
    },
    UserStatus() {
      return UserStatus;
    },
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
      if (this.dotStatus) return 14 + "px";
      return 20 + "px";
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
      if (this.emulatedStatus === UserStoredStatus.Busy) return UserStatus.Busy;
      if (this.emulatedStatus === UserStoredStatus.Idle) return UserStatus.Idle;
      if (this.emulatedStatus === UserStoredStatus.Online)
        return UserStatus.Online;
      if (this.emulatedStatus === UserStoredStatus.Invisible)
        return UserStatus.Offline;
      if (this.emulatedStatus) return this.emulatedStatus;
      if (!this.user) return;
      return this.$user.getStatus(this.user);
    },
    friendDevice() {
      if (!this.user) return "web";
      if (this.emulatedStatus) return "web";
      if (this.user.id === this.$user.user?.id)
        return this.$user.user?.platforms?.[0]?.platform ?? "web";
      const friend = this.$friends.friends.find(
        (f) => f.friendId === this.user.id
      );
      return friend?.otherUser?.platforms?.[0]?.platform ?? "web";
    }
  },
  methods: {
    async removeAvatar() {
      if (!this.edit) return;
      await this.axios.delete("/user/upload/avatar");
      this.$emit("refresh");
    },
    async changeAvatar(file: File) {
      if (!file || !this.edit) return;
      let formData = new FormData();
      formData.append("banner", file);
      await this.axios.post("/user/upload/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        params: this.overrideId
          ? {
              oauthAppId: this.overrideId,
              bot: this.bot
            }
          : {}
      });
      this.$emit("refresh");
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

<style scoped lang="scss">
.status {
  position: absolute;
  right: 0.4rem;
  bottom: -190%;
  width: v-bind(statusSize);
  height: v-bind(statusSize);
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-background));
  z-index: 100;
  display: flex;
  justify-content: center;
  transition:
    background-color 0.2s,
    color 0.2s,
    width 0.2s;
  align-items: center;
}

.dot-status {
  bottom: -1px;
  right: 0;
}

.outline {
  border: 2px solid #151515;
  border-radius: 50%;
}

.dot {
  width: 0.2em;
  height: 0.2em;
  background: #101113;
  border-radius: 50%;
  animation: blink 1.5s infinite;
  opacity: 0;
}

.dot:nth-child(2) {
  animation-delay: 0.375s;
}

.dot:nth-child(3) {
  animation-delay: 0.75s;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
}

.typing-status {
  width: 22px;
  border-radius: 12px;
}

.do-not-disturb {
  height: 2px;
  width: 6px;
  background: #101113;
}

.do-not-disturb.lg {
  height: 2.5px;
  width: 8px;
}
</style>
