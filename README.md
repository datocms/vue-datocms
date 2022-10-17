# vue-datocms

![MIT](https://img.shields.io/npm/l/vue-datocms?style=for-the-badge) ![MIT](https://img.shields.io/npm/v/vue-datocms?style=for-the-badge) [![Build Status](https://img.shields.io/travis/datocms/vue-datocms?style=for-the-badge)](https://travis-ci.org/datocms/vue-datocms)

A set of components and utilities to work faster with [DatoCMS](https://www.datocms.com/) in Vue.js environments. Integrates seamlessy with [DatoCMS's GraphQL Content Delivery API](https://www.datocms.com/docs/content-delivery-api).

- Works with Vue 3 and Vue 2;
- TypeScript ready;
- Compatible with any data-fetching library (axios, Apollo);
- Usable both client and server side;
- Compatible with vanilla Vue, Nuxt.js and pretty much any other Vue-based solution;

<br /><br />
<a href="https://www.datocms.com/">
<img src="https://www.datocms.com/images/full_logo.svg" height="60">
</a>
<br /><br />

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Demos](#demos)
- [Live real-time updates](#live-real-time-updates)
- [Development](#development)

## Features

`vue-datocms` contains Vue components ready to use, helpers functions and usage examples.

Components:

- [`<DatocmsImage />`](src/components/Image)
- [`<DatocmsStructuredText />`](src/components/StructuredText)

Composables:

- [`useQuerySubscription`](src/composables/useQuerySubscription)
- [`useSiteSearch`](src/composables/useSiteSearch)

Helpers:

- [`toHead`](src/lib/toHead)

## Demos

- Pure Vue: [https://vue-datocms-example.netlify.com/](https://vue-datocms-example.netlify.com/)
- Server side rendering with Nuxt.js: [https://vue-datocms-components.now.sh](https://vue-datocms-components.now.sh)

## Installation

```
npm install vue-datocms
```

# Development

This repository contains a number of demos/examples. You can use them to locally test your changes to the package:

```
npm install
cd examples/vite-typescript-vue3
npm run setup
npm run dev
```

Due to the way Vue and VueDemi work, it's not recommended to leverage `npm link`: that would complicate the structure of each example and it would not replicate a real-world installation. Therefore the `npm run setup` packs and installs the local copy of `vue-datocms` via a `.tgz` compressed tarball.