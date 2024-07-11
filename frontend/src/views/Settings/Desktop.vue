<template>
  <v-card-title class="">
    {{ $t("settings.desktop.settings") }}
  </v-card-title>
  <div class="mx-4">
    <v-text-field
      v-model="settings.instance"
      :label="$t('settings.desktop.instance')"
    />
    <v-btn class="mt-n4 mb-4" color="red" @click="changeInstance">
      {{ $t("settings.desktop.instanceChange") }}
    </v-btn>

    <tpu-switch
      v-model="settings.startup"
      :label="$t('settings.desktop.startup')"
      @update:model-value="updateSettings"
    />
    <tpu-switch
      v-model="settings.startMinimized"
      :label="$t('settings.desktop.startMinimized')"
      @update:model-value="updateSettings"
    />
    <tpu-switch
      v-model="settings.minimizeToTray"
      :label="$t('settings.desktop.minimizeToTray')"
      @update:model-value="updateSettings"
    />
    <tpu-switch
      v-model="settings.desktopNotifications"
      :label="$t('settings.desktop.desktopNotifications')"
      @update:model-value="updateSettings"
    />
    <tpu-switch
      :model-value="
        $app.platform === Platform.LINUX ? false : settings.autoUpdate
      "
      :label="$t('settings.desktop.autoUpdate')"
      :disabled="$app.platform === Platform.LINUX"
      @update:model-value="
        settings.autoUpdate = $event;
        updateSettings();
      "
    />
    <small v-if="$app.platform === Platform.LINUX" class="text-grey">
      {{ $t("settings.desktop.linuxUpdater") }}
    </small>
    <tpu-switch
      v-model="settings.windowBorder"
      :label="$t('settings.desktop.windowBorder')"
      @update:model-value="updateSettings"
    />
    <small class="text-grey">
      {{ $t("settings.desktop.windowBorderDesc") }}
    </small>
    <br />
    <v-btn
      color="green"
      variant="tonal"
      class="mt-4"
      v-if="settings.restartRequired"
      @click="restart"
    >
      {{ $t("settings.desktop.restartRequired") }}
    </v-btn>
  </div>
  <v-card-title class="mt-4">
    {{ $t("settings.desktop.flowshot.title") }}
  </v-card-title>
  <v-btn
    class="mx-4"
    @click="flowshotLaunch"
    :disabled="!flowshotVersion || flowshotVersion === 'Not installed'"
  >
    {{ $t("settings.desktop.flowshot.launchConfig") }}
  </v-btn>

  {{ flowshotVersion || "Not installed" }}
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { IpcChannels } from "@/electron-types/ipc";
import { Platform } from "@/store/app.store";

const settings = ref({
  startup: false,
  minimizeToTray: false,
  desktopNotifications: false,
  autoUpdate: false,
  windowBorder: false,
  restartRequired: false,
  init: false,
  startMinimized: false,
  instance: ""
});

const flowshotVersion = ref("");

function flowshotLaunch() {
  window.electron.ipcRenderer.send(IpcChannels.FLOWSHOT_CONFIGURATOR);
}

onMounted(() => {
  window.electron.ipcRenderer.send(IpcChannels.GET_SETTINGS);
  window.electron.ipcRenderer.on(IpcChannels.GET_SETTINGS, (event, data) => {
    settings.value = data;
  });

  window.electron.ipcRenderer.send(IpcChannels.FLOWSHOT_VERSION);
  window.electron.ipcRenderer.on(
    IpcChannels.FLOWSHOT_VERSION,
    (event, data) => {
      flowshotVersion.value = data;
    }
  );
});

function updateSettings() {
  window.electron.ipcRenderer.send(
    IpcChannels.SET_SETTINGS,
    JSON.stringify(settings.value)
  );
}

function restart() {
  window.electron.ipcRenderer.send(IpcChannels.RESTART);
}

function changeInstance() {
  window.electron.ipcRenderer.send(
    IpcChannels.CHANGE_INSTANCE,
    settings.value.instance
  );
}
</script>

<style scoped></style>
