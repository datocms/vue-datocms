<script setup lang="ts">

import { useSiteSearch } from 'vue-datocms'

import { buildClient } from '@datocms/cma-client-browser';

const client = buildClient({ apiToken: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964' });

const { state, error, data } = useSiteSearch({
  client,
  buildTriggerId: '7497',
  // optional: by default fuzzy-search is not active
  fuzzySearch: true,
  // optional: you can omit it you only have one locale, or you want to find results in every locale
  initialState: { locale: 'en' },
  // optional: defaults to 8 search results per page
  resultsPerPage: 10,
})

</script>

<template>
  <div class="container mx-auto">
    <div class="py-8">
      <input class="w-full p-4 border border-solid border-gray-300 rounded" type="text" v-model="state.query" placeholder="Search... " />
    </div>
    <hr />
    <div class="py-8" v-if="data">
      <div v-for="result in data.pageResults" class="py-4">
        <p class="py-1">
          <strong v-if="result.titleHighlights.length > 0">
            <template v-for="highlight in result.titleHighlights" class="py-1">
              <template v-for="piece in highlight">
                <mark v-if="piece.isMatch">{{ piece.text }}</mark>
                <template v-else>{{ piece.text }}</template>
              </template>
            </template>
          </strong>
          <strong v-else>{{ result.title }}</strong>
        </p>
        <p v-for="highlight in result.bodyHighlights" class="py-1">
          <template v-for="piece in highlight">
            <mark v-if="piece.isMatch">{{ piece.text }}</mark>
            <template v-else>{{ piece.text }}</template>
          </template>
        </p>
        <div>
          <pre><code class="block whitespace-pre overflow-x-scroll">{{ JSON.stringify(result.raw, null, 2) }}</code></pre>
        </div>
      </div>  
    </div>
  </div>
</template>
