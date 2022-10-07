import { defineComponent, h, isVue2, isVue3 } from 'vue-demi'

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
    return () => h('source', {
      ...(isVue2 && {
        attrs: {
          srcset,
          sizes,
          type,
        }
      }),
      ...(isVue3 && {
        srcset,
        sizes,
        type,  
      }),
    })
  }
})
