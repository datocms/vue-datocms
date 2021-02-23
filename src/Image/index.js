import PropTypes from "@znck/prop-types";
import hypenateStyleName from "hyphenate-style-name";

const isSsr = typeof window === "undefined";

const universalBtoa = isSsr
  ? (str) => Buffer.from(str.toString(), "binary").toString("base64")
  : window.btoa;

const absolutePositioning = {
  position: "absolute",
  left: "0px",
  top: "0px",
  width: "100%",
  height: "100%",
};

const escape = (s) => {
  s = "" + s; /* Coerce to string */
  s = s.replace(/&/g, "&amp;");
  s = s.replace(/</g, "&lt;");
  s = s.replace(/>/g, "&gt;");
  s = s.replace(/"/g, "&quot;");
  s = s.replace(/'/g, "&#39;");
  return s;
};

const toCss = (object) => {
  if (!object) {
    return null;
  }

  let result = "";

  for (var styleName in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, styleName) &&
      object[styleName]
    ) {
      result += `${hypenateStyleName(styleName)}: ${object[styleName]}; `;
    }
  }

  return result.length > 0 ? result : null;
};

const tag = (tagName, attrs, content) => {
  const serializedAttrs = [];

  if (attrs) {
    for (var attrName in attrs) {
      if (
        Object.prototype.hasOwnProperty.call(attrs, attrName) &&
        attrs[attrName]
      ) {
        serializedAttrs.push(
          `${escape(attrName)}="${escape(attrs[attrName])}"`,
        );
      }
    }
  }

  const attrsString =
    serializedAttrs.length > 0 ? ` ${serializedAttrs.join(" ")}` : "";

  return content
    ? `<${tagName}${attrsString}>${content.join("")}</${tagName}>`
    : `<${tagName}${attrsString} />`;
};

// @vue/component
export const Image = {
  inheritAttrs: false,
  props: {
    data: PropTypes.shape({
      aspectRatio: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      base64: PropTypes.string,
      height: PropTypes.number,
      sizes: PropTypes.string,
      src: PropTypes.string.isRequired,
      srcSet: PropTypes.string,
      webpSrcSet: PropTypes.string,
      bgColor: PropTypes.string,
      alt: PropTypes.string,
      title: PropTypes.string,
    }).isRequired,
    pictureClass: PropTypes.string,
    fadeInDuration: PropTypes.number.defaultValue(500),
    intersectionTreshold: PropTypes.number.defaultValue(0),
    intersectionMargin: PropTypes.string.defaultValue("0px 0px 0px 0px"),
    lazyLoad: PropTypes.bool.defaultValue(true),
    pictureStyle: PropTypes.object.defaultValue(() => ({})),
    rootStyle: PropTypes.object.defaultValue(() => ({})),
    explicitWidth: PropTypes.bool.defaultValue(false),
    media: PropTypes.string,
  },
  data: () => ({
    observer: null,
    inView: false,
    loaded: false,
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
    },
  },
  mounted() {
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          const image = entries[0];
          if (image.isIntersecting) {
            this.inView = true;
            this.observer.disconnect();
          }
        },
        {
          threshold: this.intersectionTreshold,
          rootMargin: this.intersectionMargin,
        },
      );
      this.observer.observe(this.$el);
    }
  },
  destroyed() {
    if ("IntersectionObserver" in window && this.observer) {
      this.observer.disconnect();
    }
  },
  methods: {
    load() {
      if (this.$el.getAttribute("src") !== this.srcPlaceholder) {
        this.loaded = true;
      }
    },
  },
  render() {
    const {
      data,
      fadeInDuration,
      pictureClass,
      pictureStyle,
      showImage,
      addImage,
      rootStyle,
      explicitWidth,
      media
    } = this;

    const { width, aspectRatio } = data;
    const height = data.height || width / aspectRatio;
    const transition = fadeInDuration
      ? `opacity ${fadeInDuration}ms ${fadeInDuration}ms`
      : null;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"></svg>`;

    return (
      <div
        style={{
          display: explicitWidth ? "inline-block" : "block",
          overflow: "hidden",
          ...rootStyle,
          position: "relative",
        }}
      >
        <img
          class={pictureClass}
          style={{
            display: "block",
            width: explicitWidth ? `${width}px` : "100%",
            ...pictureStyle,
          }}
          src={`data:image/svg+xml;base64,${universalBtoa(svg)}`}
          role="presentation"
        />
        <div
          style={{
            backgroundImage: data.base64 ? `url(${data.base64})` : null,
            backgroundColor: data.bgColor,
            backgroundSize: "cover",
            opacity: showImage ? 0 : 1,
            transition,
            ...absolutePositioning,
          }}
        />
        {addImage && (
          <picture>
            {data.webpSrcSet && (
              <source
                srcset={data.webpSrcSet}
                sizes={data.sizes}
                media={media}
                type="image/webp"
              />
            )}
            {data.srcSet && <source srcset={data.srcSet} sizes={data.sizes} media={media} />}
            <img
              src={data.src}
              alt={data.alt}
              title={data.title}
              v-on:load={this.load}
              class={pictureClass}
              style={{
                ...absolutePositioning,
                ...pictureStyle,
                opacity: showImage ? 1 : 0,
                transition,
              }}
            />
          </picture>
        )}
        <noscript
          domPropsInnerHTML={tag("picture", {}, [
            data.webpSrcSet &&
              tag("source", {
                srcset: data.webpSrcSet,
                sizes: data.sizes,
                media,
                type: "image/webp",
              }),
            data.srcSet &&
              tag("source", { srcset: data.srcSet, sizes: data.sizes, media }),
            tag("img", {
              src: data.src,
              alt: data.alt,
              title: data.title,
              class: pictureClass,
              style: toCss({ ...pictureStyle, ...absolutePositioning }),
              loading: "lazy",
            }),
          ])}
        />
      </div>
    );
  },
};

export const DatocmsImagePlugin = {
  install: (Vue) => {
    Vue.component("DatocmsImage", Image);
  },
};
