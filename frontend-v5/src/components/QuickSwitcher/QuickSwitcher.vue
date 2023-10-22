<template>
  <tpu-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #dialog-outer>
      <div class="flex-col gap-4" style="max-width: 400px; width: 400px">
        <div class="bg-card-dark py-4 px-4 rounded-xl">
          <text-field
            v-model="content"
            label="QuickSwitcher"
            autofocus
            @keydown.down.stop="
              selected >= results.length - 1 ? (selected = 0) : selected++
            "
            @keydown.up.stop="
              selected <= 0 ? (selected = results.length - 1) : selected--
            "
            @keydown.enter.prevent.stop="navigate"
          />
        </div>
        <div v-for="(result, index) in results" :key="result.id" class="mt-2">
          <a @click.prevent :href="result.path" class="fill-white">
            <card
              class="flex gap-4 overflow-ellipsis whitespace-nowrap overflow-hidden"
              @click="$router.push(result.path)"
              :secondary="selected === index"
              @mouseover="selected = index"
            >
              <component :is="result.icon" style="width: 20px" />
              <div>
                <p class="text-medium-emphasis-dark">
                  <template v-if="result.subtitle">
                    {{ result.subtitle }}
                  </template>
                  <template v-else>
                    {{
                      appStore.navigation.railOptions.find(
                        (rail) => rail.id === parseInt(result.rail)
                      ).name
                    }}
                  </template>
                </p>
                <p>{{ result.name }}</p>
              </div>
            </card>
          </a>
        </div>
      </div>
    </template>
  </tpu-dialog>
</template>

<script setup lang="ts">
import TpuDialog from "@/components/Framework/Dialog/TpuDialog.vue";
import { RailMode, useAppStore } from "@/stores/app.store";
import TextField from "@/components/Framework/Input/TextField.vue";
import { computed, h, markRaw, ref, watch } from "vue";
import Card from "@/components/Framework/Card/Card.vue";
import RiArrowGoBack from "vue-remix-icons/icons/ri-arrow-go-back-line.vue";
import { useRoute, useRouter } from "vue-router";
import { useChatStore } from "@/stores/chat.store";
import UserAvatar from "@/components/User/UserAvatar.vue";
import { Chat } from "@/gql/graphql";
import functions from "@/plugins/functions";
import { useCollectionsStore } from "@/stores/collections.store";
import RiCollageLine from "vue-remix-icons/icons/ri-collage-line.vue";

const selected = ref(0);
const props = defineProps({
  modelValue: Boolean
});
const appStore = useAppStore();
const content = ref("");
const emit = defineEmits(["update:modelValue"]);
const lastRoute = ref("/");
const chatStore = useChatStore();
const collectionStore = useCollectionsStore();

const results = computed(() => {
  const searchString = content.value.toLowerCase();

  // Flatten the options from all RailModes with the rail property
  const allOptions = [
    ...(searchString.length
      ? []
      : [
          {
            icon: markRaw(RiArrowGoBack),
            name: "Go back",
            path: lastRoute.value,
            selectedIcon: markRaw(RiArrowGoBack),
            rail: -1,
            subtitle: lastRoute.value
          }
        ]),
    ...Object.entries(appStore.navigation.options).flatMap(
      ([rail, options]) => {
        return options.map((option) => ({ rail, ...option }));
      }
    ),
    ...chatStore.chats.map((chat) => {
      return {
        icon: h(UserAvatar, {
          username: chatStore.chatName(<Chat>chat),
          userId: chat?.recipient?.id,
          src: chat?.recipient ? undefined : functions.avatar(chat),
          class: "mr-4"
        }),
        name: chatStore.chatName(chat),
        path: `/communications/${chat.association?.id}`,
        rail: RailMode.CHAT
      };
    }),
    ...collectionStore.items.map((collection) => {
      return {
        icon: markRaw(RiCollageLine),
        name: collection.name,
        path: `/collections/${collection.id}`,
        rail: RailMode.GALLERY
      };
    })
  ];

  if (!searchString) {
    return allOptions.slice(0, 5);
  }

  return allOptions
    .filter((option) => option.name.toLowerCase().includes(searchString))
    .slice(0, 5);
});

const route = useRoute();

watch(
  () => route.path,
  (_, val) => {
    lastRoute.value = val;
  }
);

watch(
  () => props.modelValue,
  () => {
    content.value = "";
    selected.value = 0;
  }
);

watch(
  () => content.value,
  () => {
    selected.value = 0;
  }
);

const router = useRouter();
function navigate() {
  const nav = results.value[selected.value];
  if (!nav) return;
  router.push(nav.path);
  emit("update:modelValue", false);
  if (results.value[selected.value].rail !== -1)
    appStore.navigation.mode = parseInt(results.value[selected.value].rail);
}
</script>

<style scoped></style>
