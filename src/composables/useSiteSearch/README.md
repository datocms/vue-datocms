# Site Search composable

`useSiteSearch` is a Vue composable that you can use to render a [DatoCMS Site Search](https://www.datocms.com/docs/site-search) widget.
The hook only handles the form logic: you are in complete and full control of how your form renders down to the very last component, class or style.

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Site Search composable](#site-search-composable)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Reference](#reference)
  - [Initialization options](#initialization-options)
  - [Returned data](#returned-data)
  - [Complete example](#complete-example)
<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

To perform the necessary API requests, this hook requires a [DatoCMS CMA Client](https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients) instance, so make sure to also add the following package to your project:

```bash
npm install --save vue-datocms @datocms/cma-client-browser
```

## Reference

Import `useSiteSearch` from `vue-datocms` and use it inside your components like this:

```js
import { useSiteSearch } from 'vue-datocms';
import { buildClient } from '@datocms/cma-client-browser';

const client = buildClient({ apiToken: 'YOUR_API_TOKEN' });

const { state, error, data } = useSiteSearch({
  client,
  buildTriggerId: '7497',
  // optional: by default fuzzy-search is not active
  fuzzySearch: true,
  // optional: you can omit it you only have one locale, or you want to find results in every locale
  initialState: { locale: 'en' },
  // optional: defaults to 8 search results per page
  resultsPerPage: 10,
});
```

For a complete walk-through, please refer to the [DatoCMS Site Search documentation](https://www.datocms.com/docs/site-search).

## Initialization options

| prop                | type                | required           | description                                                                                                                                | default |
| ------------------- | ------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| client              | CMA Client instance | :white_check_mark: | [DatoCMS CMA Client](https://www.datocms.com/docs/content-management-api/using-the-nodejs-clients) instance                                |         |
| buildTriggerId      | string              | :white_check_mark: | The [ID of the build trigger](https://www.datocms.com/docs/site-search/base-integration#performing-searches) to use to find search results |         |
| fuzzySearch         | boolean             | :x:                | Whether fuzzy-search is active or not. When active, it will also find strings that approximately match the query provided.                 | false   |
| resultsPerPage      | number              | :x:                | The number of search results to show per page                                                                                              | 8       |
| initialState.query  | string              | :x:                | Initialize the form with a specific query                                                                                                  | ''      |
| initialState.locale | string              | :x:                | Initialize the form starting from a specific page                                                                                          | 0       |
| initialState.page   | string              | :x:                | Initialize the form with a specific locale selected                                                                                        | null    |

## Returned data

The hook returns an object with the following shape:

```typescript
{
  state: {
    query: string;
    locale: string | undefined;
    page: number;
  },
  error?: string,
  data?: {
    pageResults: Array<{
      id: string;
      title: string;
      titleHighlights: ResultHighlight[];
      bodyExcerpt: string;
      bodyHighlights: ResultHighlight[];
      url: string;
      raw: RawSearchResult;
    }>;
    totalResults: number;
    totalPages: number;
  },
}
```

`titleHighlights` and `bodyHighlights` have the following shape:

```typescript
type ResultHighlight = HighlightPiece[]

type HighlightPiece = {
  text: string;
  isMatch: boolean;
}
```

- The `state` property reflects the current state of the form (the current `query`, `page`, and `locale`), and offers a number of functions to change the state itself. As soon as the state of the form changes, a new API request is made to fetch the new search results;
- The `error` property returns a string in case of failure of any API request;
- The `data` property returns all the information regarding the current search results to present to the user;

## Complete example

See the site-search [`App.vue`](/examples/site-search/src/App.vue) for a usage example.
