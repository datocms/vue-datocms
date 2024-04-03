import { watchEffect, reactive, ref, computed, Ref, toRaw } from 'vue';

type SearchResultInstancesHrefSchema = {
  page?: {
    offset?: number;
    limit?: number;
    [k: string]: unknown;
  };
  filter: {
    fuzzy?: string | boolean;
    query: string;
    build_trigger_id?: string;
    locale?: string;
    [k: string]: unknown;
  };
  [k: string]: unknown;
};

type SearchResultInstancesTargetSchema = {
  data: RawSearchResult[];
  meta: {
    total_count: number;
  };
};

export type RawSearchResult = {
  type: 'search_result';
  id: string;
  attributes: {
    title: string;
    body_excerpt: string;
    url: string;
    score: number;
    highlight: {
      title?: string[] | null;
      body?: string[] | null;
    };
  };
};

export declare class GenericClient {
  config: {
    apiToken: string | null;
  };
  searchResults: {
    rawList(
      queryParams: SearchResultInstancesHrefSchema,
    ): Promise<SearchResultInstancesTargetSchema>;
  };
}

export type UseSiteSearchConfig<Client extends GenericClient> = {
  client: Client;
  buildTriggerId: string;
  fuzzySearch?: boolean;
  resultsPerPage?: number;
  initialState?: {
    locale?: string;
    page?: number;
    query?: string;
  };
};

type HighlightPiece = {
  text: string;
  isMatch: boolean;
};

type ResultHighlight = HighlightPiece[];

type SearchResult = {
  id: string;
  title: string;
  titleHighlights: ResultHighlight[];
  bodyExcerpt: string;
  bodyHighlights: ResultHighlight[];
  url: string;
  raw: RawSearchResult;
};

export type UseSiteSearchData = {
  pageResults: SearchResult[];
  totalResults: number;
  totalPages: number;
};

export type UseSiteSearchResult = {
  state: {
    query: string;
    locale: string | undefined;
    page: number;
  };
  data?: Ref<UseSiteSearchData>;
  error: Ref<string | undefined>;
};

const highlightPieces = (textWithHighlightMarker: string): ResultHighlight => {
  return textWithHighlightMarker
    .split(/\[h\](.+?)\[\/h\]/g)
    .map((text, index) => ({
      text,
      isMatch: index % 2 === 1,
    }));
};

export function useSiteSearch<Client extends GenericClient>(
  config: UseSiteSearchConfig<Client>,
): UseSiteSearchResult {
  const state = reactive<{
    query: string;
    page: number;
    locale: string | undefined;
  }>({
    query: config.initialState?.query || '',
    page: config.initialState?.page || 0,
    locale: config.initialState?.locale,
  });

  const error = ref<string | undefined>();
  const response = reactive<SearchResultInstancesTargetSchema>({
    data: [],
    meta: { total_count: 0 },
  });

  error.value = undefined;

  const resultsPerPage = config.resultsPerPage || 8;

  watchEffect((onCleanup) => {
    let isCancelled = false;

    const run = async () => {
      try {
        if (!state.query) {
          response.data = [];
          response.meta = { total_count: 0 };
          return;
        }

        const request: SearchResultInstancesHrefSchema = {
          filter: {
            query: state.query,
            locale: state.locale,
            build_trigger_id: config.buildTriggerId,
          },
          page: {
            limit: resultsPerPage,
            offset: resultsPerPage * state.page,
          },
        };

        if (config.fuzzySearch) {
          request.fuzzy = 'true';
        }

        const results = await config.client.searchResults.rawList(request);

        if (!isCancelled) {
          response.data = results.data;
          response.meta.total_count = results.meta.total_count;
        }
      } catch (e) {
        if (isCancelled) {
          return;
        }

        if (e instanceof Error) {
          error.value = e.message;
        } else {
          error.value = 'Unknown error!';
        }
      }
    };

    run();

    onCleanup(() => {
      isCancelled = true;
    });
  });

  const data = computed<UseSiteSearchData>(() => {
    return state.query && response.data.length > 0
      ? {
          pageResults: response.data.map((rawSearchResult) => ({
            id: rawSearchResult.id,
            url: rawSearchResult.attributes.url,
            title: rawSearchResult.attributes.title,
            titleHighlights: rawSearchResult.attributes.highlight.title
              ? rawSearchResult.attributes.highlight.title.map(highlightPieces)
              : [],
            bodyExcerpt: rawSearchResult.attributes.body_excerpt,
            bodyHighlights: rawSearchResult.attributes.highlight.body
              ? rawSearchResult.attributes.highlight.body.map(highlightPieces)
              : [],
            raw: toRaw(rawSearchResult),
          })),
          totalResults: response.meta.total_count,
          totalPages: Math.ceil(response.meta.total_count / resultsPerPage),
        }
      : {
          pageResults: [],
          totalResults: 0,
          totalPages: 0,
        };
  });

  return {
    state,
    error,
    data,
  };
}
