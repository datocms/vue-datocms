import {
  defineComponent,
  ref,
  onMounted,
  PropType,
  onBeforeUnmount,
  h,
} from "vue-demi";

export type ResponsiveImageType = {
  /** The aspect ratio (width/height) of the image */
  aspectRatio: number;
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

const isSsr = typeof window === "undefined";

const isIntersectionObserverAvailable = isSsr
  ? false
  : !!(window as any).IntersectionObserver;

const universalBtoa = isSsr
  ? (str: string) => Buffer.from(str.toString(), "binary").toString("base64")
  : window.btoa;

const absolutePositioning = {
  position: "absolute",
  left: "0px",
  top: "0px",
  width: "100%",
  height: "100%",
};

const useInView = ({ threshold, rootMargin }: IntersectionObserverInit) => {
  const observer = ref<IntersectionObserver | null>(null);
  const elRef = ref<HTMLElement | null>(null);
  const inView = ref(false);

  onMounted(() => {
    if (isIntersectionObserverAvailable) {
      observer.value = new IntersectionObserver(
        (entries) => {
          const image = entries[0];
          if (image.isIntersecting && observer.value) {
            inView.value = true;
            observer.value.disconnect();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );
      if (elRef.value) {
        observer.value.observe(elRef.value);
      }
    }
  });

  onBeforeUnmount(() => {
    if (isIntersectionObserverAvailable && observer.value) {
      observer.value.disconnect();
    }
  });

  return { inView, elRef };
};

type State = {
  lazyLoad?: boolean;
  inView: boolean;
  loaded: boolean;
};

const imageAddStrategy = ({ lazyLoad, inView, loaded }: State) => {
  if (!lazyLoad) {
    return true;
  }

  if (isSsr) {
    return false;
  }

  if (isIntersectionObserverAvailable) {
    return inView || loaded;
  }

  return true;
};

const imageShowStrategy = ({ lazyLoad, loaded }: State) => {
  if (!lazyLoad) {
    return true;
  }

  if (isSsr) {
    return false;
  }

  if (isIntersectionObserverAvailable) {
    return loaded;
  }

  return true;
};

export const Image = defineComponent({
  name: "DatocmsImage",
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
      default: "0px 0px 0px 0px",
    },
    /** Wheter enable lazy loading or not */
    lazyLoad: {
      type: Boolean,
      default: true,
    },
    /** Additional CSS rules to add to the image inside the `<picture />` tag */
    pictureStyle: {
      type: Object,
      default: {},
    },
    /** Wheter the image wrapper should explicitely declare the width of the image or keep it fluid */
    explicitWidth: {
      type: Boolean,
    },
  },
  setup(props) {
    const loaded = ref(false);

    function handleLoad() {
      loaded.value = true;
    }

    const { inView, elRef } = useInView({
      threshold: props.intersectionThreshold || props.intersectionTreshold || 0,
      rootMargin: props.intersectionMargin || "0px 0px 0px 0px",
    });

    return () => {
      const addImage = imageAddStrategy({
        lazyLoad: props.lazyLoad,
        inView: inView.value,
        loaded: loaded.value,
      });

      const showImage = imageShowStrategy({
        lazyLoad: props.lazyLoad,
        inView: inView.value,
        loaded: loaded.value,
      });

      const webpSource =
        props.data.webpSrcSet &&
        h("source", {
          srcset: props.data.webpSrcSet,
          sizes: props.data.sizes,
          type: "image/webp",
        });

      const regularSource =
        props.data.srcSet &&
        h("source", {
          srcset: props.data.srcSet,
          sizes: props.data.sizes,
        });

      const transition =
        typeof props.fadeInDuration === "undefined" || props.fadeInDuration > 0
          ? `opacity ${props.fadeInDuration || 500}ms ${
              props.fadeInDuration || 500
            }ms`
          : undefined;

      const placeholder = h("div", {
        style: {
          backgroundImage: props.data.base64
            ? `url(${props.data.base64})`
            : null,
          backgroundColor: props.data.bgColor,
          backgroundSize: "cover",
          opacity: showImage ? 0 : 1,
          transition: transition,
          ...absolutePositioning,
        },
      });

      const { width, aspectRatio } = props.data;

      const height = props.data.height || width / aspectRatio;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

      const sizer = h("img", {
        class: props.pictureClass,
        style: {
          display: "block",
          width: props.explicitWidth ? `${width}px` : "100%",
          ...props.pictureStyle,
        },
        src: `data:image/svg+xml;base64,${universalBtoa(svg)}`,
        role: "presentation",
      });

      return h(
        "div",
        {
          style: {
            display: props.explicitWidth ? "inline-block" : "block",
            overflow: "hidden",
            position: "relative",
          },
          ref: elRef,
        },
        [
          sizer,
          placeholder,
          addImage &&
            h("picture", null, [
              webpSource,
              regularSource,
              props.data.src &&
                h("img", {
                  src: props.data.src,
                  alt: props.data.alt,
                  title: props.data.title,
                  onLoad: handleLoad,
                  class: props.pictureClass,
                  style: {
                    ...absolutePositioning,
                    ...props.pictureStyle,
                    opacity: showImage ? 1 : 0,
                    transition,
                  },
                }),
            ]),
          h("noscript", null, [
            h("picture", null, [
              webpSource,
              regularSource,
              props.data.src &&
                h("img", {
                  src: props.data.src,
                  alt: props.data.alt,
                  title: props.data.title,
                  class: props.pictureClass,
                  style: {
                    ...props.pictureStyle,
                    ...absolutePositioning,
                  },
                  loading: "lazy",
                }),
            ]),
          ]),
        ]
      );
    };
  },
});

export const DatocmsImagePlugin = {
  install: (Vue: any) => {
    Vue.component("DatocmsImage", Image);
  },
};
