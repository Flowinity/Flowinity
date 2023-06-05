import { defineComponent, ref, watch, onMounted, onActivated, onDeactivated, beforeUnmount } from 'vue';
import Virtual from './virtual';
import { Item, Slot } from './item';
import { VirtualProps } from './props';

const EVENT_TYPE = {
  ITEM: 'item_resize',
  SLOT: 'slot_resize'
};
const SLOT_TYPE = {
  HEADER: 'thead',
  FOOTER: 'tfoot'
};

export default defineComponent({
  name: 'VirtualList',
  props: VirtualProps,

  setup(props) {
    const range = ref(null);
    const isHorizontal = props.direction === 'horizontal';
    const directionKey = isHorizontal ? 'scrollLeft' : 'scrollTop';
    let virtual = null;

    const installVirtual = () => {
      virtual = new Virtual({
        slotHeaderSize: 0,
        slotFooterSize: 0,
        keeps: props.keeps,
        estimateSize: props.estimateSize,
        buffer: Math.round(props.keeps / 3),
        uniqueIds: getUniqueIdFromDataSources()
      }, onRangeChanged);

      range.value = virtual.getRange();
    };

    const getUniqueIdFromDataSources = () => {
      const { dataKey, dataSources } = props;
      return dataSources.map(dataSource =>
        typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]
      );
    };

    const onItemResized = (id, size) => {
      virtual.saveSize(id, size);
      emit('resized', id, size);
    };

    const onSlotResized = (type, size, hasInit) => {
      if (type === SLOT_TYPE.HEADER) {
        virtual.updateParam('slotHeaderSize', size);
      } else if (type === SLOT_TYPE.FOOTER) {
        virtual.updateParam('slotFooterSize', size);
      }

      if (hasInit) {
        virtual.handleSlotSizeChange();
      }
    };

    const onRangeChanged = (range) => {
      range.value = range;
    };

    const onScroll = (evt) => {
      const offset = getOffset();
      const clientSize = getClientSize();
      const scrollSize = getScrollSize();

      if (offset < 0 || (offset + clientSize > scrollSize + 1) || !scrollSize) {
        return;
      }

      virtual.handleScroll(offset);
      emitEvent(offset, clientSize, scrollSize, evt);
    };

    const emitEvent = (offset, clientSize, scrollSize, evt) => {
      emit('scroll', evt, virtual.getRange());

      if (virtual.isFront() && !!props.dataSources.length && (offset - props.topThreshold <= 0)) {
        emit('totop');
      } else if (virtual.isBehind() && (offset + clientSize + props.bottomThreshold >= scrollSize)) {
        emit('tobottom');
      }
    };

    const scrollToOffset = (offset) => {
      if (props.pageMode) {
        document.body[directionKey] = offset;
        document.documentElement[directionKey] = offset;
      } else {
        const root = $refs.root;
        if (root) {
          root[directionKey] = offset;
        }
      }
    };

    const scrollToIndex = (index) => {
      if (index >= props.dataSources.length - 1) {
        scrollToBottom();
      } else {
        const offset = virtual.getOffset(index);
        scrollToOffset(offset);
      }
    };

    const scrollToBottom = () => {
      const shepherd = $refs.shepherd;
      if (shepherd) {
        const offset = shepherd.scrollHeight - shepherd.clientHeight;
        scrollToOffset(offset);
      };
  
      const getItemStyle = (index) => {
        const style = virtual.getOffsetStyle(index);
        if (isHorizontal) {
          style.display = 'inline-block';
        }
        return style;
      };
  
      const handleResize = () => {
        virtual.updateParam('containerSize', getClientSize());
        virtual.handleResize();
      };
  
      onMounted(() => {
        installVirtual();
        handleResize();
        virtual.handleScroll(getOffset());
        addResizeListener();
        emit('mounted');
      });
  
      onActivated(() => {
        handleResize();
        virtual.handleScroll(getOffset());
        emit('activated');
      });
  
      onDeactivated(() => {
        emit('deactivated');
      });
  
      beforeUnmount(() => {
        removeResizeListener();
        emit('beforeUnmount');
      });
  
      watch(
        () => props.dataSources,
        () => {
          installVirtual();
          handleResize();
          virtual.handleScroll(getOffset());
          emit('dataSourcesChange');
        }
      );
  
      const addResizeListener = () => {
        window.addEventListener('resize', handleResize);
      };
  
      const removeResizeListener = () => {
        window.removeEventListener('resize', handleResize);
      };
  
      const getOffset = () => {
        const root = $refs.root;
        if (root) {
          return isHorizontal ? root.scrollLeft : root.scrollTop;
        }
        return 0;
      };
  
      const getClientSize = () => {
        const root = $refs.root;
        if (root) {
          return isHorizontal ? root.clientWidth : root.clientHeight;
        }
        return 0;
      };
  
      const getScrollSize = () => {
        const root = $refs.root;
        if (root) {
          return isHorizontal ? root.scrollWidth : root.scrollHeight;
        }
        return 0;
      };
  
      return {
        range,
        onItemResized,
        onSlotResized,
        onScroll,
        getItemStyle,
        scrollToIndex,
        scrollToBottom,
        addResizeListener,
        removeResizeListener,
        getOffset,
        getClientSize,
        getScrollSize
      };
    },
  
    render() {
      const {
        dataSources,
        dataKey,
        keeps,
        estimateSize,
        direction,
        pageMode,
        rootTag,
        wrapTag,
        wrapClass,
        itemTag,
        itemClass,
        itemClassAdd,
        headerTag,
        headerClass,
        footerTag,
        footerClass,
        beforeRender,
        renderAhead,
        disabled,
        itemScopedSlots
      } = this;
  
      const scrollerProps = {
        ref: 'root',
        class: 'vue-virtual-scroller__scroll',
        onScroll: this.onScroll
      };
  
      const containerProps = {
        class: 'vue-virtual-scroller__container',
        style: {
          [direction === 'vertical' ? 'width' : 'height']: estimateSize * dataSources.length + 'px'
        }
      };
  
      const headerSlotProps = {
        class: headerClass,
        ref: 'header'
      };
  
      const footerSlotProps = {
        class: footerClass,
        ref: 'footer'
      };
  
      const wrapProps = {
        class: wrapClass,
        ref: 'shepherd'
      };
  
      return;
    }
  }
})