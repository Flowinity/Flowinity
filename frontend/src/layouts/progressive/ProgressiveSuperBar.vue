<template>
  <v-navigation-drawer
    v-model="$app.mainDrawer"
    rail
    class="superbar sticky z-50 items-center pb-2 space-x-1 flex flex-col overflow-y-auto overflow-x-hidden flowinity-border border-r-2"
    style="
      scrollbar-width: none;
      min-width: 72px;
      max-width: 72px;
      width: 72px;
      border-right-width: 1px;
      border-right-style: solid;
    "
    :class="{ 'sidebar-patch': !$vuetify.display.mobile }"
    color="dark"
    elevation="0"
  >
    <div class="justify-between superbar flex flex-col h-full">
      <div class="items-start">
        <div class="flex flex-col gap-y-4">
          <div
            class="flex cursor-pointer select-none justify-between pt-0 border-b-2 flowinity-border relative"
            style="min-height: 64px; max-height: 64px"
          >
            <component
              :is="
                $experiments.experiments.DISABLE_ANIMATIONS
                  ? FlowinityLogo
                  : FlowinityLogoAnimated
              "
              src="@/"
              :animate="
                $app.componentLoading ||
                $app.loading ||
                !$app.connected ||
                clicked
              "
              alt="Flowinity Logo"
              class="cursor-pointer"
              draggable="false"
              style="width: 40px"
              :color="$app.fluidGradient ? 'background' : 'dark'"
              :fill="
                !$app.connected && $experiments.experiments.DISABLE_ANIMATIONS
                  ? '#F44336'
                  : undefined
              "
              @click="
                $router.push('/');
                uiStore.navigationMode = RailMode.HOME;
                clicked = true;
              "
            />
            <v-tooltip activator="parent" location="right">
              <template v-if="!$app.connected">Reconnecting...</template>
              <template v-else-if="$app.componentLoading || $app.loading">
                Loading...
              </template>
              <template v-else>Flowinity</template>
            </v-tooltip>
          </div>

          <super-bar-item
            class="mt-n1"
            :highlighted="true"
            @click="$app.dialogs.quickSwitcher = true"
          >
            <v-tooltip activator="parent" location="right">
              {{ $t("generic.search") }}
            </v-tooltip>
            <RiSearchLine />
          </super-bar-item>
          <super-bar-item :highlighted="true">
            <v-tooltip activator="parent" location="right">
              {{ $t("core.sidebar.notifications") }}
            </v-tooltip>
            <Notifications location="right" />
            <RiNotificationLine v-if="!userStore.unreadNotifications" />
            <RiNotificationFill v-else />
          </super-bar-item>
          <super-bar-item
            v-if="$experiments.experiments.WEATHER && !$app.weather.loading"
            class="unselectable"
            :highlighted="true"
          >
            <v-tooltip activator="parent" location="right">
              <div class="flex flex-col">
                <p>{{ appStore.weather.data?.main }}</p>
                <small>
                  Feels like:
                  {{ $app.convertTemp(appStore.weather.data?.feels_like) }}°{{
                    userStore.user?.weatherUnit.charAt(0).toUpperCase()
                  }}
                </small>
                <small>Humidity: {{ appStore.weather.data?.humidity }}%</small>
                <small>
                  Wind Speed: {{ appStore.weather.data?.wind_speed }} m/s
                </small>
                <small>
                  Wind Direction: {{ appStore.weather.data?.wind_deg }}°
                </small>
                <small>
                  Pressure: {{ appStore.weather.data?.pressure }} hPa
                </small>
                <small>Location: {{ appStore.weather.data?.location }}</small>
              </div>
            </v-tooltip>
            <template #badge>
              <div
                class="absolute z-20 -top-2 right-0 text-center flex justify-center bg-outline-dark rounded-full p-1"
                style="font-size: 9px"
              >
                {{ $app.weatherTemp
                }}{{
                  $user.user?.weatherUnit.charAt(0).toUpperCase() === "K"
                    ? ""
                    : "°"
                }}{{ $user.user?.weatherUnit.charAt(0).toUpperCase() }}
              </div>
            </template>
            <v-img
              :src="`https://openweathermap.org/img/wn/${$app.weather.data?.icon}@2x.png`"
              height="32"
              width="32"
            />
          </super-bar-item>
        </div>
        <div class="border-b-2 mt-3 w-full flowinity-border" />
        <div class="flex flex-col gap-y-2 mt-3">
          <super-bar-item-template
            v-for="item in uiStore.navigation.railOptions.filter(
              (opt) =>
                !opt.misc &&
                !opt.fake &&
                (opt.experimentsRequired
                  ? $experiments.experiments[opt.experimentsRequired]
                  : true)
            )"
            :key="item.id"
            :item="item"
          />
        </div>
        <template v-if="experimentsStore.experiments.COMMS_SUPERBAR">
          <div
            class="divide-outline-dark border flowinity-border mt-3 w-full"
          />
          <div class="flex flex-col gap-y-2 mt-3">
            <super-bar-item
              v-for="item in chatStore.chats.slice(0, 3)"
              :key="item.id"
              @click="$router.push(`/communications/${item.association.id}`)"
              :badge="item.unread"
            >
              <v-tooltip activator="parent" location="right">
                {{ $chat.chatName(item) }}
              </v-tooltip>
              <user-avatar
                :chat="item.recipient ? null : item"
                :user="item.recipient ? $user.users[item.recipient.id] : null"
                :status="true"
                :dot-status="true"
              />
            </super-bar-item>
          </div>
        </template>
      </div>
      <div class="items-center"></div>
      <div class="items-end">
        <div class="flex flex-col gap-y-2">
          <super-bar-item-template
            v-for="item in uiStore.navigation.railOptions.filter(
              (opt) => opt.misc
            )"
            :key="item.id"
            :item="item"
            :highlighted="true"
          />
          <super-bar-item
            highlighted
            @click="
              $experiments.setExperiment('PROGRESSIVE_UI', 0);
              $app.dialogs.feedback = true;
            "
          >
            <v-tooltip activator="parent" location="right">
              Restore Old Layout
            </v-tooltip>
            <RiLogoutCircleLine />
          </super-bar-item>
          <super-bar-item highlighted @click="$app.dialogs.feedback = true">
            <v-tooltip activator="parent" location="right">
              Provide Feedback
            </v-tooltip>
            <RiFeedbackLine />
          </super-bar-item>
          <v-menu location="end">
            <template #activator="{ props }">
              <super-bar-item v-bind="props" class="mb-2">
                <v-tooltip activator="parent" location="right">
                  {{ $user.user.username }}
                </v-tooltip>
                <user-avatar
                  :user="$user.user"
                  :status="true"
                  :dot-status="true"
                />
              </super-bar-item>
            </template>
            <status-switcher-list>
              <v-divider />
              <v-list-item :to="`/u/${$user.user.username}`">
                <template #prepend>
                  <RiUserLine class="mr-2" style="width: 36px" />
                </template>
                My Profile
              </v-list-item>
              <v-list-item
                style="color: rgb(var(--v-theme-error))"
                @click="$user.logout"
              >
                <template #prepend>
                  <RiLogoutBoxLine class="mr-2" style="width: 36px" />
                </template>
                Logout
              </v-list-item>
            </status-switcher-list>
          </v-menu>
        </div>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app.store";
