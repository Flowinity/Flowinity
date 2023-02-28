<template>
  <span style="position: relative">
    <iframe class="message-email" ref="iframe" sandbox v-if="false" />
    Coming soon.
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
      /*const iframe = this.$refs.iframe;
      //@ts-ignore
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(
        "<style>body { background-color: #101010 !important; color: white !important; font-family: Inter sans-serif !important }</style>"
      );*/
      const { data } = await this.axios.get(
        `/mail/message/${this.$mail.selectedMailbox}/${this.$route.params.messageId}`
      );
      this.message = data;
      /*if (!iframe) return;
      iframeDoc.write(this.message.parsed.html);
      iframeDoc.close();*/
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
