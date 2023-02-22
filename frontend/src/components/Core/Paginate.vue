<template>
  <div class="justify-center text-center">
    <v-chip
      variant="text"
      key="prev"
      size="large"
      :disabled="modelValue === 1"
      @click="$emit('update:modelValue', modelValue - 1)"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-chip>
    <template v-if="totalPages">
      <template v-if="!pages.includes(1)">
        <v-chip
          size="large"
          variant="text"
          :disabled="modelValue === 1"
          @click="$emit('update:modelValue', 1)"
        >
          1
        </v-chip>
        <v-text-field
          v-if="customLeft"
          v-model="customPage"
          key="custom"
          type="number"
          :min="1"
          :max="totalPages"
          autofocus
          style="width: 50px; position: relative; top: -0.69em"
          class="v-btn ml-3 mr-3"
          @keyup.enter="doCustomPage"
          @blur="doCustomPage"
        ></v-text-field>
        <v-chip
          size="large"
          variant="text"
          @click="customLeft = true"
          v-if="!customLeft"
        >
          ...
        </v-chip>
      </template>
      <v-chip
        size="large"
        variant="text"
        v-for="page in pages"
        :key="page"
        :disabled="page === modelValue"
        @click="$emit('update:modelValue', page)"
      >
        {{ page }}
      </v-chip>

      <template v-if="!pages.includes(totalPages)">
        <v-text-field
          v-if="customRight"
          v-model="customPage"
          key="custom"
          type="number"
          :min="1"
          :max="totalPages"
          autofocus
          style="width: 50px; position: relative; top: -0.69em"
          class="v-btn ml-3 mr-3"
          @keyup.enter="doCustomPage"
          @blur="doCustomPage"
        ></v-text-field>
        <v-chip
          size="large"
          variant="text"
          @click="customRight = true"
          v-if="!customRight"
        >
          ...
        </v-chip>
        <v-chip
          variant="text"
          :disabled="modelValue === totalPages"
          @click="$emit('update:modelValue', totalPages)"
        >
          {{ totalPages }}
        </v-chip>
      </template>
    </template>
    <v-chip
      variant="text"
      max-width="20"
      height="25"
      key="next"
      :disabled="modelValue === totalPages"
      @click="$emit('update:modelValue', modelValue + 1)"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-chip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Paginate",
  props: {
    modelValue: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: false,
      default: 1
    },
    maxVisible: {
      type: Number,
      default: 15
    }
  },
  data() {
    return {
      customLeft: false,
      customRight: false,
      customPage: undefined as string | undefined
    };
  },
  methods: {
    doCustomPage() {
      if (parseInt(this.customPage || "") > this.totalPages) {
        this.customPage = this.totalPages.toString();
      }
      this.$emit("update:modelValue", parseInt(this.customPage || ""));
      this.customLeft = false;
      this.customRight = false;
    }
  },
  computed: {
    maxVisibleResponsive() {
      if (this.$vuetify.display.xl) {
        return this.maxVisible;
      } else if (this.$vuetify.display.mobile) {
        if (
          !this.pages?.includes(1) &&
          !this.pages?.includes(this.totalPages)
        ) {
          return 1;
        }
        return 2;
      } else if (this.$vuetify.display.lg) {
        return Math.floor(this.maxVisible / 2);
      } else {
        return this.maxVisible;
      }
    },
    pages() {
      let startPage = Math.max(
        this.modelValue - Math.floor(this.maxVisibleResponsive / 2),
        1
      );
      let endPage = Math.min(
        startPage + this.maxVisibleResponsive - 1,
        this.totalPages
      );

      const visiblePagesCount = endPage - startPage + 1;
      if (visiblePagesCount < this.maxVisibleResponsive) {
        if (startPage === 1) {
          endPage = Math.min(this.totalPages, this.maxVisibleResponsive);
        } else {
          startPage = Math.max(1, endPage - this.maxVisibleResponsive + 1);
        }
      }

      const visiblePages = [];
      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }

      return visiblePages;
    }
  }
});
</script>
