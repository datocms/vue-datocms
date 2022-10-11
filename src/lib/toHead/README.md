## Social share, SEO and Favicon meta tags

Just like the image component, `toHead()` is a helper specially designed to work seamlessly with DatoCMS’s [`_seoMetaTags` and `faviconMetaTags` GraphQL queries](https://www.datocms.com/docs/content-delivery-api/seo) so that you can handle proper SEO in your pages.

You can use `toHead()` inside the `metaInfo` (or `head`, in Nuxt.js) property of your components, and it will return meta tags as required by the [`vue-meta`](https://vue-meta.nuxtjs.org/guide/metainfo.html) package.

### Table of contents

- [Usage](#usage)
- [Example](#example)

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
import { request } from './lib/datocms';
import { toHead } from 'vue-datocms';

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