import { useProgressiveUIStore, RailMode } from "@/store/progressive.store";
import { useUserStore } from "@/store/user.store";
import { useChatStore } from "@/store/chat.store";
import { useRoute } from "vue-router";
import functions from "@/plugins/functions";
import { useExperimentsStore } from "@/store/experiments.store";
import { onMounted, ref, watch } from "vue";
import SuperBarItem from "@/layouts/progressive/SuperBarItem.vue";
import {
  RiFeedbackLine,
  RiLogoutCircleLine,
  RiNotificationFill,
  RiNotificationLine,
  RiSearchLine,
  RiUserLine,
  RiLogoutBoxLine
} from "@remixicon/vue";
import UserAvatar from "@/components/Users/UserAvatar.vue";
import FlowinityLogo from "@/components/Brand/FlowinityLogo.vue";
import StatusSwitcherList from "@/components/Communications/StatusSwitcherList.vue";
import FlowinityLogoAnimated from "@/components/Brand/FlowinityLogoAnimated.vue";
import Notifications from "@/components/Core/Notifications.vue";
import SuperBarItemTemplate from "@/layouts/progressive/SuperBarItemTemplate.vue";

const appStore = useAppStore();
const uiStore = useProgressiveUIStore();
const props = defineProps({
  drawer: Boolean
});
const userStore = useUserStore();
const chatStore = useChatStore();
const experimentsStore = useExperimentsStore();
const route = useRoute();

// Animating the logo when clicked
const clicked = ref(false);
const clickedTimeout = ref<undefined | ReturnType<typeof setTimeout>>(
  undefined
);

watch(
  () => clicked.value,
  (value) => {
    if (value) {
      if (clickedTimeout.value) clearTimeout(clickedTimeout.value);
      clickedTimeout.value = setTimeout(() => {
        clicked.value = false;
      }, 100);
    }
  }
);
</script>
<style>
.superbar {
  scrollbar-width: none;
}
.superbar::-webkit-scrollbar {
  display: none;
}

.superbar .v-navigation-drawer__content,
.superbar {
  overflow-x: hidden !important;
  overflow-y: inherit !important;
}
</style>
