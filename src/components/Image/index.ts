import { defineComponent, h, ref, watchEffect, type PropType } from 'vue';

import {
  absolutePositioning,
  isIntersectionObserverAvailable,
  isSsr,
  tag,
  toCss,
} from './utils';

import { useInView } from '../../composables/useInView';

import {
  buildRegularSource,
  buildSrcSet,
  buildWebpSource,
} from '../NakedImage/utils';
import { Sizer } from './Sizer';

export type ResponsiveImageType = {
  /** The aspect ratio (width/height) of the image */
  aspectRatio?: number;
  /** A base64-encoded thumbnail to offer during image loading */
  base64?: string;
  /** The height of the image */
  height?: number;
  /** The width of the image */
  width: number;
  /** The HTML5 `sizes` attribute for the image */
  sizes?: string;
  /** The fallback `src` attribute for the image */
  src?: string;
  /** The HTML5 `srcSet` attribute for the image */
  srcSet?: string;
  /** The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format */
  webpSrcSet?: string;
  /** The background color for the image placeholder */
  bgColor?: string;
  /** Alternate text (`alt`) for the image */
  alt?: string;
  /** Title attribute (`title`) for the image */
  title?: string;
};

type State = {
  priority?: boolean;
  inView: boolean;
  loaded: boolean;
};

const imageAddStrategy = ({ priority, inView, loaded }: State) => {
  if (priority) {
    return true;
  }

  if (isSsr()) {
    return false;
  }

  if (isIntersectionObserverAvailable()) {
    return inView || loaded;
  }

  return true;
};

const imageShowStrategy = ({ priority, loaded }: State) => {
  if (priority) {
    return true;
  }

  if (isSsr()) {
    return false;
  }

  if (isIntersectionObserverAvailable()) {
    return loaded;
  }

  return true;
};

