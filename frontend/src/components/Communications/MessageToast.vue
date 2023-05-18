<template>
  <div class="position-relative">
    <span
      class="mb-n7"
      style="
        display: block;
        width: 200px;
        height: 50px;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
      "
    >
      {{ message.content }}
    </span>
    <br />
    <small class="mr-1 text-grey-lighten-3">
      - {{ message.user.username }} &bullet;
      {{ $chat.lookupChat(message.chatId).name }}
    </small>
    <div class="position-absolute" style="right: 0; top: 0">
      <div
        v-if="message.user.avatar"
        class="v-avatar theme--dark v-avatar--density-default v-avatar--size-default v-avatar--variant-flat"
        style="background-color: #303030"
      >
        <div class="v-responsive v-img">
          <div class="v-responsive__sizer" style="padding-bottom: 100%"></div>
          <img
            :src="$app.domain + message.user.avatar"
            alt=""
            class="v-img__img v-img__img--cover"
            style=""
          />
        </div>
        <span class="v-avatar__underlay"></span>
      </div>
      <div
        v-else
        class="v-avatar v-theme--dark v-avatar--density-default v-avatar--size-default v-avatar--variant-flat"
        style="background-color: rgb(1, 144, 234)"
      >
        <span class="text-h5">
          {{ message.user.username.charAt(0).toUpperCase() }}
        </span>
        <span class="v-avatar__underlay"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MessageToast",
  props: ["message"]
});
</script>

<style>
.message-toast {
  background: rgba(64, 62, 62, 0.7);
}
</style>
