import { defineComponent, h } from 'vue';
import { universalBtoa } from '../utils';

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
  },
  setup({ sizerClass, sizerStyle, width, height }) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

    return () =>
      h('img', {
        class: sizerClass,
        style: {
          display: 'block',
          width: '100%',
          ...sizerStyle,
        },
        src: `data:image/svg+xml;base64,${universalBtoa(svg)}`,
        'aria-hidden': 'true',
      });
  },
});
