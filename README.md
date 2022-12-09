# vue-datocms

![MIT](https://img.shields.io/npm/l/vue-datocms?style=for-the-badge) ![NPM](https://img.shields.io/npm/v/vue-datocms?style=for-the-badge) [![Build Status](https://img.shields.io/github/workflow/status/datocms/vue-datocms/Node.js%20CI?style=for-the-badge)](https://github.com/datocms/vue-datocms/actions/workflows/node.js.yml)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in Vue.js environments. Integrates seamlessy with [DatoCMS's GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api).

- Works with Vue 3 and Vue 2;
- TypeScript ready;
- Compatible with any data-fetching library (axios, Apollo);
- Usable both client and server side;
- Compatible with vanilla Vue and pretty much any other Vue-based solution.

<br /><br />
<a href="https://www.datocms.com/">
<img src="https://www.datocms.com/images/full_logo.svg" height="60">
</a>
<br /><br />

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Development](#development)

## Features

`vue-datocms` contains Vue components ready to use, helpers functions and usage examples.

[Components](https://vuejs.org/guide/essentials/component-basics.html):

- [`<DatocmsImage />`](src/components/Image)
- [`<DatocmsStructuredText />`](src/components/StructuredText)

[Composables](https://vuejs.org/guide/reusability/composables.html):

- [`useQuerySubscription`](src/composables/useQuerySubscription)
- [`useSiteSearch`](src/composables/useSiteSearch)

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
- [Vue 2 + Javacript + Vue CLI](examples/vue-cli-babel-javascript-vue2/) ([running demo](https://vue-datocms-vue-cli-babel-javascript-vue2-example.vercel.app/))
- [Query subscription](examples/query-subscription/) ([running demo](https://vue-datocms-query-subscription-example.vercel.app/))
- [Site search](examples/site-search/) ([running demo](https://vue-datocms-site-search-example.vercel.app/))

To use them, follow this recipe starting from the vue-datocms folder:

```bash
npm install
cd examples/vite-typescript-vue3
npm run setup
npm run dev
```

Due to the way Vue and VueDemi work, it's not recommended to leverage `npm link` to use the working copy from the examples: that would complicate the structure of each example and it would not replicate a real-world installation. Therefore the `npm run setup` available in each example packs and installs the local copy of `vue-datocms` via a `.tgz` compressed tarball.
