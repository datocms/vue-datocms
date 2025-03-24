# Structured text

`<datocms-structured-text />` is a Vue component that you can use to render the value contained inside a DatoCMS [Structured Text field type](https://www.datocms.com/docs/structured-text/dast).

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Setup](#setup)
- [Basic usage](#basic-usage)
- [Custom renderers](#custom-renderers)
- [Override default rendering of nodes](#override-default-rendering-of-nodes)
- [Props](#props)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setup

You can register the component globally so it's available in all your apps:

```js
import Vue from 'vue';
import { DatocmsStructuredTextPlugin } from 'vue-datocms';

Vue.use(DatocmsStructuredTextPlugin);
```

Or use it locally in any of your components:

```js
import { StructuredText } from 'vue-datocms';

export default {
  components: {
    'datocms-structured-text': StructuredText,
  },
};
```

## Basic usage

```vue
<template>
  <article>
    <div v-if="data">
      <h1>{{ data.blogPost.title }}</h1>
      <datocms-structured-text :data="data.blogPost.content" />
      <!--
        Final result:
        <h1>Hello <strong>world!</strong></h1>
      -->
    </div>
  </article>
</template>

<script>
import { request } from './lib/datocms';
import { StructuredText } from 'vue-datocms';

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
    'datocms-structured-text': StructuredText,
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
import { request } from './lib/datocms';
import { StructuredText, Image } from 'vue-datocms';
import { h } from 'vue';

const query = gql`
  query {
    blogPost {
      title
      content {
        value
        links {
          ... on RecordInterface {
            __typename
            id
          }
          ... on TeamMemberRecord {
            firstName
            slug
          }
        }
        blocks {
          ... on RecordInterface {
            __typename
            id
          }
          ... on ImageRecord {
            image {
              responsiveImage(
                imgixParams: { fit: crop, w: 300, h: 300, auto: format }
              ) {
                srcSet
                webpSrcSet
                sizes
                src
                width
                height
                aspectRatio
                alt
                title
                base64
              }
            }
          }
        }
        inlineBlocks {
          ... on RecordInterface {
            __typename
            id
          }
          ... on MentionRecord {
            username
          }
        }
      }
    }
  }
`;

export default {
  components: {
    'datocms-structured-text': StructuredText,
    'datocms-image': Image,
  },
  data() {
    return {
      data: null,
    };
  },
  methods: {
    renderInlineRecord: ({ record }) => {
      switch (record.__typename) {
        case 'TeamMemberRecord':
          return h('a', { href: `/team/${record.slug}` }, record.firstName);
        default:
          return null;
      }
    },
    renderLinkToRecord: ({ record, children, transformedMeta }) => {
      switch (record.__typename) {
        case 'TeamMemberRecord':
          return h(
            'a',
            { ...transformedMeta, href: `/team/${record.slug}` },
            children,
          );
        default:
          return null;
      }
    },
    renderBlock: ({ record }) => {
      switch (record.__typename) {
        case 'ImageRecord':
          return h('datocms-image', {
            data: record.image.responsiveImage,
          });
        default:
          return null;
      }
    },
    renderInlineBlock: ({ record }) => {
      switch (record.__typename) {
        case 'MentionRecord':
          return h('code', `@${record.username}`);
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
    //             { type: "span", value: " in our team! We call him" },
    //             { type: "inlineBlock", item: "1984560" },
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
    //       id: "1984559",
    //       __typename: "ImageRecord",
    //       image: {
    //         responsiveImage: { ... },
    //       },
    //     },
    //   ],
    //   inlineBlocks: [
    //     {
    //       id: "1984560",
    //       __typename: "MentionRecord",
    //       username: "steffoz"
    //     },
    //   ],
    // }
  },
};
</script>
```

## Override default rendering of nodes

This component automatically renders all nodes except for `inlineItem`, `itemLink`, `block` and `inlineBlock` using a set of default rules, but you might want to customize those. For example:

- For `heading` nodes, you might want to add an anchor;
- For `code` nodes, you might want to use a custom sytax highlighting component;

In this case, you can easily override default rendering rules with the `customNodeRules` and `customMarkRules` props.

```vue
<template>
  <datocms-structured-text
    :data="data.blogPost.content"
    :customNodeRules="customNodeRules"
    :customMarkRules="customMarkRules"
  />
</template>

<script>
import { StructuredText, renderNodeRule, renderMarkRule } from "vue-datocms";
import { isHeading, isCode } from "datocms-structured-text-utils";
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import SyntaxHighlight from './components/SyntaxHighlight';

export default {
  components: {
    "datocms-structured-text": StructuredText,
    "syntax-highlight": SyntaxHighlight,
  },
  data() {
    return {
      data: /* ... */,
      customNodeRules: [
        renderNodeRule(isHeading, ({ adapter: { renderNode: h }, node, children, key }) => {
          const anchor = toPlainText(node)
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

          return h(
            `h${node.level}`, { key }, [
              ...children,
              h('a', { attrs: { id: anchor } }, []),
              h('a', { attrs: { href: `#${anchor}` } }, []),
            ]
          );
        }),
        renderNodeRule(isCode, ({ adapter: { renderNode: h }, node, key }) => {
          return h('syntax-highlight', {
            key,
            code: node.code,
            language: node.language,
            linesToBeHighlighted: node.highlight,
          }, []);
        }),
      ],
      customMarkRules: [
        // convert "strong" marks into <b> tags
        renderMarkRule('strong', ({ adapter: { renderNode: h }, mark, children, key }) => {
          return h('b', {key}, children);
        }),
      ],
    };
  },
};
</script>
```

Note: if you override the rules for `inlineItem`, `itemLink`, `block` or `inlineBlock` nodes, then the `renderInlineRecord`, `renderLinkToRecord`, `renderBlock`, `renderInlineBlock` props won't be considered!

## Props

| prop               | type                                                       | required                                               | description                                                                                      | default                                                                                                              |
| ------------------ | ---------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| data               | `StructuredTextGraphQlResponse \| DastNode`                | :white_check_mark:                                     | The actual [field value](https://www.datocms.com/docs/structured-text/dast) you get from DatoCMS |                                                                                                                      |
| renderInlineRecord | `({ record }) => VNode \| null`                            | Only required if document contains `inlineItem` nodes  | Convert an `inlineItem` DAST node into a VNode                                                   | `[]`                                                                                                                 |
| renderLinkToRecord | `({ record, children, transformedMeta }) => VNode \| null` | Only required if document contains `itemLink` nodes    | Convert an `itemLink` DAST node into a VNode                                                     | `null`                                                                                                               |
| renderBlock        | `({ record }) => VNode \| null`                            | Only required if document contains `block` nodes       | Convert a `block` DAST node into a VNode                                                         | `null`                                                                                                               |
| renderInlineBlock  | `({ record }) => VNode \| null`                            | Only required if document contains `inlineBlock` nodes | Convert an `inlineBlock` DAST node into a VNode                                                  | `null`                                                                                                               |
| metaTransformer    | `({ node, meta }) => Object \| null`                       | :x:                                                    | Transform `link` and `itemLink` meta property into HTML props                                    | [See function](https://github.com/datocms/structured-text/blob/main/packages/generic-html-renderer/src/index.ts#L61) |
| customNodeRules    | `Array<RenderRule>`                                        | :x:                                                    | Customize how nodes are converted in JSX (use `renderNodeRule()` to generate)                    | `null`                                                                                                               |
| customMarkRules    | `Array<RenderMarkRule>`                                    | :x:                                                    | Customize how marks are converted in JSX (use `renderMarkRule()` to generate)                    | `null`                                                                                                               |
| renderText         | `(text: string, key: string) => VNode \| string \| null`   | :x:                                                    | Convert a simple string text into a VNode                                                        | `(text) => text`                                                                                                     |
