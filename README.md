<!--datocms-autoinclude-header start-->
<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)
<!--datocms-autoinclude-header end-->

# vue-datocms

[![MIT](https://img.shields.io/npm/l/vue-datocms?style=for-the-badge)](https://github.com/datocms/vue-datocms/blob/master/LICENSE) [![NPM](https://img.shields.io/npm/v/vue-datocms?style=for-the-badge)](https://www.npmjs.com/package/vue-datocms) [![Build Status](https://img.shields.io/github/actions/workflow/status/datocms/vue-datocms/node.js.yml?branch=master&style=for-the-badge)](https://github.com/datocms/vue-datocms/actions/workflows/node.js.yml)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in Vue.js environments. Integrates seamlessly with [DatoCMS's GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api).

- Works with Vue 3 (version 4 is maintained for compatibility with Vue 2);
- TypeScript ready;
- Compatible with any data-fetching library (axios, Apollo);
- Usable both client and server side;
- Compatible with vanilla Vue and pretty much any other Vue-based solution.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Development](#development)

## Features

`vue-datocms` contains Vue components ready to use, helpers functions and usage examples.

[Components](https://vuejs.org/guide/essentials/component-basics.html):

- [`<DatocmsImage />`](src/components/Image)
- [`<DatocmsVideoPlayer />`](src/components/VideoPlayer)
- [`<DatocmsStructuredText />`](src/components/StructuredText)

[Composables](https://vuejs.org/guide/reusability/composables.html):

- [`useQuerySubscription`](src/composables/useQuerySubscription)
- [`useSiteSearch`](src/composables/useSiteSearch)
- [`useVideoPlayer`](src/composables/useVideoPlayer)

Helpers:

- [`toHead`](src/lib/toHead)

## Installation

```
# First, install Vue
npm install vue
# Then install vue-datocms
npm install vue-datocms
```
## Development

This repository contains a number of examples. You can use them to locally test your changes to the package:

- [Vue 3 + TypeScript + Vite](examples/vite-typescript-vue3/) ([running demo](https://vue-datocms-vite-typescript-vue3-example.vercel.app/))
- [Query subscription](examples/query-subscription/) ([running demo](https://vue-datocms-query-subscription-example.vercel.app/))
- [Site search](examples/site-search/) ([running demo](https://vue-datocms-site-search-example.vercel.app/))

To use them, follow this recipe starting from the vue-datocms folder:

```bash
npm install
cd examples/vite-typescript-vue3
npm run setup
npm run dev
```

It's not recommended to leverage `npm link` to use the working copy from the examples: that would complicate the structure of each example and it would not replicate a real-world installation. Therefore the `npm run setup` available in each example packs and installs the local copy of `vue-datocms` via a `.tgz` compressed tarball.

<!--datocms-autoinclude-footer start-->
-----------------
# What is DatoCMS?
<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

[DatoCMS](https://www.datocms.com/) is the REST & GraphQL Headless CMS for the modern web.

Trusted by over 25,000 enterprise businesses, agency partners, and individuals across the world, DatoCMS users create online content at scale from a central hub and distribute it via API. We ❤️ our [developers](https://www.datocms.com/team/best-cms-for-developers), [content editors](https://www.datocms.com/team/content-creators) and [marketers](https://www.datocms.com/team/cms-digital-marketing)!

**Quick links:**

- ⚡️ Get started with a [free DatoCMS account](https://dashboard.datocms.com/signup)
- 🔖 Go through the [docs](https://www.datocms.com/docs)
- ⚙️ Get [support from us and the community](https://community.datocms.com/)
- 🆕 Stay up to date on new features and fixes on the [changelog](https://www.datocms.com/product-updates)

**Our featured repos:**
- [datocms/react-datocms](https://github.com/datocms/react-datocms): React helper components for images, Structured Text rendering, and more
- [datocms/js-rest-api-clients](https://github.com/datocms/js-rest-api-clients): Node and browser JavaScript clients for updating and administering your content. For frontend fetches, we recommend using our [GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api) instead.
- [datocms/cli](https://github.com/datocms/cli): Command-line interface that includes our [Contentful importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-contentful) and [Wordpress importer](https://github.com/datocms/cli/tree/main/packages/cli-plugin-wordpress)
- [datocms/plugins](https://github.com/datocms/plugins): Example plugins we've made that extend the editor/admin dashboard
- [datocms/gatsby-source-datocms](https://github.com/datocms/gatsby-source-datocms): Our Gatsby source plugin to pull data from DatoCMS
- Frontend examples in different frameworks: [Next.js](https://github.com/datocms/nextjs-demo), [Vue](https://github.com/datocms/vue-datocms) and [Nuxt](https://github.com/datocms/nuxtjs-demo), [Svelte](https://github.com/datocms/datocms-svelte) and [SvelteKit](https://github.com/datocms/sveltekit-demo), [Astro](https://github.com/datocms/datocms-astro-blog-demo), [Remix](https://github.com/datocms/remix-example). See [all our starter templates](https://www.datocms.com/marketplace/starters).

Or see [all our public repos](https://github.com/orgs/datocms/repositories?q=&type=public&language=&sort=stargazers)
<!--datocms-autoinclude-footer end-->
