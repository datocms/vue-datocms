<!--datocms-autoinclude-header start-->

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60"></a>

👉 [Visit the DatoCMS homepage](https://www.datocms.com) or see [What is DatoCMS?](#what-is-datocms)

---

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

- [vue-datocms](#vue-datocms)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
  - [Development](#development)
- [What is DatoCMS?](#what-is-datocms)

## Features

`vue-datocms` contains Vue components ready to use, helpers functions and usage examples.

[Components](https://vuejs.org/guide/essentials/component-basics.html):

- [`<ContentLink />`](src/components/ContentLink) for Visual Editing with click-to-edit overlays
- [`<Image />` and `<NakedImage />`](src/components/Image)
- [`<VideoPlayer />`](src/components/VideoPlayer)
- [`<StructuredText />`](src/components/StructuredText)

[Composables](https://vuejs.org/guide/reusability/composables.html):

- [`useContentLink`](src/composables/useContentLink) for Visual Editing
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

# Demos

For fully working examples take a look at our [examples directory](https://github.com/datocms/vue-datocms/tree/master/examples).

Live demo: [https://vue-datocms-example.netlify.com/](https://vue-datocms-example.netlify.com/)

```
## Development

This repository contains a number of demos/examples. You can use them to locally test your changes.

```bash
cd examples
npm setup
npm run dev
```

<!--datocms-autoinclude-footer start-->

---

# What is DatoCMS?

<a href="https://www.datocms.com/"><img src="https://www.datocms.com/images/full_logo.svg" height="60" alt="DatoCMS - The Headless CMS for the Modern Web"></a>

[DatoCMS](https://www.datocms.com/) is Headless CMS for the modern web. Trusted by 25,000+ businesses, agencies, and individuals, it gives your team one place to manage content and ship it to any website, app, or device via API.

**New here?** Start with [Create free account](https://dashboard.datocms.com/signup) and the [Documentation](https://www.datocms.com/docs). Stuck? Ask the [Community](https://community.datocms.com/). Curious what's new? [Product Updates](https://www.datocms.com/product-updates).

**Building with AI:** [Agent Skills](https://www.datocms.com/docs/agent-skills) turn coding assistants (Claude Code, Cursor) into expert DatoCMS developers, with full read/write via the auto-installed CLI. No local terminal? Use the [MCP Server](https://www.datocms.com/docs/mcp-server) instead.

**Talking to DatoCMS from code:**
- [Content Delivery API](https://www.datocms.com/docs/content-delivery-api) (CDA) — the fast, read-only GraphQL API your website/app uses to **fetch** published content.
- [Content Management API](https://www.datocms.com/docs/content-management-api) (CMA) — the REST API for **creating and updating** content, models, and project settings (think scripts, migrations, integrations).
- [CLI](https://www.datocms.com/docs/scripting-migrations/installing-the-cli) — terminal tool for schema migrations and importing from Contentful/WordPress.

**Framework guides:** end-to-end recipes for fetching content, rendering Structured Text, optimizing images/video, handling SEO, and setting up live preview with visual editing in [Next.js](https://www.datocms.com/docs/next-js), [Nuxt](https://www.datocms.com/docs/nuxt), [Svelte](https://www.datocms.com/docs/svelte), and [Astro](https://www.datocms.com/docs/astro).

**Want a head start?** Browse our [starter projects](https://www.datocms.com/marketplace/starters) — ready-to-deploy example sites for popular frameworks.


<!--datocms-autoinclude-footer end-->
