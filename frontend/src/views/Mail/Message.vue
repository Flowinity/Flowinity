<template>
  <span style="position: relative">
    <iframe
      sandbox="allow-same-origin"
      csp="script-src 'none'; object-src 'none';"
      style="width: 100%; height: 100%; border: none"
      ref="iframe"
      allowtransparency="true"
    />
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DOMPurify from "dompurify";

export default defineComponent({
  name: "Message",
  data() {
    return {
      message: {
        source: "",
        parsed: {
          html: "deez"
        }
      }
    };
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
  },
  mounted() {
    this.fetchMessage();
  },
  watch: {
    $route() {
      this.fetchMessage();
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
