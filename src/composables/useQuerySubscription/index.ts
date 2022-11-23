import { Ref, ref, unref, watchEffect } from 'vue-demi';

import {
  subscribeToQuery,
  UnsubscribeFn,
  ChannelErrorData,
  ConnectionStatus,
  Options,
} from 'datocms-listen';

export type SubscribeToQueryOptions<QueryResult, QueryVariables> = Omit<
  Options<QueryResult, QueryVariables>,
  'onStatusChange' | 'onUpdate' | 'onChannelError'
>;


export type EnabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled?: true | Ref<boolean>;
  //               ↑ ↑ ↑ ↑ ↑ ↑
  // I would expect to be able to declare here:
  // 
  //     enabled?: true | Ref<true>;
  // 
  // but Typescript forces me not to do that. Here is a possible explanation.
  // 
  // If I declare `Ref<true>`, when I call a function accepting an `EnabledQueryListenerOptions`,
  // I actually pass a `Ref<boolean>` in most of the cases, and Typescript reports an error.
  // 
  // And rightfully so, 'cause a `Ref<boolean>` is a bigger type then `Ref<true>`:
  // the set of possible values for `Ref<boolean>` is larger than the set for `Ref<true>`.
  //   
  // The `true` type is instead well accepted. Why? What's the difference between
  // the types `true` and `Ref<true>`? I don't have a proper answer to the question.
  // 
  // My guess is that when I give to a function a value that belongs to
  // a type that is passed by value (like `true`), Typescript can infer more
  // information compared to the case when I pass an argument by reference
  // (like the `Ref` case). So, adopting a conservative approach, the language
  // reports an error.
  // 
  // So, maybe, Typescript is able to take into consideration that a `const enabled = true`,
  // once passed to a function, will always be true, while a `const enabled = ref(true)` 
  // results in a `{ value: true }`. In this latter case, the content of the object could be changed,
  // e.g. by the function that I pass the value `enabled` to. So — maybe — Typescript is able to
  // take all this into consideration and treat the different type in very different ways.
  // 
  /** The initial data to use while the initial request is being performed */
  initialData?: QueryResult;
} & SubscribeToQueryOptions<QueryResult, QueryVariables>;

export type DisabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled: false | Ref<false>;
  /** The initial data to use while the initial request is being performed */
  initialData?: QueryResult;
} & Partial<SubscribeToQueryOptions<QueryResult, QueryVariables>>;

export type QueryListenerOptions<QueryResult, QueryVariables> =
  | EnabledQueryListenerOptions<QueryResult, QueryVariables>
  | DisabledQueryListenerOptions<QueryResult, QueryVariables>;

export const useQuerySubscription = <
  QueryResult = any,
  QueryVariables = Record<string, any>,
>(
  { enabled = true, initialData, query, token, ...other }: QueryListenerOptions<QueryResult, QueryVariables>
) => {
  const error = ref<ChannelErrorData | null>(null);
  const data = ref(unref(initialData) || null);
  const status = ref<ConnectionStatus>(unref(enabled) ? "connecting" : "closed");

  const subscribeToQueryOptions = other;

  watchEffect(async (onCleanup) => {
    if (query && token && unref(enabled)) {
      const unsubscribe = await subscribeToQuery({
        ...subscribeToQueryOptions,
        query,
        token,
        onStatusChange: (connectionStatus) => {
          status.value = connectionStatus;
        },
        onUpdate: ({ response }) => {
          error.value = null;
          data.value = response.data;
        },
        onChannelError: (errorData) => {
          data.value = null;
          error.value = errorData;
        },
      })
  
      onCleanup(unsubscribe)
    }
  })
  
  return { data, status, error }
}
