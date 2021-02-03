# vue-datocms

![MIT](https://img.shields.io/npm/l/vue-datocms?style=for-the-badge) ![MIT](https://img.shields.io/npm/v/vue-datocms?style=for-the-badge) [![Build Status](https://img.shields.io/travis/datocms/vue-datocms?style=for-the-badge)](https://travis-ci.org/datocms/vue-datocms)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in Vue.js environments. Integrates seamlessy with [DatoCMS's GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api).

- Compatible with any data-fetching library (axios, Apollo);
- Usable both client and server side;
- Compatible with vanilla Vue, Nuxt.js and pretty much any other Vue-based solution;

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Demos](#demos)
- [Installation](#installation)
- [Live real-time updates](#live-real-time-updates)
- [Progressive/responsive image](#progressiveresponsive-image)
  - [Out-of-the-box features](#out-of-the-box-features)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Example](#example)
  - [Props](#props)
    - [The `ResponsiveImage` object](#the-responsiveimage-object)
- [Social share, SEO and Favicon meta tags](#social-share-seo-and-favicon-meta-tags)
  - [Usage](#usage-1)
  - [Example](#example-1)
- [Structured text](#structured-text)
  - [Setup](#setup-1)
  - [Basic usage](#basic-usage)
  - [Custom renderers](#custom-renderers)
  - [Props](#props-1)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Demos

- Pure Vue: [https://vue-datocms-example.netlify.com/](https://vue-datocms-example.netlify.com/)
- Server side rendering with Nuxt.js: [https://vue-datocms-components.now.sh](https://vue-datocms-components.now.sh)

## Installation

```
npm install vue-datocms
```

## Live real-time updates

Thanks to the `subscribeToQuery` helper provided by the [datocms-listen](https://www.npmjs.com/package/datocms-listen) package you can get real-time updates for the page when the content changes. This helper connects to the DatoCMS's [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api/api-reference) to receive the updated query results in real-time, and is able to reconnect in case of network failures.

Live updates are great both to get instant previews of your content while editing it inside DatoCMS, or to offer real-time updates of content to your visitors (ie. news site).

### Reference

`subscribeToQuery` provides a way to create a subscription to DatoCMS's [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api/api-reference).

Please consult the [datocms-listen package documentation](https://www.npmjs.com/package/datocms-listen) to learn more about how to configure `subscribeToQuery`.

In Vue.js v2, the subscription can be created inside of the [`mounted`](https://vuejs.org/v2/api/#mounted) lifecycle method. Please refer to the [query-subscription example](./examples/query-subscription/src/App.vue#L47) for a sample implementation.

In Vue.js v3, `subscribeToQuery` can be used to implement a custom hook. Please take a look at the [React.js one](https://github.com/datocms/react-datocms/blob/master/src/useQuerySubscription/index.ts) for a sample implementation.

## Progressive/responsive image

`<datocms-image>` is a Vue component specially designed to work seamlessly with DatoCMS’s [`responsiveImage` GraphQL query](https://www.datocms.com/docs/content-delivery-api/uploads#responsive-images) that optimizes image loading for your sites.

![](docs/image-component.gif?raw=true)

### Out-of-the-box features

- Offer WebP version of images for browsers that support the format
- Generate multiple smaller images so smartphones and tablets don’t download desktop-sized images
- Efficiently lazy load images to speed initial page load and save bandwidth
- Use either blur-up or background color techniques to show a preview of the image while it loads
- Hold the image position so your page doesn’t jump while images load

### Setup

You can register the component globally so it's available in all your apps:

```js
import Vue from "vue";
import { DatocmsImagePlugin } from "vue-datocms";

Vue.use(DatocmsImagePlugin);
```

Or use it locally in any of your components:

```js
import { Image } from "vue-datocms";

export default {
  components: {
    "datocms-image": Image,
  },
};
```

### Usage

1. Use `<datocms-image>` it in place of the regular `<img />` tag
2. Write a GraphQL query to your DatoCMS project using the [`responsiveImage` query](https://www.datocms.com/docs/qualcosa)

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
import { request } from "./lib/datocms";
import { Image } from "vue-datocms";

const query = gql`
  query {
    blogPost {
      title
      cover {
        responsiveImage(
          imgixParams: { fit: crop, w: 300, h: 300, auto: format }
        ) {
          # HTML5 src/srcset/sizes attributes
          srcSet
          webpSrcSet
          sizes
          src

          # size information (post-transformations)
          width
          height
          aspectRatio

          # SEO attributes
          alt
          title

          # background color placeholder or...
          bgColor

          # blur-up placeholder, JPEG format, base64-encoded
          base64
        }
      }
    }
  }
`;

export default {
  components: {
    "datocms-image": Image,
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

| prop                  | type                     | default           | required           | description                                                                                                                                                                                                                                                                                   |
| --------------------- | ------------------------ | ----------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data                  | `ResponsiveImage` object |                   | :white_check_mark: | The actual response you get from a DatoCMS `responsiveImage` GraphQL query.                                                                                                                                                                                                                   |
| class                 | string                   | null              | :x:                | Additional CSS class of root node                                                                                                                                                                                                                                                             |
| root-style            | CSS properties           | null              | :x:                | Additional CSS rules to add to the root node                                                                                                                                                                                                                                                  |
| picture-class         | string                   | null              | :x:                | Additional CSS class for the inner `<picture />` tag                                                                                                                                                                                                                                          |
| picture-style         | CSS properties           | null              | :x:                | Additional CSS rules to add to the inner `<picture />` tag                                                                                                                                                                                                                                    |
| fade-in-duration      | integer                  | 500               | :x:                | Duration (in ms) of the fade-in transition effect upoad image loading                                                                                                                                                                                                                         |
| intersection-treshold | float                    | 0                 | :x:                | Indicate at what percentage of the placeholder visibility the loading of the image should be triggered. A value of 0 means that as soon as even one pixel is visible, the callback will be run. A value of 1.0 means that the threshold isn't considered passed until every pixel is visible. |
| intersection-tmargin  | string                   | "0px 0px 0px 0px" | :x:                | Margin around the placeholder. Can have values similar to the CSS margin property (top, right, bottom, left). The values can be percentages. This set of values serves to grow or shrink each side of the placeholder element's bounding box before computing intersections.                  |
| lazy-load             | Boolean                  | true              | :x:                | Wheter enable lazy loading or not                                                                                                                                                                                                                                                             |
| explicitWidth         | Boolean                  | false             | :x:                | Wheter the image wrapper should explicitely declare the width of the image or keep it fluid                                                                                                                                                                                                   |

#### The `ResponsiveImage` object

The `data` prop expects an object with the same shape as the one returned by `responsiveImage` GraphQL call. It's up to you to make a GraphQL query that will return the properties you need for a specific use of the `<datocms-image>` component.

- The minimum required properties for `data` are: `aspectRatio`, `width`, `sizes`, `srcSet` and `src`;
- `alt` and `title`, while not mandatory, are all highly suggested, so remember to use them!
- You either want to add the `webpSrcSet` field or specify `{ auto: format }` in your `imgixParams`, to automatically use WebP images in browsers that support the format;
- If you provide both the `bgColor` and `base64` property, the latter will take precedence, so just avoiding querying both fields at the same time, it will only make the response bigger :wink:

Here's a complete recap of what `responsiveImage` offers:

| property    | type    | required           | description                                                                                     |
| ----------- | ------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| aspectRatio | float   | :white_check_mark: | The aspect ratio (width/height) of the image                                                    |
| width       | integer | :white_check_mark: | The width of the image                                                                          |
| sizes       | string  | :white_check_mark: | The HTML5 `sizes` attribute for the image                                                       |
| srcSet      | string  | :white_check_mark: | The HTML5 `srcSet` attribute for the image                                                      |
| src         | string  | :white_check_mark: | The fallback `src` attribute for the image                                                      |
| webpSrcSet  | string  | :x:                | The HTML5 `srcSet` attribute for the image in WebP format, for browsers that support the format |
| alt         | string  | :x:                | Alternate text (`alt`) for the image                                                            |
| title       | string  | :x:                | Title attribute (`title`) for the image                                                         |
| bgColor     | string  | :x:                | The background color for the image placeholder                                                  |
| base64      | string  | :x:                | A base64-encoded thumbnail to offer during image loading                                        |

## Social share, SEO and Favicon meta tags

Just like the image component, `toHead()` is a helper specially designed to work seamlessly with DatoCMS’s [`_seoMetaTags` and `faviconMetaTags` GraphQL queries](https://www.datocms.com/docs/content-delivery-api/seo) so that you can handle proper SEO in your pages.

You can use `toHead()` inside the `metaInfo` (or `head`, in Nuxt.js) property of your components, and it will return meta tags as required by the [`vue-meta`](https://vue-meta.nuxtjs.org/guide/metainfo.html) package.

### Usage

`toHead()` takes an array of `Tag`s in the exact form they're returned by the following [DatoCMS GraphQL API](https://www.datocms.com/docs/content-delivery-api/seo) queries:

- `_seoMetaTags` query on any record, or
- `faviconMetaTags` on the global `_site` object.

You can pass multiple arrays of `Tag`s together and pass them to a single `toHead()` call.

### Example

For a working example take a look at our [examples directory](https://github.com/datocms/vue-datocms/tree/master/examples).

```vue
<template>
  <article>
    <h1 v-if="data">{{ data.page.title }}</h1>
  </article>
</template>

<script>
import { request } from "./lib/datocms";
import { toHead } from "vue-datocms";

const query = gql`
  query {
    page: homepage {
      title
      seo: _seoMetaTags {
        attributes
        content
        tag
      }
    }

    site: _site {
      favicon: faviconMetaTags {
        attributes
        content
        tag
      }
    }
  }
`;

export default {
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    this.data = await request({ query });
  },
  metaInfo() {
    if (!this || !this.data) {
      return;
    }
    return toHead(this.data.page.seo, this.data.site.favicon);
  },
};
</script>
```

# Structured text

`<datocms-structured-text />` is a Vue component that you can use to render the value contained inside a DatoCMS [Structured Text field type](#).

### Setup

You can register the component globally so it's available in all your apps:

```js
import Vue from "vue";
import { DatocmsStructuredTextPlugin } from "vue-datocms";

Vue.use(DatocmsStructuredTextPlugin);
```

Or use it locally in any of your components:

```js
import { StructuredText } from "vue-datocms";

export default {
  components: {
    "datocms-structured-text": StructuredText,
  },
};
```

## Basic usage

```vue
<template>
  <article>
    <div v-if="data">
      <h1>{{ data.blogPost.title }}</h1>
      <datocms-structured-text :data="{data.blogPost.content}" />
      <!--
        Final result:
        <h1>Hello <strong>world!</strong></h1>
      -->
    </div>
  </article>
</template>

<script>
import { request } from "./lib/datocms";
import { StructuredText } from "vue-datocms";

const query = gql`
  query {
    blogPost {
      title
      content {
        value
      }
    }
  }
`;

export default {
  components: {
    "datocms-structured-text": StructuredText,
  },
  data() {
    return {
      data: null,
    };
  },
  async mounted() {
    this.data = await request({ query });
    // data.blogPost.content ->
    // {
    //   value: {
    //     schema: "dast",
    //     document: {
    //       type: "root",
    //       children: [
    //         {
    //           type: "heading",
    //           level: 1,
    //           children: [
    //             {
    //               type: "span",
    //               value: "Hello ",
    //             },
    //             {
    //               type: "span",
    //               marks: ["strong"],
    //               value: "world!",
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   },
    // }
  },
};
</script>
```

## Custom renderers

You can also pass custom renderers for special nodes (inline records, record links and blocks) as an optional parameter like so:

```vue
<template>
  <article>
    <div v-if="data">
      <h1>{{ data.blogPost.title }}</h1>
      <datocms-structured-text
        :data="data.blogPost.content"
        :renderInlineRecord="renderInlineRecord"
        :renderLinkToRecord="renderLinkToRecord"
        :renderBlock="renderBlock"
      />
      <!--
        Final result:

        <h1>Welcome onboard <a href="/team/mark-smith">Mark</a></h1>
        <p>
          So happy to have
          <a href="/team/mark-smith">this awesome humang being</a> in our team!
        </p>
        <img
          src="https://www.datocms-assets.com/205/1597757278-austin-distel-wd1lrb9oeeo-unsplash.jpg"
          alt="Our team at work"
        />
      -->
    </div>
  </article>
</template>

<script>
import { request } from "./lib/datocms";
import { StructuredText } from "vue-datocms";

const query = gql`
  query {
    blogPost {
      title
      content {
        value
      }
    }
  }
`;

export default {
  components: {
    "datocms-structured-text": StructuredText,
  },
  data() {
    return {
      data: null,
    };
  },
  methods: {
    renderInlineRecord: ({ record, key, h }) => {
      switch (record.__typename) {
        case "TeamMemberRecord":
          return h(
            "a",
            { key, attrs: { href: `/team/${record.slug}` } },
            record.firstName,
          );
        default:
          return null;
      }
    },
    renderLinkToRecord: ({ record, children, key, h }) => {
      switch (record.__typename) {
        case "TeamMemberRecord":
          return h(
            "a",
            { key, attrs: { href: `/team/${record.slug}` } },
            children,
          );
        default:
          return null;
      }
    },
    renderBlock: ({ record, key, h }) => {
      switch (record.__typename) {
        case "ImageRecord":
          return h("img", {
            key,
            attrs: { src: record.image.url, alt: record.image.alt },
          });
        default:
          return null;
      }
    },
  },
  async mounted() {
    this.data = await request({ query });
    // data.blogPost.content ->
    // {
    //   value: {
    //     schema: "dast",
    //     document: {
    //       type: "root",
    //       children: [
    //         {
    //           type: "heading",
    //           level: 1,
    //           children: [
    //             { type: "span", value: "Welcome onboard " },
    //             { type: "inlineItem", item: "324321" },
    //           ],
    //         },
    //         {
    //           type: "paragraph",
    //           children: [
    //             { type: "span", value: "So happy to have " },
    //             {
    //               type: "itemLink",
    //               item: "324321",
    //               children: [
    //                 {
    //                   type: "span",
    //                   marks: ["strong"],
    //                   value: "this awesome humang being",
    //                 },
    //               ]
    //             },
    //             { type: "span", value: " in our team!" },
    //           ]
    //         },
    //         { type: "block", item: "1984559" }
    //       ],
    //     },
    //   },
    //   links: [
    //     {
    //       id: "324321",
    //       __typename: "TeamMemberRecord",
    //       firstName: "Mark",
    //       slug: "mark-smith",
    //     },
    //   ],
    //   blocks: [
    //     {
    //       id: "324321",
    //       __typename: "ImageRecord",
    //       image: {
    //         alt: "Our team at work",
    //         url: "https://www.datocms-assets.com/205/1597757278-austin-distel-wd1lrb9oeeo-unsplash.jpg",
    //       },
    //     },
    //   ],
    // }
  },
};
</script>
```

## Props

| prop               | type                                                     | required                                              | description                                                                 | default          |
| ------------------ | -------------------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------------------------------- | ---------------- |
| data               | `StructuredTextGraphQlResponse \| DastNode`              | :white_check_mark:                                    | The actual field value you get from DatoCMS                                 |                  |
| renderInlineRecord | `({ record }) => VNode \| null`                          | Only required if document contains `inlineItem` nodes | Convert an `inlineItem` DAST node into React                                | `[]`             |
| renderLinkToRecord | `({ record, children }) => VNode \| null`                | Only required if document contains `itemLink` nodes   | Convert an `itemLink` DAST node into React                                  | `null`           |
| renderBlock        | `({ record }) => VNode \| null`                          | Only required if document contains `block` nodes      | Convert a `block` DAST node into React                                      | `null`           |
| customRules        | `Array<RenderRule>`                                      | :x:                                                   | Customize how document is converted in JSX (use `renderRule()` to generate) | `null`           |
| renderText         | `(text: string, key: string) => VNode \| string \| null` | :x:                                                   | Convert a simple string text into React                                     | `(text) => text` |
