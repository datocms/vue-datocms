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
  /** The initial data to use while the initial request is being performed */
  initialData?: QueryResult;
} & SubscribeToQueryOptions<QueryResult, QueryVariables>;

export type DisabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled: false | Ref<boolean>;
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
