export async function useDatoFetch({ query, variables, preview }) {
  const extraHeaders = {};

  if (preview) {
    extraHeaders['X-Include-Drafts'] = 'true';
  }

  return await useFetch('https://graphql.datocms.com/', {
    method: 'POST',
    body: {
      query,
      variables,
    },
    headers: {
      ...extraHeaders,
      Authorization:
        'Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
    },
  });
}
