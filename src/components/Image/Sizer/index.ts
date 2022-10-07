import { defineComponent, h, isVue2, isVue3 } from 'vue-demi'
import { isSsr } from '../../../utils';

const universalBtoa = (str: string): string =>
  isSsr()
    ? Buffer.from(str.toString(), 'binary').toString('base64')
    : window.btoa(str);

export const Sizer = defineComponent({
  props: {
    sizerClass: {
      type: String,
    },
    sizerStyle: {
      type: Object,
      default: () => ({}),
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    explicitWidth: {
      type: Boolean,
    },    
  },
  setup({ sizerClass, sizerStyle, width, height, explicitWidth }) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

    return () => h('img', {
      class: sizerClass,
      style: {
        display: 'block',
        width: explicitWidth ? `${width}px` : '100%',
        ...sizerStyle,
      },
      ...(isVue2 && {
        attrs: {
          src: `data:image/svg+xml;base64,${universalBtoa(svg)}`,
          role: 'presentation',  
        }
      }),
      ...(isVue3 && {
        src: `data:image/svg+xml;base64,${universalBtoa(svg)}`,
        role: 'presentation',
      }),
    })
  }
})
