import { defineComponent, h, PropType, ref, watchEffect } from 'vue';
import { ResponsiveImageType } from '../Image';

import { buildRegularSource, buildWebpSource } from './utils';

export const NakedImage = defineComponent({
  name: 'DatocmsNakedImage',
  inheritAttrs: false,
  props: {
    /** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
    data: {
      type: Object as PropType<ResponsiveImageType>,
      required: true,
    },
    /** Whether the component should use a blurred image placeholder */
    usePlaceholder: {
      type: Boolean,
      default: true,
    },
    /**
     * The HTML5 `sizes` attribute for the image
     *
     * Learn more about srcset and sizes:
     * -> https://web.dev/learn/design/responsive-images/#sizes
     * -> https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-sizes
     **/
    sizes: {
      type: String,
    },
    /**
     * When true, the image will be considered high priority. Lazy loading is automatically disabled, and fetchpriority="high" is added to the image.
     * You should use the priority property on any image detected as the Largest Contentful Paint (LCP) element. It may be appropriate to have multiple priority images, as different images may be the LCP element for different viewport sizes.
     * Should only be used when the image is visible above the fold.
     **/
    priority: {
      type: Boolean,
      default: false,
    },
    /**
     * If `data` does not contain `srcSet`, the candidates for the `srcset` of the image will be auto-generated based on these width multipliers
     *
     * Default candidate multipliers are [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4]
     **/
    srcSetCandidates: {
      type: Array,
      validator: (values: unknown[]): values is number[] =>
        values.every((value): value is number => {
          return typeof value === 'number';
        }),
      default: () => [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4],
    },
    /** Additional CSS class for the root `<picture />` tag */
    pictureClass: {
      type: String,
    },
    /** Additional CSS rules to add to the root `<picture />` tag */
    pictureStyle: {
      type: Object,
      default: () => ({}),
    },
    /** Additional CSS class for the `<img />` tag */
    imgClass: {
      type: String,
    },
    /** Additional CSS rules to add to the `<img />` tag */
    imgStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(_props, { emit, expose }) {
    const loaded = ref(false);

    function handleLoad() {
      emit('load');
      loaded.value = true;
    }

    const imageRef = ref<HTMLImageElement>();

    // See: https://stackoverflow.com/q/39777833/266535
    watchEffect(() => {
      if (!imageRef.value) {
        return;
      }

      if (imageRef.value.complete && imageRef.value.naturalWidth) {
        handleLoad();
      }
    });

    expose({
      imageRef,
    });

    return {
      loaded,
      handleLoad,
      imageRef,
    };
  },
  render() {
    const webpSource = buildWebpSource(this.data, this.sizes);
    const regularSource = buildRegularSource(
      this.data,
      this.sizes,
      this.srcSetCandidates,
    );

    const { width } = this.data;

    const height =
      this.data.height ??
      Math.round(this.data.aspectRatio ? width / this.data.aspectRatio : 0);

    const sizingStyle = {
      aspectRatio: `${width} / ${height}`,
      width: '100%',
      maxWidth: `${width}px`,
      height: 'auto',
    };

    const placeholderStyle =
      this.usePlaceholder && !this.loaded && this.data.base64
        ? {
            backgroundImage: `url("${this.data.base64}")`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50% 50%',
            color: 'transparent',
          }
        : this.usePlaceholder && !this.loaded && this.data.bgColor
          ? {
              backgroundColor: this.data.bgColor,
              color: 'transparent',
            }
          : undefined;

    return h(
      'picture',
      {
        style: this.pictureStyle,
        class: this.pictureClass,
      },
      [
        webpSource,
        regularSource,
        this.data.src &&
          h('img', {
            ref: 'imageRef',
            src: this.data.src,
            alt: this.data.alt,
            onLoad: this.handleLoad,
            title: this.data.title,
            fetchpriority: this.priority ? 'high' : undefined,
            loading: this.priority ? undefined : 'lazy',
            style: {
              ...placeholderStyle,
              ...sizingStyle,
              ...(this.imgStyle || {}),
            },
            class: this.imgClass,
          }),
      ],
    );
  },
});

export const DatocmsNakedImagePlugin = {
  install: (Vue: any) => {
    Vue.component('DatocmsNakedImage', Image);
  },
};
