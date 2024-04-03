import { defineComponent, h } from 'vue';

export const Source = defineComponent({
  props: {
    srcset: {
      type: String,
    },
    sizes: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  setup({ srcset, sizes, type }) {
    return () =>
      h('source', {
        srcset,
        sizes,
        type,
      });
  },
});
