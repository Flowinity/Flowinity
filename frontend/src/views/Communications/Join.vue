<template>
  <div class="invite d-flex justify-center align-center">
    <v-card min-width="500" class="text-center">
      <p class="text-gradient mb-n3" style="font-size: 48px">PrivateUploader</p>
      <v-card-title>Join Test on Communications!</v-card-title>
      <v-card-subtitle>sup</v-card-subtitle>
      <v-card-actions>
        <v-btn to="/" :active="false">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue">Join</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatJoin"
});
</script>

<style scoped lang="scss">
$bg-color: #000000;
$dot-color: rgba(230, 230, 230, 0.3);
$dot-size: 1px;
$dot-space: 22px;

.invite {
  height: calc(100vh - 56px - 40px);
  width: 100%;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
        90deg,
        $bg-color ($dot-space - $dot-size),
        transparent 1%
      )
      center,
    linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
    $dot-color;
  background-size: $dot-space $dot-space;
}
</style>