export const Image = defineComponent({
  name: 'DatocmsImage',
  inheritAttrs: false,
  emits: ['load'],
  props: {
    /** The actual response you get from a DatoCMS `responsiveImage` GraphQL query */
    data: {
      type: Object as PropType<ResponsiveImageType>,
      required: true,
    },
    /** Additional CSS class for the image inside the `<picture />` tag */
    pictureClass: {
      type: String,
    },
    /** Additional CSS class for the placeholder image */
    placeholderClass: {
      type: String,
    },
    /** Duration (in ms) of the fade-in transition effect upoad image loading */
    fadeInDuration: {
      type: Number,
    },
    /** @deprecated Use the intersectionThreshold prop */
    intersectionTreshold: {
      type: Number,
      default: 0,
    },
    /** Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible */
    intersectionThreshold: {
      type: Number,
    },
    /** Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections */
    intersectionMargin: {
      type: String,
      default: '0px 0px 0px 0px',
    },
    /** Additional CSS rules to add to the image inside the `<picture />` tag */
    pictureStyle: {
      type: Object,
      default: () => ({}),
    },
    /** Additional CSS rules to add to the placeholder image */
    placeholderStyle: {
      type: Object,
      default: () => ({}),
    },
    /**
     * The layout behavior of the image as the viewport changes size
     *
     * Possible values:
     *
     * * `intrinsic`: the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports
     * * `fixed`: the image dimensions will not change as the viewport changes (no responsiveness) similar to the native img element
     * * `responsive` (default): the image will scale the dimensions down for smaller viewports and scale up for larger viewports
     * * `fill`: image will stretch both width and height to the dimensions of the parent element, provided the parent element is `relative`
     **/
    layout: {
      type: String,
      default: () => 'intrinsic',
      validator: (value: string) =>
        ['intrinsic', 'fixed', 'responsive', 'fill'].includes(value),
    },
    /** Defines how the image will fit into its parent container when using layout="fill" */
    objectFit: {
      type: String,
    },
    /** Defines how the image is positioned within its parent element when using layout="fill". */
    objectPosition: {
      type: String,
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
      validator: (values: any[]): values is number[] =>
        values.every((value): value is number => {
          return typeof value === 'number';
        }),
      default: () => [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4],
    },
  },
  setup(props, { emit, expose }) {
    const loaded = ref(false);

    function handleLoad() {
      emit('load');
      loaded.value = true;
    }

    const { inView, elRef: rootRef } = useInView({
      threshold: props.intersectionThreshold || props.intersectionTreshold || 0,
      rootMargin: props.intersectionMargin || '0px 0px 0px 0px',
    });

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
      rootRef,
      imageRef,
    });

    return {
      inView,
      rootRef,
      loaded,
      handleLoad,
      imageRef,
    };
  },
  render() {
    const addImage = imageAddStrategy({
      priority: this.priority,
      inView: this.inView,
      loaded: this.loaded,
    });

    const showImage = imageShowStrategy({
      priority: this.priority,
      inView: this.inView,
      loaded: this.loaded,
    });

    const webpSource = buildWebpSource(this.data, this.sizes);
    const regularSource = buildRegularSource(
      this.data,
      this.sizes,
      this.srcSetCandidates,
    );

    const transition =
      typeof this.fadeInDuration === 'undefined' || this.fadeInDuration > 0
        ? `opacity ${this.fadeInDuration || 500}ms`
        : undefined;

    const basePlaceholderStyle = {
      transition: transition,
      opacity: showImage ? 0 : 1,
      // During the opacity transition of the placeholder to the definitive version,
      // hardware acceleration is triggered. This results in the browser trying to render the
      // placeholder with your GPU, causing blurred edges. Solution: style the placeholder
      // so the edges overflow the container
      position: 'absolute',
      left: '-5%',
      top: '-5%',
      width: '110%',
      height: 'auto',
      maxWidth: 'none',
      maxHeight: 'none',
      ...this.placeholderStyle,
    };

    const placeholder =
      this.usePlaceholder && this.data.base64
        ? h('img', {
            'aria-hidden': 'true',
            src: this.data.base64,
            class: this.placeholderClass,
            style: {
              objectFit: this.objectFit,
              objectPosition: this.objectPosition,
              ...basePlaceholderStyle,
            },
          })
        : this.usePlaceholder && this.data.bgColor
          ? h('div', {
              class: this.placeholderClass,
              style: {
                backgroundColor: this.data.bgColor,
                ...basePlaceholderStyle,
              },
            })
          : null;

    const { width, aspectRatio } = this.data;
    const height = this.data.height ?? (aspectRatio ? width / aspectRatio : 0);

    const sizer =
      this.layout !== 'fill'
        ? h(Sizer, {
            sizerClass: this.pictureClass,
            sizerStyle: this.pictureStyle,
            width,
            height,
          })
        : null;

    return h(
      'div',
      {
        class: this.$attrs.class,
        style: {
          overflow: 'hidden',
          ...(this.layout === 'fill'
            ? absolutePositioning
            : this.layout === 'intrinsic'
              ? { position: 'relative', width: '100%', maxWidth: `${width}px` }
              : this.layout === 'fixed'
                ? { position: 'relative', width: `${width}px` }
                : { position: 'relative', width: '100%' }),
          ...(this.$attrs.style || {}),
        },
        ref: 'rootRef',
      },
      [
        sizer,
        placeholder,
        addImage &&
          h('picture', null, [
            webpSource,
            regularSource,
            this.data.src &&
              h('img', {
                src: this.data.src,
                alt: this.data.alt,
                title: this.data.title,
                fetchpriority: this.priority ? 'high' : undefined,
                onLoad: this.handleLoad,
                ref: 'imageRef',
                class: this.pictureClass,
                style: {
                  opacity: showImage ? 1 : 0,
                  transition,
                  ...absolutePositioning,
                  objectFit: this.objectFit,
                  objectPosition: this.objectPosition,
                  ...this.pictureStyle,
                },
              }),
          ]),
        h('noscript', {
          innerHTML: tag('picture', {}, [
            this.data.webpSrcSet &&
              tag('source', {
                srcset: this.data.webpSrcSet,
                sizes: this.sizes ?? this.data.sizes ?? undefined,
                type: 'image/webp',
              }),

            tag('source', {
              srcset:
                this.data.srcSet ??
                buildSrcSet(
                  this.data.src,
                  this.data.width,
                  this.srcSetCandidates as number[],
                ),
              sizes: this.sizes ?? this.data.sizes ?? undefined,
            }),
            tag('img', {
              src: this.data.src,
              alt: this.data.alt,
              title: this.data.title,
              class: this.pictureClass,
              style: toCss({
                ...absolutePositioning,
                objectFit: this.objectFit,
                objectPosition: this.objectPosition,
                ...this.pictureStyle,
              }),
              loading: this.priority ? undefined : 'lazy',
              fetchpriority: this.priority ? 'high' : undefined,
            }),
          ]),
        }),
      ],
    );
  },
});

export const DatocmsImagePlugin = {
  install: (Vue: any) => {
    Vue.component('DatocmsImage', Image);
  },
};
