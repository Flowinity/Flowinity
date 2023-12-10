<template>
  <span style="position: relative">
    <iframe
      ref="iframe"
      allowtransparency="true"
      csp="script-src 'none'; object-src 'none';"
      sandbox="allow-same-origin"
      style="width: 100%; height: 100%; border: none"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Message",
  data() {
    return {
      message: {
        source: "",
        parsed: {
          html: "Default"
        }
      }
    };
  },
  watch: {
    $route() {
      this.fetchMessage();
    }
  },
  mounted() {
    this.fetchMessage();
  },
  methods: {
    async fetchMessage() {
      const iframe = this.$refs.iframe;
      // get css variable
      const bg = getComputedStyle(document.documentElement).getPropertyValue(
        "--v-theme-background"
      );
      console.log(bg);
      //@ts-ignore
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(
        this.$user.theme === "light"
          ? `<style>* { color: black !important; font-family: "Inter", sans-serif !important; background-color: rgb(${bg}) !important; }</style>`
          : `<style>* { color: white !important; font-family: "Inter", sans-serif !important; background-color: rgb(${bg}) !important; }</style>`
      );
      const { data } = await this.axios.get(
        `/mail/message/${this.$mail.selectedMailbox}/${this.$route.params.messageId}`
      );
      this.message = data;
      console.log(this.message, iframe);
      if (!iframe) return;
      iframeDoc.write(this.message.parsed.html);
      iframeDoc.close();
    }
  }
});
</script>

<style>
.message-email {
  width: 100%;
  height: 100%;
}

.message-email * {
  background-color: #101010 !important;
  position: relative;
  z-index: 1;
  color: white !important;
}
</style>
