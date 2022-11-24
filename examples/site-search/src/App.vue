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
  resultsPerPage: 9,
})

</script>

<template>
  <div>
    <div class="bg-slate-200 py-4">
      <div class="container mx-auto">
        <input class="py-3 px-5 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400" type="text" v-model="state.query" placeholder="Search: try something like &quot;vue&quot; or &quot;dato&quot;... " />
      </div>
    </div>
    <div class="bg-slate-100 py-4">
      <div class="container mx-auto py-4">
        <h1>{{ data.totalResults}} results</h1>
      </div>
      <div class="container mx-auto py-4 grid grid-cols-3 gap-4" v-if="data">
        <div v-for="result in data.pageResults" class="py-4">
          <div class="py-1">
            <a :href="result.url">
              <strong v-if="result.titleHighlights.length > 0">
                <template v-for="highlight in result.titleHighlights" class="py-1">
                  <template v-for="piece in highlight">
                    <mark v-if="piece.isMatch">{{ piece.text }}</mark>
                    <template v-else>{{ piece.text }}</template>
                  </template>
                </template>
              </strong>
              <strong v-else>{{ result.title }}</strong>
            </a>
          </div>
          <div v-for="highlight in result.bodyHighlights" class="py-1">
            <template v-for="piece in highlight">
              <mark v-if="piece.isMatch">{{ piece.text }}</mark>
              <template v-else>{{ piece.text }}</template>
            </template>
          </div>
          <details>
            <summary>Raw results</summary>
            <pre><code class="block whitespace-pre overflow-x-scroll">{{ JSON.stringify(result.raw, null, 2) }}</code></pre>
          </details>
        </div>  
      </div>
      <div class="container mx-auto py-4">
        <div class="flex">
          <button v-if="state.page > 0" @click="state.page = state.page - 1" class="flex items-center px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200">
            Previous
          </button>
          <button v-if="state.page < data.totalPages" @click="state.page = state.page + 1" class="flex items-center px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform bg-white rounded-md dark:bg-gray-800 dark:text-gray-200 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-gray-200">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
