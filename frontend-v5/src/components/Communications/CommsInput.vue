<template>
  <div
    class="flex flex-col bg-sidebar-dark p-2 rounded outline outline-card-secondary-dark w-full input"
    style="transition: all 0.5s linear"
  >
    <slot />
    <div class="flex w-full items-center justify-center">
      <div
        style="width: 25px"
        class="cursor-pointer"
        v-tooltip.top="t('chats.input.attachments')"
        v-if="!editing"
      >
        <RiAddCircleFill style="width: 100%; height: 100%" />
      </div>
      <text-field
        ref="input"
        v-bind="$attrs"
        :html-id="id"
        :model-value="modelValue"
        placeholder="Keep it civil..."
        :textarea="true"
        :max-lines="7"
        :shift-enter-new-line="true"
        @update:model-value="
          $emit('update:modelValue', $event);
          links($event);
        "
        :persistent-placeholder="true"
        style="padding: 0; border-bottom: none; width: 100%"
        parent-classes="w-full p-2"
      ></text-field>
      <slot name="append" :emit="$emit">
        <div
          style="width: 25px"
          class="cursor-pointer"
          v-tooltip.top="t('chats.input.send')"
          @click="$emit('send')"
        >
          <RiSendPlane2Fill style="width: 100%; height: 100%" />
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import { ref, watch } from "vue";
import Card from "@/components/Framework/Card/Card.vue";
import { EmbedDataV2 } from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { EmbedPrecacheMutation } from "@/graphql/chats/embedPrecache.graphql";
import { throttle } from "lodash";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiAddCircleFill from "vue-remix-icons/icons/ri-add-circle-fill.vue";
import RiSendPlane2Fill from "vue-remix-icons/icons/ri-send-plane-2-fill.vue";
import { useI18n } from "vue-i18n";
const input = ref<InstanceType<typeof TextField> | null>(null);
const props = defineProps({
  modelValue: String,
  editing: Boolean,
  id: String
});
defineEmits(["update:modelValue", "send"]);
defineExpose({ input });

const { t } = useI18n();

const cachedLinks = ref<string[]>([]);
const embeds = ref<EmbedDataV2[]>([]);

const links = throttle(handleLinks, 1000);

async function handleLinks(val: string) {
  // extract all the links in the input
  const links = new Set(val?.match(/(https?:\/\/[^\s]+)/g) || []);

  // compare the links to the cached links
  const newLinks = Array.from(links).filter(
    (link) => !cachedLinks.value.includes(link)
  );
  const deletedLinks = cachedLinks.value.filter((link) => !links.has(link));

  // if there are new links, add them to the cached links
  if (newLinks.length) {
    cachedLinks.value = [...cachedLinks.value, ...newLinks];

    for (const link of newLinks) {
      const {
        data: { embedResolutionPrecache }
      } = await useApolloClient().client.mutate({
        mutation: EmbedPrecacheMutation,
        variables: {
          input: {
            url: link
          }
        },
        fetchPolicy: "no-cache"
      });

      if (!embedResolutionPrecache) continue;

      embeds.value = [...embeds.value, embedResolutionPrecache];
    }
  }

  // if there are deleted links, remove them from the cached links and embeds
  if (deletedLinks.length) {
    cachedLinks.value = cachedLinks.value.filter(
      (link) => !deletedLinks.includes(link)
    );
    embeds.value = embeds.value.filter(
      (embed) => !deletedLinks.includes(embed.metadata.url!)
    );
  }
}
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}

.slide-up-leave,
.slide-up-enter-to {
  transform: translateY(0);
}
</style>
