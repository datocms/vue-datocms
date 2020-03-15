import PropTypes from "@znck/prop-types";

const absolutePositioning = {
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%"
};

const Image = {
  props: {
    data: PropTypes.shape({
      aspectRatio: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      base64: PropTypes.string,
      height: PropTypes.number,
      sizes: PropTypes.string,
      src: PropTypes.string,
      srcSet: PropTypes.string,
      webpSrcSet: PropTypes.string,
      bgColor: PropTypes.string,
      alt: PropTypes.string,
      title: PropTypes.string
    }).isRequired,
    pictureClassName: PropTypes.string,
    fadeInDuration: PropTypes.number,
    intersectionTreshold: PropTypes.number.defaultValue(0),
    intersectionMargin: PropTypes.string.defaultValue("0px 0px 0px 0px"),
    lazyLoad: PropTypes.bool.defaultValue(true),
    pictureStyle: PropTypes.object
  },
  inheritAttrs: false,
  data: () => ({
    observer: null,
    inView: false,
    loaded: false
  }),
  computed: {
    addImage() {
      if (!this.lazyLoad) {
        return true;
      }

      if (typeof window === "undefined") {
        return false;
      }

      if ("IntersectionObserver" in window) {
        return this.inView || this.loaded;
      }

      return true;
    },
    showImage() {
      if (!this.lazyLoad) {
        return true;
      }

      if (typeof window === "undefined") {
        return false;
      }

      if ("IntersectionObserver" in window) {
        return this.loaded;
      }

      return true;
    }
  },
  methods: {
    load() {
      if (this.$el.getAttribute("src") !== this.srcPlaceholder) {
        this.loaded = true;
      }
    }
  },
  render(h) {
    const {
      data,
      fadeInDuration,
      pictureClassName,
      pictureStyle,
      showImage,
      addImage
    } = this;

    const webpSource =
      data.webpSrcSet &&
      h("source", {
        attrs: {
          srcset: data.webpSrcSet,
          sizes: data.sizes,
          type: "image/webp"
        }
      });

    const regularSource =
      data.srcSet &&
      h("source", { attrs: { srcset: data.srcSet, sizes: data.sizes } });

    const placeholder = h("div", {
      style: {
        paddingTop:
          data.width && data.height
            ? `${(data.height / data.width) * 100.0}%`
            : `${100.0 / data.aspectRatio}%`,
        backgroundImage: data.base64 ? `url(${data.base64})` : null,
        backgroundColor: data.bgColor,
        backgroundSize: "cover"
      }
    });

    console.log('INVIEW', this.inView);

    return h(
      "div",
      {
        style: {
          display: "inline-block",
          maxWidth: "100%",
          width: `${data.width}px`,
          overflow: "hidden",
          position: "relative"
        }
      },
      [
        placeholder,
        addImage &&
          h(
            "picture",
            {
              class: pictureClassName,
              style: {
                ...pictureStyle,
                ...absolutePositioning,
                opacity: showImage ? 1 : 0,
                transition:
                  !fadeInDuration || fadeInDuration > 0
                    ? `opacity ${fadeInDuration || 500}ms`
                    : null
              }
            },
            [
              webpSource,
              regularSource,
              data.src &&
                h("img", {
                  style: { maxWidth: "100%" },
                  attrs: {
                    src: data.src,
                    alt: data.alt,
                    title: data.title
                  },
                  on: {
                    load: this.load
                  }
                })
            ]
          ),
        h("noscript", [
          h(
            "picture",
            {
              class: pictureClassName,
              style: { ...pictureStyle, ...absolutePositioning }
            },
            [
              webpSource,
              regularSource,
              data.src &&
                h("img", {
                  attrs: {
                    src: data.src,
                    alt: data.alt,
                    title: data.title
                  }
                })
            ]
          )
        ])
      ]
    );
  },
  mounted() {
    if ("IntersectionObserver" in window) {
      console.log('carico');
      this.observer = new IntersectionObserver(
        entries => {
          console.log('EMITTED!');
          const image = entries[0];
          if (image.isIntersecting) {
            console.log('INTERSE');
            this.inView = true;
            this.observer.disconnect();
          }
        },
        {
          threshold: this.intersectionTreshold,
          rootMargin: this.intersectionMargin
        }
      );
      this.observer.observe(this.$el);
    }
  },
  destroyed() {
    if ("IntersectionObserver" in window && this.observer) {
      this.observer.disconnect();
    }
  }
};

export default Image;

export const DatocmsImagePlugin = {
  install: Vue => {
    Vue.component("DatocmsImage", Image);
  }
};
