import { Ref, ref, watchEffect } from 'vue-demi';

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
  enabled?: true;
  /** The initial data to use while the initial request is being performed */
  initialData?: QueryResult;
} & SubscribeToQueryOptions<QueryResult, QueryVariables>;

export type DisabledQueryListenerOptions<QueryResult, QueryVariables> = {
  /** Whether the subscription has to be performed or not */
  enabled: false;
  /** The initial data to use while the initial request is being performed */
  initialData?: QueryResult;
} & Partial<SubscribeToQueryOptions<QueryResult, QueryVariables>>;

export type QueryListenerOptions<QueryResult, QueryVariables> =
  | EnabledQueryListenerOptions<QueryResult, QueryVariables>
  | DisabledQueryListenerOptions<QueryResult, QueryVariables>;

export function useQuerySubscription<
  QueryResult = any,
  QueryVariables = Record<string, any>,
>(options: QueryListenerOptions<QueryResult, QueryVariables>) {
  const { enabled, initialData, ...other } = options;

  const error = ref<ChannelErrorData | null>(null);
  const data = ref<QueryResult | null>(null) as Ref<QueryResult | null>;
  const status = ref<ConnectionStatus>(
    enabled ? 'connecting' : 'closed',
  );

  const subscribeToQueryOptions = other as EnabledQueryListenerOptions<
    QueryResult,
    QueryVariables
  >;

  watchEffect((onCleanup) => {
    if (enabled === false) {
      status.value = 'closed';

      return () => {
        // we don't have to perform any uninstall
      };
    }

    let unsubscribe: UnsubscribeFn | null;

    async function subscribe() {
      unsubscribe = await subscribeToQuery<QueryResult, QueryVariables>({
        ...subscribeToQueryOptions,
        onStatusChange: (connectionStatus) => {
          status.value = connectionStatus;
        },
        onUpdate: (updateData) => {
          error.value = null;
          data.value = updateData.response.data;
        },
        onChannelError: (errorData) => {
          data.value = null;
          error.value = errorData;
        },
      });
    }

    subscribe();

    onCleanup(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    })
  });

  return { error, status, data: data || initialData };
}