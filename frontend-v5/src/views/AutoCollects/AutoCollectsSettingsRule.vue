<template>
  <transition name="scroll-y-transition" appear>
    <card v-if="rule" padding class="my-4 mx-4 gap-4 flex-col flex">
      <text-field v-model="rule.name" :label="t('generic.name')" />
      <tpu-switch v-model="rule.enabled" :label="t('generic.enabled')" />
      <tpu-switch
        v-model="rule.requireApproval"
        :label="t('autoCollects.settings.requireApproval')"
      />
      <tpu-select
        v-model="rule.collectionId"
        :items="collectionsStore.items"
        :label="t('autoCollects.settings.collection')"
      />
      <tpu-overline position="start">
        {{ t("autoCollects.settings.ruleGroups") }}
      </tpu-overline>
      <div v-for="(parent, i) in rule.rules" :key="parent.id">
        <tpu-overline v-if="i !== 0" position="start">
          <div class="flex items-center gap-1">
            {{ $t("autoCollects.configure.or") }}
            <tpu-button
              icon
              variant="passive"
              style="width: 30px"
              @click="removeSubRule(rule, subrule.id)"
            >
              <RiAddLine style="width: 20px" />
            </tpu-button>
            <tpu-button
              icon
              variant="passive"
              style="width: 30px"
              @click="removeSubRule(rule, subrule.id)"
            >
              <RiCloseLine style="width: 20px" />
            </tpu-button>
          </div>
        </tpu-overline>
        <div
          v-for="child in parent.rules"
          :key="child.id"
          class="flex w-full flex-wrap gap-4 items-center"
        >
          <tpu-select
            v-model="child.type"
            :items="types"
            class="flex-1"
            :label="t('autoCollects.settings.rule')"
          />
          <tpu-select
            v-model="child.operator"
            class="flex-1"
            :items="operators"
            :label="t('autoCollects.settings.operator')"
          />
          <text-field
            v-model="child.value"
            class="flex-1"
            :label="t('autoCollects.settings.value')"
          />
          <tpu-button
            icon
            style="width: 40px; height: 40px"
            variant="passive"
            @click="removeRule(rule, parent.id)"
          >
            <RiCloseLine />
          </tpu-button>
        </div>
      </div>
    </card>
  </transition>
</template>

<script setup lang="ts">
import { useApolloClient } from "@vue/apollo-composable";
import { AutoCollectRuleQuery } from "@/graphql/autoCollects/getRules.graphql";
import { AutoCollectRule } from "@/gql/graphql";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { markRaw } from "vue";
import { RailMode, useAppStore } from "@/stores/app.store";
import RiSparkling2Line from "vue-remix-icons/icons/ri-sparkling-2-line.vue";
import RiSettings5Line from "vue-remix-icons/icons/ri-settings-5-line.vue";
import Card from "@/components/Framework/Card/Card.vue";
import TextField from "@/components/Framework/Input/TextField.vue";
import { useI18n } from "vue-i18n";
import TpuSwitch from "@/components/Framework/Input/TpuSwitch.vue";
import TpuOverline from "@/components/Framework/Typography/TpuOverline.vue";
import TpuSelect from "@/components/Framework/Input/TpuSelect.vue";
import { useCollectionsStore } from "@/stores/collections.store";
import TpuButton from "@/components/Framework/Button/TpuButton.vue";
import RiCloseLine from "vue-remix-icons/icons/ri-close-line.vue";
import RiAddLine from "vue-remix-icons/icons/ri-add-line.vue";

const rule = ref<AutoCollectRule | null>(null);
const route = useRoute();
const appStore = useAppStore();
const collectionsStore = useCollectionsStore();
const { t } = useI18n();

const operators = [
  { name: "Contains", id: "contains" },
  { name: "Equals", id: "equals" },
  { name: "Does not Equal", id: "doesNotEq" },
  { name: "Does not Contain", id: "doesNotCo" },
  { name: "Greater Than", id: "gt" },
  { name: "Less Than", id: "lt" },
  { name: "Greater Than or Equal", id: "gte" },
  { name: "Less Than or Equal", id: "lte" }
];

const types = [
  {
    name: "Screenshot Text Metadata (OCR)",
    id: "metadata",
    notRecommendedOperators: ["lt", "gt", "lte", "gte"]
  },
  {
    name: "File Name",
    id: "name",
    notRecommendedOperators: ["lt", "gt", "lte", "gte"]
  },
  {
    name: "File Extension",
    id: "extension",
    notRecommendedOperators: ["lt", "gt", "lte", "gte"]
  },
  {
    name: "File Size",
    id: "size",
    notRecommendedOperators: []
  },
  {
    name: "OCR Word Count",
    id: "metadata-word-length",
    notRecommendedOperators: ["contains", "doesNotCo"]
  },
  {
    name: "OCR Character Count",
    id: "metadata-char-length",
    notRecommendedOperators: ["contains", "doesNotCo"]
  }
];

async function getRule() {
  const {
    data: { autoCollectRule }
  } = await useApolloClient().client.query({
    query: AutoCollectRuleQuery,
    variables: {
      input: { id: parseInt(route.params.id) }
    }
  });
  rule.value = { ...autoCollectRule };

  appStore.currentNavItem = {
    item: {
      name: autoCollectRule.name,
      icon: markRaw(RiSparkling2Line),
      path: "/auto-collects/settings",
      selectedIcon: markRaw(RiSparkling2Line)
    },
    rail: [
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.GALLERY
      ),
      appStore.navigation.railOptions.find(
        (rail) => rail.id === RailMode.AUTO_COLLECTS
      ),
      {
        name: "Settings",
        icon: markRaw(RiSettings5Line),
        path: "/auto-collects/settings",
        selectedIcon: markRaw(RiSettings5Line)
      }
    ]
  };
}

onMounted(() => {
  getRule();
});
</script>

<style scoped></style>
