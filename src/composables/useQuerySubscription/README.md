# Live real-time updates

`useQuerySubscription` is a Vue composable that you can use to implement client-side updates of the page as soon as the content changes. It uses DatoCMS's [Real-time Updates API](https://www.datocms.com/docs/real-time-updates-api/api-reference) to receive the updated query results in real-time, and is able to reconnect in case of network failures.

Live updates are great both to get instant previews of your content while editing it inside DatoCMS, or to offer real-time updates of content to your visitors (ie. news site).

`useQuerySubscription` is based on the `subscribeToQuery` helper provided by the [datocms-listen](https://www.npmjs.com/package/datocms-listen) package that provide real-time updates for the page when the content changes. Please consult the [datocms-listen package documentation](https://www.npmjs.com/package/datocms-listen) to learn more about how to configure `subscribeToQuery`.

Live updates are great both to get instant previews of your content while editing it inside DatoCMS, or to offer real-time updates of content to your visitors (ie. news site).

## Table of Contents

**Table of Contents**

- [Installation](#installation)
- [Reference](#reference)
- [Initialization options](#initialization-options)
- [Connection status](#connection-status)
- [Error object](#error-object)
- [Example](#example)

## Installation

```
npm install --save vue-datocms
```

## Reference

Import `useQuerySubscription` from `vue-datocms` and use it inside your components setup function like this:

```js
const {
  data: QueryResult | undefined,
  error: ChannelErrorData | null,
  status: ConnectionStatus,
} = useQuerySubscription(options: Options);
```

## Initialization options

| prop               | type                                                                                      | required           | description                                                        | default                              |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------ | ------------------------------------ |
| enabled            | boolean                                                                                   | :x:                | Whether the subscription has to be performed or not                | true                                 |
| query              | string                                                                                    | :white_check_mark: | The GraphQL query to subscribe                                     |                                      |
| token              | string                                                                                    | :white_check_mark: | DatoCMS API token to use                                           |                                      |
| variables          | Object                                                                                    | :x:                | GraphQL variables for the query                                    |                                      |
| preview            | boolean                                                                                   | :x:                | If true, the Content Delivery API with draft content will be used  | false                                |
| environment        | string                                                                                    | :x:                | The name of the DatoCMS environment where to perform the query     | defaults to primary environment      |
| initialData        | Object                                                                                    | :x:                | The initial data to use on the first render                        |                                      |
| reconnectionPeriod | number                                                                                    | :x:                | In case of network errors, the period (in ms) to wait to reconnect | 1000                                 |
| fetcher            | a [fetch-like function](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)       | :x:                | The fetch function to use to perform the registration query        | window.fetch                         |
| eventSourceClass   | an [EventSource-like](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) class | :x:                | The EventSource class to use to open up the SSE connection         | window.EventSource                   |
| baseUrl            | string                                                                                    | :x:                | The base URL to use to perform the query                           | `https://graphql-listen.datocms.com` |

## Connection status

The `status` property represents the state of the server-sent events connection. It can be one of the following:

- `connecting`: the subscription channel is trying to connect
- `connected`: the channel is open, we're receiving live updates
- `closed`: the channel has been permanently closed due to a fatal error (ie. an invalid query)

## Error object

| prop     | type   | description                                             |
| -------- | ------ | ------------------------------------------------------- |
| code     | string | The code of the error (ie. `INVALID_QUERY`)             |
| message  | string | An human friendly message explaining the error          |
| response | Object | The raw response returned by the endpoint, if available |

## Example

See the query-subscription [`App.vue`](/examples/query-subscription/src/App.vue) for a usage example.
