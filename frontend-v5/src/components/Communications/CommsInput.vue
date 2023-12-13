<template>
  <card>
    {{ embeds }}
  </card>
  <text-field
    ref="input"
    :model-value="modelValue"
    placeholder="Keep it civil..."
    label="Send a message"
    :textarea="true"
    :max-lines="7"
    :shift-enter-new-line="true"
    @update:model-value="
      $emit('update:modelValue', $event);
      links($event);
    "
  />
</template>

<script setup lang="ts">
import TextField from "@/components/Framework/Input/TextField.vue";
import { ref, watch } from "vue";
import Card from "@/components/Framework/Card/Card.vue";
import { EmbedDataV2 } from "@/gql/graphql";
import { useApolloClient } from "@vue/apollo-composable";
import { EmbedPrecacheMutation } from "@/graphql/chats/embedPrecache.graphql";
import { throttle } from "lodash";

const input = ref<InstanceType<typeof TextField> | null>(null);
const props = defineProps({
  modelValue: String
});
defineEmits(["update:modelValue"]);
defineExpose({ input });

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
