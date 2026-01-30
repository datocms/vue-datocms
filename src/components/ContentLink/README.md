# ContentLink component for Visual Editing

`<ContentLink />` is a Vue component that enables **Visual Editing** for DatoCMS content by providing click-to-edit overlays and seamless integration with the DatoCMS Web Previews plugin.

- TypeScript ready;
- Usable both client and server side;
- Compatible with vanilla Vue, Nuxt and pretty much any other Vue-based solution;
- Framework-agnostic with easy integration for Vue Router, Nuxt Router, and custom routers;

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [What is Visual Editing?](#what-is-visual-editing)
- [Out-of-the-box features](#out-of-the-box-features)
- [Installation](#installation)
- [Basic Setup](#basic-setup)
  - [Step 1: Configure your DatoCMS client](#step-1-configure-your-datocms-client)
  - [Step 2: Add the ContentLink component](#step-2-add-the-contentlink-component)
- [Usage](#usage)
  - [Framework-agnostic (no routing)](#framework-agnostic-no-routing)
  - [With Vue Router](#with-vue-router)
  - [With Nuxt](#with-nuxt)
- [Enabling click-to-edit](#enabling-click-to-edit)
- [Flash-all highlighting](#flash-all-highlighting)
- [Props](#props)
- [Advanced usage: the `useContentLink` composable](#advanced-usage-the-usecontentlink-composable)
  - [When to use the composable](#when-to-use-the-composable)
  - [API Reference](#api-reference)
  - [Example with custom integration](#example-with-custom-integration)
- [Data attributes reference](#data-attributes-reference)
  - [Developer-specified attributes](#developer-specified-attributes)
    - [`data-datocms-content-link-url`](#data-datocms-content-link-url)
    - [`data-datocms-content-link-source`](#data-datocms-content-link-source)
    - [`data-datocms-content-link-group`](#data-datocms-content-link-group)
    - [`data-datocms-content-link-boundary`](#data-datocms-content-link-boundary)
  - [Library-managed attributes](#library-managed-attributes)
    - [`data-datocms-contains-stega`](#data-datocms-contains-stega)
    - [`data-datocms-auto-content-link-url`](#data-datocms-auto-content-link-url)
- [How group and boundary resolution works](#how-group-and-boundary-resolution-works)
- [Structured Text fields](#structured-text-fields)
  - [Rule 1: Always wrap the Structured Text component in a group](#rule-1-always-wrap-the-structured-text-component-in-a-group)
  - [Rule 2: Wrap embedded blocks, inline records, and inline blocks in a boundary](#rule-2-wrap-embedded-blocks-inline-records-and-inline-blocks-in-a-boundary)
- [Low-level utilities](#low-level-utilities)
  - [`decodeStega`](#decodestega)
  - [`stripStega`](#stripstega)
- [Troubleshooting](#troubleshooting)
  - [Click-to-edit overlays not appearing](#click-to-edit-overlays-not-appearing)
  - [Overlays appearing in wrong places](#overlays-appearing-in-wrong-places)
  - [Navigation not working in Web Previews plugin](#navigation-not-working-in-web-previews-plugin)
  - [Performance issues with many editable elements](#performance-issues-with-many-editable-elements)
  - [Content not clickable inside StructuredText](#content-not-clickable-inside-structuredtext)
  - [Layout issues caused by stega encoding](#layout-issues-caused-by-stega-encoding)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## What is Visual Editing?

Visual Editing transforms how content editors interact with your website. Instead of navigating through forms and fields in a CMS, editors can:

1. **See their content in context** - Preview exactly how content appears on the live site
2. **Click to edit** - Click directly on any text, image, or field to open the editor
3. **Navigate seamlessly** - Jump between pages in the preview, and the CMS follows along
4. **Get instant feedback** - Changes in the CMS are reflected immediately in the preview

This drastically improves the editing experience, especially for non-technical users who can now edit content without understanding the underlying CMS structure.

## Out-of-the-box features

- **Click-to-edit overlays**: Visual indicators showing which content is editable
- **Stega decoding**: Automatically detects and decodes editing metadata embedded in content
- **Keyboard shortcuts**: Hold Alt/Option to temporarily enable editing mode
- **Flash-all highlighting**: Show all editable areas at once for quick orientation
- **Bidirectional navigation**: Sync navigation between preview and DatoCMS editor
- **Framework-agnostic**: Works with Vue Router, Nuxt, or any routing solution
- **StructuredText integration**: Special support for complex structured content fields
- **[Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) integration**: Seamless integration with DatoCMS's editing interface

## Installation

```bash
npm install vue-datocms
```

The `@datocms/content-link` package is included as a dependency, so you don't need to install it separately.

## Basic Setup

Visual Editing requires two steps to set up:

### Step 1: Configure your DatoCMS client

When fetching content from DatoCMS, enable stega encoding to embed editing metadata:

```js
import { executeQuery } from '@datocms/cda-client';

const query = `
  query {
    page {
      title
      content
    }
  }
`;

const result = await executeQuery(query, {
  token: 'YOUR_API_TOKEN',
  environment: 'main',
  // Enable stega encoding
  contentLink: 'v1',
  // Set your site's base URL for editing links
  baseEditingUrl: 'https://your-project.admin.datocms.com',
});
```

The `contentLink: 'v1'` option enables stega encoding, which embeds invisible metadata into text fields. The `baseEditingUrl` tells DatoCMS where your project is located so edit URLs can be generated correctly. Both options are required.

### Step 2: Add the ContentLink component

Add the `<ContentLink />` component to your app. It doesn't render anything visible, but it activates the Visual Editing features:

```vue
<script setup>
import { ContentLink } from 'vue-datocms';
</script>

<template>
  <ContentLink />
  <!-- Your content here -->
</template>
```

That's it! Editors can now press and hold the Alt/Option key to temporarily activate click-to-edit mode.

## Usage

### Framework-agnostic (no routing)

For simple sites without client-side routing:

```vue
<script setup>
import { ContentLink } from 'vue-datocms';
</script>

<template>
  <ContentLink />
  <!-- Your content here -->
</template>
```

### With Vue Router

For apps using Vue Router, pass routing callbacks to enable in-plugin navigation:

```vue
<script setup>
import { ContentLink } from 'vue-datocms';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
</script>

<template>
  <ContentLink
    :on-navigate-to="(path) => router.push(path)"
    :current-path="route.path"
  />
  <!-- Your content here -->
</template>
```

### With Nuxt

For Nuxt applications:

```vue
<script setup>
import { ContentLink } from 'vue-datocms';

const router = useRouter();
const route = useRoute();
</script>

<template>
  <ContentLink
    :on-navigate-to="(path) => router.push(path)"
    :current-path="route.path"
  />
  <!-- Your content here -->
</template>
```

Or create a reusable component:

```vue
<!-- components/ContentLink.vue -->
<script setup>
import { ContentLink as DatoContentLink } from 'vue-datocms';

const router = useRouter();
const route = useRoute();
</script>

<template>
  <DatoContentLink
    :on-navigate-to="(path) => router.push(path)"
    :current-path="route.path"
  />
</template>
```

Then use it in your layout:

```vue
<template>
  <div>
    <ContentLink />
    <slot />
  </div>
</template>
```

## Enabling click-to-edit

By default, click-to-edit overlays are **not enabled automatically**. Editors have two ways to activate them:

1. **Alt/Option key (recommended)**: Press and hold the Alt (Windows/Linux) or Option (Mac) key to temporarily enable click-to-edit mode. Release the key to disable it. This is the most convenient method as it requires no code changes.

2. **Programmatically on mount**: Set the `enable-click-to-edit` prop to enable overlays when the component mounts:

```vue
<template>
  <ContentLink :enable-click-to-edit="true" />
</template>
```

Or with options:

```vue
<template>
  <!-- Scroll to nearest editable element if none visible -->
  <ContentLink :enable-click-to-edit="{ scrollToNearestTarget: true }" />

  <!-- Only enable on devices with hover capability (non-touch) -->
  <ContentLink :enable-click-to-edit="{ hoverOnly: true }" />

  <!-- Combine both options -->
  <ContentLink :enable-click-to-edit="{ hoverOnly: true, scrollToNearestTarget: true }" />
</template>
```

**Options:**

- `scrollToNearestTarget`: Automatically scroll to the nearest editable element if none are currently visible on screen. Helpful for long pages.
- `hoverOnly`: Only enable click-to-edit on devices that support hover (i.e., non-touch devices). This is useful to avoid showing overlays on touch devices where they may interfere with normal scrolling and tapping behavior. On touch-only devices, users can still toggle click-to-edit manually using the Alt/Option key.

## Flash-all highlighting

The flash-all feature visually highlights all editable elements with an animated effect, helping editors discover what content they can edit. This is particularly useful when first exploring a page.

To trigger flash-all, you need to use the `useContentLink` composable:

```vue
<script setup>
import { useContentLink } from 'vue-datocms';

const { flashAll } = useContentLink();

function showEditableAreas() {
  // Highlight all editable elements and scroll to the nearest one
  flashAll(true);
}
</script>

<template>
  <button @click="showEditableAreas">Show editable areas</button>
</template>
```

## Props

| Prop                   | Type                                      | Default | Description                                                                                                                                            |
| ---------------------- | ----------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `on-navigate-to`       | `(path: string) => void`                  | -       | Callback when [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews) requests navigation to a different page |
| `current-path`         | `string`                                  | -       | Current pathname to sync with [Web Previews plugin](https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews)                         |
| `enable-click-to-edit` | `true \| { scrollToNearestTarget?: boolean, hoverOnly?: boolean }` | -       | Enable click-to-edit overlays on mount. Pass `true` or an object with options. If undefined, click-to-edit is disabled                                 |
| `strip-stega`          | `boolean`                                 | -       | Whether to strip stega encoding from text nodes after stamping                                                                                         |
| `root`                 | `Ref<ParentNode \| null \| undefined>`    | -       | Ref to limit scanning to this root element instead of the entire document                                                                              |

## Advanced usage: the `useContentLink` composable

For more control over Visual Editing behavior, you can use the `useContentLink` composable directly. This gives you programmatic access to all Visual Editing features.

### When to use the composable

Use the composable instead of the component when you need to:

- Programmatically enable/disable click-to-edit based on conditions
- Trigger flash-all highlighting from your UI
- Access the controller instance directly
- Integrate with custom state management
- Build custom Visual Editing UI

### API Reference

```typescript
import { useContentLink } from 'vue-datocms';

const {
  controller,              // Ref<Controller | null> - The controller instance
  enableClickToEdit,       // (options?) => void - Enable click-to-edit overlays
  disableClickToEdit,      // () => void - Disable click-to-edit overlays
  isClickToEditEnabled,    // () => boolean - Check if click-to-edit is enabled
  flashAll,                // (scrollToNearestTarget?) => void - Highlight all editable elements
  setCurrentPath,          // (path: string) => void - Notify plugin of current path
} = useContentLink({
  // enabled can be:
  // - true (default): Enable with default settings (stega encoding preserved)
  // - false: Disable the controller
  // - { stripStega: true }: Enable and strip stega encoding for clean DOM
  enabled: true,
  onNavigateTo: (path) => { /* handle navigation */ },
  root: myRootElementRef,  // Optional: limit scanning to this element
});
```

**Options:**

- `enabled?: boolean | { stripStega: boolean }` - Controls whether the controller is enabled and how it handles stega encoding:
  - `true` (default): Enables the controller with stega encoding preserved in the DOM (allows controller recreation)
  - `false`: Disables the controller completely
  - `{ stripStega: true }`: Enables the controller and permanently removes stega encoding from text nodes for clean `textContent` access
- `onNavigateTo?: (path: string) => void` - Callback when Web Previews plugin requests navigation
- `root?: Ref<ParentNode | null | undefined>` - Ref to limit scanning to this root element

**Note:** The `<ContentLink />` component allows controlling stega stripping through the `strip-stega` prop. When undefined, the underlying library's default behavior is used.

### Example with custom integration

```vue
<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useContentLink } from 'vue-datocms';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// State to track editing mode
const isEditingMode = ref(false);

// Initialize Visual Editing
const {
  controller,
  enableClickToEdit,
  disableClickToEdit,
  isClickToEditEnabled,
  flashAll,
  setCurrentPath,
} = useContentLink({
  enabled: true,
  onNavigateTo: (path) => router.push(path),
});

// Toggle editing mode
function toggleEditingMode() {
  if (isClickToEditEnabled()) {
    disableClickToEdit();
    isEditingMode.value = false;
  } else {
    enableClickToEdit({ scrollToNearestTarget: true });
    isEditingMode.value = true;
  }
}

// Show all editable areas
function highlightAllContent() {
  flashAll(true);
}

// Keep Web Previews plugin in sync
watch(() => route.path, (newPath) => {
  setCurrentPath(newPath);
}, { immediate: true });

// Enable editing mode on mount for editors
onMounted(() => {
  const isEditor = /* check if user is an editor */;
  if (isEditor) {
    enableClickToEdit();
    isEditingMode.value = true;
  }
});
</script>

<template>
  <div>
    <!-- Custom editing toolbar -->
    <div v-if="controller" class="editing-toolbar">
      <button @click="toggleEditingMode">
        {{ isEditingMode ? 'Disable' : 'Enable' }} Editing
      </button>
      <button @click="highlightAllContent">
        Show Editable Areas
      </button>
    </div>

    <!-- Your content here -->
  </div>
</template>
```

## Data attributes reference

This library uses several `data-datocms-*` attributes. Some are **developer-specified** (you add them to your markup), and some are **library-managed** (added automatically during DOM stamping). Here's a complete reference.

### Developer-specified attributes

These attributes are added by you in your templates/components to control how editable regions behave.

#### `data-datocms-content-link-url`

Manually marks an element as editable with an explicit edit URL. Use this for non-text fields (booleans, numbers, dates, JSON) that cannot contain stega encoding. The recommended approach is to use the `_editingUrl` field available on all records:

```graphql
query {
  product {
    id
    price
    isActive
    _editingUrl
  }
}
```

```vue
<template>
  <span :data-datocms-content-link-url="product._editingUrl">
    {{ product.price }}
  </span>
</template>
```

#### `data-datocms-content-link-source`

Attaches stega-encoded metadata without the need to render it as content. Useful for structural elements that cannot contain text (like `<video>`, `<audio>`, `<iframe>`, etc.) or when stega encoding in visible text would be problematic:

```vue
<template>
  <div :data-datocms-content-link-source="video.alt">
    <video :src="video.url" :poster="video.posterImage.url" controls />
  </div>
</template>
```

The value must be a stega-encoded string (any text field from the API will work). The library decodes the stega metadata from the attribute value and makes the element clickable to edit.

#### `data-datocms-content-link-group`

Expands the clickable area to a parent element. When the library encounters stega-encoded content, by default it makes the immediate parent of the text node clickable to edit. Adding this attribute to an ancestor makes that ancestor the clickable target instead:

```html
<article data-datocms-content-link-group>
  <!-- product.title contains stega encoding -->
  <h2>{{ product.title }}</h2>
  <p>${{ product.price }}</p>
</article>
```

Here, clicking anywhere in the `<article>` opens the editor, rather than requiring users to click precisely on the `<h2>`.

**Important:** A group should contain only one stega-encoded source. If multiple stega strings resolve to the same group, the library logs a collision warning and only the last URL wins.

#### `data-datocms-content-link-boundary`

Stops the upward DOM traversal that looks for a `data-datocms-content-link-group`, making the element where stega was found the clickable target instead. This creates an independent editable region that won't merge into a parent group (see [How group and boundary resolution works](#how-group-and-boundary-resolution-works) below for details):

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{{ page.title }}</h1>
  <section data-datocms-content-link-boundary>
    <!-- page.author contains stega encoding → resolves to URL B -->
    <span>{{ page.author }}</span>
  </section>
</div>
```

Without the boundary, clicking `page.author` would open URL A (the outer group). With the boundary, the `<span>` becomes the clickable target opening URL B.

The boundary can also be placed directly on the element that contains the stega text:

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{{ page.title }}</h1>
  <!-- page.author contains stega encoding → resolves to URL B -->
  <span data-datocms-content-link-boundary>{{ page.author }}</span>
</div>
```

Here, the `<span>` has the boundary and directly contains the stega text, so the `<span>` itself becomes the clickable target (since the starting element and the boundary element are the same).

### Library-managed attributes

These attributes are added automatically by the library during DOM stamping. You do not need to add them yourself, but you can target them in CSS or JavaScript.

#### `data-datocms-contains-stega`

Added to elements whose text content contains stega-encoded invisible characters. This attribute is only present when `stripStega` is `false` (the default), since with `stripStega: true` the characters are removed entirely. Useful for CSS workarounds — the zero-width characters can sometimes cause unexpected letter-spacing or text overflow:

```css
[data-datocms-contains-stega] {
  letter-spacing: 0 !important;
}
```

#### `data-datocms-auto-content-link-url`

Added automatically to elements that the library has identified as editable targets (through stega decoding and group/boundary resolution). Contains the resolved edit URL.

This is the automatic counterpart to the developer-specified `data-datocms-content-link-url`. The library adds `data-datocms-auto-content-link-url` wherever it can extract an edit URL from stega encoding, while `data-datocms-content-link-url` is needed for non-text fields (booleans, numbers, dates, etc.) where stega encoding cannot be embedded. Both attributes are used by the click-to-edit overlay system to determine which elements are clickable and where they link to.

## How group and boundary resolution works

When the library encounters stega-encoded content inside an element, it walks up the DOM tree from that element:

1. If it finds a `data-datocms-content-link-group`, it stops and stamps **that** element as the clickable target.
2. If it finds a `data-datocms-content-link-boundary`, it stops and stamps the **starting element** as the clickable target — further traversal is prevented.
3. If it reaches the root without finding either, it stamps the **starting element**.

Here are some concrete examples to illustrate:

**Example 1: Nested groups**

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{{ page.title }}</h1>
  <div data-datocms-content-link-group>
    <!-- page.subtitle contains stega encoding → resolves to URL B -->
    <p>{{ page.subtitle }}</p>
  </div>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.subtitle`**: walks up from `<p>`, finds the inner group first → the **inner `<div>`** becomes clickable (opens URL B). The outer group is never reached.

Each nested group creates an independent clickable region. The innermost group always wins for its own content.

**Example 2: Boundary preventing group propagation**

```html
<div data-datocms-content-link-group>
  <!-- page.title contains stega encoding → resolves to URL A -->
  <h1>{{ page.title }}</h1>
  <section data-datocms-content-link-boundary>
    <!-- page.author contains stega encoding → resolves to URL B -->
    <span>{{ page.author }}</span>
  </section>
</div>
```

- **`page.title`**: walks up from `<h1>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.author`**: walks up from `<span>`, hits the `<section>` boundary → traversal stops, the **`<span>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 3: Boundary inside a group**

```html
<div data-datocms-content-link-group>
  <!-- page.description contains stega encoding → resolves to URL A -->
  <p>{{ page.description }}</p>
  <div data-datocms-content-link-boundary>
    <!-- page.footnote contains stega encoding → resolves to URL B -->
    <p>{{ page.footnote }}</p>
  </div>
</div>
```

- **`page.description`**: walks up from `<p>`, finds the outer group → the **outer `<div>`** becomes clickable (opens URL A).
- **`page.footnote`**: walks up from `<p>`, hits the boundary → traversal stops, the **`<p>`** itself becomes clickable (opens URL B). The outer group is not reached.

**Example 4: Multiple stega strings without groups (collision warning)**

```html
<p>
  <!-- Both product.name and product.tagline contain stega encoding -->
  {{ product.name }}
  {{ product.tagline }}
</p>
```

Both stega-encoded strings resolve to the same `<p>` element. The library logs a console warning and the last URL wins. To fix this, wrap each piece of content in its own element:

```html
<p>
  <span>{{ product.name }}</span>
  <span>{{ product.tagline }}</span>
</p>
```

## Structured Text fields

Structured Text fields require special attention because of how stega encoding works within them:

- The DatoCMS API encodes stega information inside a single `<span>` within the structured text output. Without any configuration, only that small span would be clickable.
- Structured Text fields can contain **embedded blocks** and **inline records**, each with their own editing URL that should open a different record in the editor.

Here are the rules to follow:

### Rule 1: Always wrap the Structured Text component in a group

This makes the entire structured text area clickable, instead of just the tiny stega-encoded span:

```vue
<template>
  <div data-datocms-content-link-group>
    <StructuredText :data="page.content" />
  </div>
</template>
```

### Rule 2: Wrap embedded blocks, inline records, and inline blocks in a boundary

Embedded blocks, inline records, and inline blocks have their own edit URL (pointing to the block/record). Without a boundary, clicking them would bubble up to the parent group and open the structured text field editor instead. Add `data-datocms-content-link-boundary` to prevent them from merging into the parent group.

**Why `renderLinkToRecord` doesn't need a boundary:** Record links are typically just `<a>` tags wrapping text that already belongs to the surrounding structured text. Since they don't introduce a separate editing target, there's no URL collision with the parent group and no reason to isolate them with a boundary. Clicking a record link simply opens the structured text field editor — the same behavior you'd get clicking any other text in the paragraph — which is the correct outcome since the link text is part of the structured text content itself.

```vue
<template>
  <article>
    <div v-if="data">
      <ContentLink
        :on-navigate-to="(path) => router.push(path)"
        :current-path="route.path"
      />

      <h1>{{ data.blogPost.title }}</h1>

      <div data-datocms-content-link-group>
        <datocms-structured-text
          :data="data.blogPost.content"
          :renderInlineRecord="renderInlineRecord"
          :renderLinkToRecord="renderLinkToRecord"
          :renderBlock="renderBlock"
          :renderInlineBlock="renderInlineBlock"
        />
      </div>
    </div>
  </article>
</template>

<script>
import { StructuredText, Image, ContentLink } from 'vue-datocms';
import { useRouter, useRoute } from 'vue-router';
import { request } from './lib/datocms';
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
    ContentLink,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    return { router, route };
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
          return h(
            'span',
            { 'data-datocms-content-link-boundary': '' },
            [h('a', { href: `/team/${record.slug}` }, record.firstName)],
          );
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
          return h(
            'div',
            { 'data-datocms-content-link-boundary': '' },
            [h('datocms-image', { data: record.image.responsiveImage })],
          );
        default:
          return null;
      }
    },
    renderInlineBlock: ({ record }) => {
      switch (record.__typename) {
        case 'MentionRecord':
          return h(
            'span',
            { 'data-datocms-content-link-boundary': '' },
            [h('code', `@${record.username}`)],
          );
        default:
          return null;
      }
    },
  },
  async mounted() {
    this.data = await request({ query });
  },
};
</script>
```

With this setup:
- Clicking the main text (paragraphs, headings, lists, and record links) opens the **structured text field editor**
- Clicking an embedded block, inline record, or inline block opens **that record's editor**

## Low-level utilities

The `vue-datocms` package re-exports utility functions from `@datocms/content-link` for working with stega-encoded content:

### `decodeStega`

Decodes stega-encoded content to extract editing metadata:

```typescript
import { decodeStega } from 'vue-datocms';

const text = "Hello, world!"; // Contains invisible stega data
const decoded = decodeStega(text);

if (decoded) {
  console.log('Editing URL:', decoded.url);
  console.log('Clean text:', decoded.cleanText);
}
```

### `stripStega`

Removes stega encoding from any data type by converting to JSON, removing all stega-encoded segments, and parsing back to the original type:

```typescript
import { stripStega } from 'vue-datocms';

// Works with strings
stripStega("Hello\u200EWorld") // "HelloWorld"

// Works with objects
stripStega({ name: "John\u200E", age: 30 })

// Works with nested structures - removes ALL stega encodings
stripStega({
  users: [
    { name: "Alice\u200E", email: "alice\u200E.com" },
    { name: "Bob\u200E", email: "bob\u200E.co" }
  ]
})

// Works with arrays
stripStega(["First\u200E", "Second\u200E", "Third\u200E"])
```

These utilities are useful when you need to:
- Extract clean text for meta tags or social sharing
- Check if content has stega encoding
- Debug Visual Editing issues
- Process stega-encoded content programmatically

## Troubleshooting

### Click-to-edit overlays not appearing

1. **Check client configuration**: Make sure you've configured your DatoCMS client with `contentLink: 'v1'` and `baseEditingUrl`
2. **Verify content is stega-encoded**: Use `decodeStega()` on a text field to check if metadata is present
3. **Enable click-to-edit**: Either press Alt/Option key or set `enable-click-to-edit` prop to `true` (e.g., `:enable-click-to-edit="true"`)
4. **Check console for errors**: Look for any JavaScript errors that might prevent the controller from initializing

### Overlays appearing in wrong places

1. **Layout shifts**: If your page layout shifts after content loads, overlays may be positioned incorrectly. Try triggering a window resize event after content loads
2. **Transformed elements**: CSS transforms on parent elements can affect overlay positioning

### Navigation not working in Web Previews plugin

1. **Check `onNavigateTo` callback**: Make sure you're passing a valid navigation function
2. **Verify `currentPath` prop**: Ensure you're passing the current route path
3. **Test router integration**: Verify that your router navigation works outside of Visual Editing

### Performance issues with many editable elements

1. **Use `root` prop**: Limit scanning to a specific container instead of the entire document
2. **Avoid enabling on mount**: Use Alt/Option key activation instead of passing options to `enable-click-to-edit` prop
3. **Debounce updates**: If you're frequently updating `currentPath`, consider debouncing the updates

### Content not clickable inside StructuredText

1. **Add edit group**: Wrap StructuredText with `data-datocms-content-link-group`
2. **Check boundaries**: Make sure you're not inadvertently blocking clicks with `data-datocms-content-link-boundary` on parent elements
3. **Verify stega encoding**: Check that your GraphQL query includes text fields with stega encoding enabled

### Layout issues caused by stega encoding

The invisible zero-width characters can cause unexpected letter-spacing or text breaking out of containers. To fix this, either use `stripStega: true`, or use CSS: `[data-datocms-contains-stega] { letter-spacing: 0 !important; }`. This attribute is automatically added to elements with stega-encoded content when `stripStega: false` (the default).
