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
- [StructuredText integration](#structuredtext-integration)
  - [Using edit groups](#using-edit-groups)
  - [Using edit boundaries](#using-edit-boundaries)
  - [Complete example](#complete-example)
- [Manual overlays](#manual-overlays)
  - [Using `data-datocms-content-link-url`](#using-data-datocms-content-link-url)
  - [Using `data-datocms-content-link-source`](#using-data-datocms-content-link-source)
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

## StructuredText integration

When working with DatoCMS Structured Text fields, you may want to make larger areas clickable or prevent clicks from bubbling into nested content. The `@datocms/content-link` library provides special data attributes for this purpose.

### Using edit groups

Wrap StructuredText with `data-datocms-content-link-group` to make the entire area clickable, rather than individual text nodes. This is especially useful for StructuredText fields:

```vue
<template>
  <div data-datocms-content-link-group>
    <StructuredText :data="content.structuredTextField" />
  </div>
</template>
```

Now clicking anywhere in the StructuredText field will open the editor for that field.

### Using edit boundaries

Use `data-datocms-content-link-boundary` on embedded blocks to prevent click events from traversing into nested content. This is important when you have records embedded within StructuredText:

```vue
<script setup>
import { StructuredText } from 'vue-datocms';

function renderBlock({ record }) {
  return h('div', { 'data-datocms-content-link-boundary': '' }, [
    h(BlockComponent, { block: record })
  ]);
}
</script>

<template>
  <StructuredText
    :data="content.structuredTextField"
    :render-block="renderBlock"
  />
</template>
```

### Complete example

Here's a complete example showing both attributes:

```vue
<script setup>
import { h } from 'vue';
import { StructuredText, ContentLink } from 'vue-datocms';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Your content from DatoCMS
const content = { /* ... */ };

function renderBlock({ record }) {
  // Add boundary to prevent clicks from bubbling into the block
  return h('div', { 'data-datocms-content-link-boundary': '' }, [
    h(MyBlockComponent, { block: record })
  ]);
}

function renderInlineRecord({ record }) {
  return h('span', { 'data-datocms-content-link-boundary': '' }, [
    h(MyInlineComponent, { record })
  ]);
}
</script>

<template>
  <ContentLink
    :on-navigate-to="(path) => router.push(path)"
    :current-path="route.path"
  />

  <!-- Wrap StructuredText with edit group for field-level clicking -->
  <div data-datocms-content-link-group>
    <StructuredText
      :data="content.structuredTextField"
      :render-block="renderBlock"
      :render-inline-record="renderInlineRecord"
    />
  </div>
</template>
```

## Manual overlays

In some cases, you may want to manually create click-to-edit overlays for content that doesn't have stega encoding.

### Using `data-datocms-content-link-url`

You can add the `data-datocms-content-link-url` attribute with a DatoCMS editing URL:

```vue
<script setup>
// Assume your record has an _editingUrl field from the GraphQL query
const record = {
  title: 'My Post',
  status: 'published',
  _editingUrl: 'https://your-site.admin.datocms.com/editor/item_types/123/items/456/edit',
};
</script>

<template>
  <div :data-datocms-content-link-url="record._editingUrl">
    <span>Status: {{ record.status }}</span>
  </div>
</template>
```

The `_editingUrl` field can be requested in your GraphQL query:

```graphql
query {
  post {
    title
    status
    _editingUrl
  }
}
```

### Using `data-datocms-content-link-source`

For elements without visible stega-encoded content, use the [`data-datocms-content-link-source`](https://github.com/datocms/content-link?tab=readme-ov-file#stamping-elements-via-data-datocms-content-link-source) attribute to attach stega metadata directly:

```vue
<template>
  <!-- product.asset.video.alt contains stega-encoded info -->
  <video
    :src="product.asset.video.url"
    :data-datocms-content-link-source="product.asset.video.alt"
    controls
  />
</template>
```

This is useful for structural elements like `<video>`, `<audio>`, or `<iframe>` where stega encoding in visible text would be problematic.

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
