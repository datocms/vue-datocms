import { onMounted, ref } from "vue";

type UseDatoParams = {
  query: string;
  apiToken: string;
  variables?: Record<string, any>;
  baseUrl?: string;
  preview?: boolean;
  environment?: string;
};

export function useDato({
  query,
  variables,
  baseUrl,
  preview,
  environment,
  apiToken,
}: UseDatoParams) {
  const data = ref<Record<string, any> | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  onMounted(async () => {
    loading.value = true;
    data.value = null;
    error.value = null;

    let endpoint = baseUrl || "https://graphql.datocms.com";

    if (environment) {
      endpoint += `/environments/${environment}`;
    }

    if (preview) {
      endpoint += `/preview`;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ query, variables }),
      });

      const responseBody = await response.json();

      if (responseBody.errors) {
        error.value = responseBody.errors;
      } else {
        data.value = responseBody.data;
      }
    } catch (err) {
      error.value = err.message;
    }
    loading.value = false;
  });

  return {
    data,
    loading,
    error,
  };
}
