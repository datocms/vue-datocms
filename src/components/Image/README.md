## Progressive/responsive image

`<datocms-image>` is a Vue component specially designed to work seamlessly with DatoCMS’s [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) that optimizes image loading for your sites.

### Table of contents

- [Out-of-the-box features](#out-of-the-box-features)
- [Setup](#setup)
- [Usage](#usage)
- [Example](#example)
- [Props](#props)
  - [Layout mode](#layout-mode)
  - [The `ResponsiveImage` object](#the-responsiveimage-object)

### Out-of-the-box features

- Offers optimized version of images for browsers that support WebP/AVIF format
- Generates multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Efficiently lazy loads images to speed initial page load and save bandwidth
- Holds the image position so your page doesn’t jump while images load
- Uses either blur-up or background color techniques to show a preview of the image while it loads

## Intersection Observer

Intersection Observer is the API used to determine if the image is inside the viewport or not. [Browser support is really good](https://caniuse.com/intersectionobserver) - With Safari adding support in 12.1, all major browsers now support Intersection Observers natively.

If the IntersectionObserver object is not available, the component treats the image as it's always visible in the viewport. Feel free to add a [polyfill](https://www.npmjs.com/package/intersection-observer) so that it will also 100% work on older versions of iOS and IE11.

### Setup

You can register the component globally so it's available in all your apps:

```js
import Vue from 'vue';
import { DatocmsImagePlugin } from 'vue-datocms';

Vue.use(DatocmsImagePlugin);
```

Or use it locally in any of your components:

```js
import { Image } from 'vue-datocms';

export default {
  components: {
    'datocms-image': Image,
  },
};
```

### Usage

1. Use `<datocms-image>` it in place of the regular `<img />` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/content-delivery-api/images-and-videos#responsive-images)

The GraphQL query returns multiple thumbnails with optimized compression. The `<datocms-image>` component automatically sets up the "blur-up" effect as well as lazy loading of images further down the screen.

### Example

For a fully working example take a look at our [examples directory](https://github.com/datocms/vue-datocms/tree/master/examples).

```vue
<template>
  <article>
    <div v-if="data">
      <h1>{{ data.blogPost.title }}</h1>
      <datocms-image :data="data.blogPost.cover.responsiveImage" />
    </div>
  </article>
</template>

<script>
import { request } from './lib/datocms';
import { Image } from 'vue-datocms';

const query = gql`
  query {
    blogPost {
      title
      cover {
        responsiveImage(
          imgixParams: { fit: crop, w: 300, h: 300, auto: format }
        ) {
          # always required
          src
          width
          height
          # not required, but strongly suggested!
          alt
          title
          # blur-up placeholder, JPEG format, base64-encoded, or...
          base64
          # background color placeholder
          bgColor
          # you can omit `sizes` if you explicitly pass the `sizes` prop to the image component
          sizes
        }
      }
    }
  }
`;

export default {
  components: {
    'datocms-image': Image,
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    this.data = await request({ query });
  },
};
</script>
```

### Props

| prop                  | type                                             | default           | required           | description                                                                                                                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------ | ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                  | `ResponsiveImage` object                         |                   | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query.                                                                                                                                                                                                                   |
| class                 | string                                           | null              | :x:                | Additional CSS class of root node                                                                                                                                                                                                                                                             |
| style                 | CSS properties                                   | null              | :x:                | Additional CSS rules to add to the root node                                                                                                                                                                                                                                                  |
| picture-class         | string                                           | null              | :x:                | Additional CSS class for the inner `<picture />` tag                                                                                                                                                                                                                                          |
| picture-style         | CSS properties                                   | null              | :x:                | Additional CSS rules to add to the inner `<picture />` tag                                                                                                                                                                                                                                    |
| layout                | 'intrinsic' \| 'fixed' \| 'responsive' \| 'fill' | "responsive"      | :x:                | The layout behavior of the image as the viewport changes size                                                                                                                                                                                                                                 |
| fade-in-duration      | integer                                          | 500               | :x:                | Duration (in ms) of the fade-in transition effect upoad image loading                                                                                                                                                                                                                         |
| intersection-threshold | float                                            | 0                 | :x:                | Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. |
| intersection-margin   | string                                           | "0px 0px 0px 0px" | :x:                | Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections.                  |
| lazy-load             | Boolean                                          | true              | :x:                | Wheter enable lazy loading or not                                                                                                                                                                                                                                                             |
| explicit-width        | Boolean                                          | false             | :x:                | Wheter the image wrapper should explicitely declare the width of the image or keep it fluid                                                                                                                                                                                                   |
| object-fit            | String                                           | null              | :x:                | Defines how the image will fit into its parent container when using layout="fill"                                                                                                                                                                                                             |
| object-position       | String                                           | null              | :x:                | Defines how the image is positioned within its parent element when using layout="fill".                                                                                                                                                                                                       |
| priority              | Boolean                                          | false             | :x:                | Disables lazy loading, and sets the image [fetchPriority](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/fetchPriority) to "high"                                                                                                                         |
| src-set-candidates    | Array<number>                                    | [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] | :x:                | If `data` does not contain `srcSet`, the candidates for the `srcset` attribute of the image will be auto-generated based on these width multipliers                                                                                                                          |
| sizes                 | string                                           | undefined         | :x:                | The HTML5 [`sizes`](https://web.dev/learn/design/responsive-images/#sizes) attribute for the image (will be used `data.sizes` as a fallback)                                                                                                                                 |
| on-load               | () => void                                       | undefined         | :x:                | Function triggered when the image has finished loading                                                                                                                                                                                                                       |
| use-placeholder       | Boolean                                          | true              | :x:                | Whether the component should use a blurred image placeholder                                                                                                                                                                                                                 |

#### Layout mode

With the `layout` property, you can configure the behavior of the image as the viewport changes size:

- When `intrinsic`, the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports.
- When `fixed`, the image dimensions will not change as the viewport changes (no responsiveness) similar to the native `img` element.
- When `responsive` (default behaviour), the image will scale the dimensions down for smaller viewports and scale up for larger viewports.
- When `fill`, the image will stretch both width and height to the dimensions of the parent element, provided the parent element is relative.
  - This is usually paired with the `objectFit` and `objectPosition` properties.
  - Ensure the parent element has `position: relative` in their stylesheet.

#### The `ResponsiveImage` object

The `data` prop expects an object with the same shape as the one returned by `responsiveImage` GraphQL call. It's up to you to make a GraphQL query that will return the properties you need for a specific use of the `<datocms-image>` component.

- The minimum required properties for `data` are: `src`, `width` and `height`;
- `alt` and `title`, while not mandatory, are all highly suggested, so remember to use them!
- If you don't request `srcSet`, the component will auto-generate an `srcset` based on `src` + the `srcSetCandidates` prop (it can help reducing the GraphQL response size drammatically when many images are returned);
- We strongly to suggest to always specify [`{ auto: format }`](https://docs.imgix.com/apis/rendering/auto/auto#format) in your `imgixParams`, instead of requesting `webpSrcSet`, so that you can also take advantage of more performant optimizations (AVIF), without increasing GraphQL response size;
- If you request both the `bgColor` and `base64` property, the latter will take precedence, so just avoid querying both fields at the same time, as it will only make the GraphQL response bigger :wink:;
- You can avoid requesting `sizes` and directly pass a `sizes` prop to the component to reduce the GraphQL response size;
Here's a complete recap of what `responsiveImage` offers:

| property    | type    | required           | description                                                                                     |
| ----------- | ------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| src         | string  | :white_check_mark: | The `src` attribute for the image                                                               |
| width       | integer | :white_check_mark: | The width of the image                                                                          |
| height      | integer | :white_check_mark: | The height of the image                                                                         |
| alt         | string  | :x:                | Alternate text (`alt`) for the image (not required, but strongly suggested!)                    |
| title       | string  | :x:                | Title attribute (`title`) for the image (not required, but strongly suggested!)                 |
| sizes       | string  | :x:                | The HTML5 `sizes` attribute for the image (omit it if you're already passing a `sizes` prop to the Image component) |
| base64      | string  | :x:                | A base64-encoded thumbnail to offer during image loading                                        |
| bgColor     | string  | :x:                | The background color for the image placeholder (omit it if you're already requesting `base64`)  |
| srcSet      | string  | :x:                | The HTML5 `srcSet` attribute for the image (can be omitted, the Image component knows how to build it based on `src`) |
| webpSrcSet  | string  | :x:                | The HTML5 `srcSet` attribute for the image in WebP format (deprecated, it's better to use the [`auto=format`](https://docs.imgix.com/apis/rendering/auto/auto#format) Imgix transform instead) |
| aspectRatio | float   | :x:                | The aspect ratio (width/height) of the image                                                    |
