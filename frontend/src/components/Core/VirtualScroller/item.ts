import { defineComponent, h, PropType, watch } from "vue";
import { ItemProps, SlotProps } from "./props";

const Wrapper = defineComponent({
  created() {
    this.shapeKey = this.horizontal ? "offsetWidth" : "offsetHeight";
  },

  mounted() {
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => {
        this.dispatchSizeChange();
      });
      this.resizeObserver.observe(this.$el);
    }
  },

  updated() {
    this.resizeObserver.observe(this.$el);
  },

  beforeUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  },

  methods: {
    getCurrentSize() {
      return this.$el ? this.$el[this.shapeKey] : 0;
    },

    // tell parent current size identify by unqiue key
    dispatchSizeChange() {
      this.$parent.$emit(
        this.event,
        this.uniqueKey,
        this.getCurrentSize(),
        this.hasInitial
      );
    }
  }
});

// wrapping for item
export const Item = defineComponent({
  mixins: [Wrapper],

  props: {
    ...ItemProps
  },
  watch: {
    uniqueKey: {
        immediate: true,
        handler() {
            this.dispatchSizeChange();
        }
    },
    hasInitial: {
        immediate: true,
        handler() {
            this.dispatchSizeChange();
        }
  },
  render() {
    const {
      tag,
      component,
      extraProps = {},
      index,
      source,
      scopedSlots = {},
      uniqueKey,
      slotComponent
    } = this.$props;
    const props = {
      ...extraProps,
      source,
      index
    };

    return h(
      tag,
      {
        key: uniqueKey,
        attrs: {
          role: "listitem"
        }
      },
      [
        slotComponent
          ? slotComponent({ item: source, index: index, scope: props })
          : h(component, { props, scopedSlots: scopedSlots })
      ]
    );
  }
});

// wrapping for slot
export const Slot = defineComponent({
  mixins: [Wrapper],

  props: {
    ...SlotProps
  },

  render() {
    const { tag, uniqueKey } = this.$props;

    return h(
      tag,
      {
        key: uniqueKey,
        attrs: {
          role: uniqueKey
        }
      },
      this.$slots.default?.()
    );
  }
});
