<script setup lang="ts">
import { useSiteSearch } from 'vue-datocms';

import { buildClient } from '@datocms/cma-client-browser';

const client = buildClient({
  apiToken: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
});

const { state, error, data } = useSiteSearch({
  client,
  buildTriggerId: '7497',
  // optional: by default fuzzy-search is not active
  fuzzySearch: true,
  // optional: you can omit it you only have one locale, or you want to find results in every locale
  initialState: { locale: 'en' },
  // optional: defaults to 8 search results per page
  resultsPerPage: 5,
});
</script>

<template>
  <div class="example" data-title="Basic example">
    <div>
      <div>
        <input
          type="text"
          v-model="state.query"
          placeholder='Search: try something like "vue" or "dato"... '
        />
      </div>
    </div>
    <div v-if="data">
      <div>
        <strong>{{ data.totalResults }} results</strong>
      </div>
      <div class="results">
        <div v-for="result in data.pageResults" class="result">
          <div class="result-title">
            <a :href="result.url">
              <strong v-if="result.titleHighlights.length > 0">
                <template v-for="highlight in result.titleHighlights">
                  <template v-for="piece in highlight">
                    <mark v-if="piece.isMatch">{{ piece.text }}</mark>
                    <template v-else>{{ piece.text }}</template>
                  </template>
                </template>
              </strong>
              <strong v-else>{{ result.title }}</strong>
            </a>
          </div>
          <div class="result-highlights">
            <div v-for="highlight in result.bodyHighlights">
              <template v-for="piece in highlight">
                <mark v-if="piece.isMatch">{{ piece.text }}</mark>
                <template v-else>{{ piece.text }}</template>
              </template>
            </div>
          </div>
          <details>
            <summary>Raw results</summary>
            <pre>{{ JSON.stringify(result.raw, null, 2) }}</pre>
          </details>
        </div>
      </div>
      <div>
        <div>
          <button v-if="state.page > 0" @click="state.page = state.page - 1">
            Previous
          </button>
          <button
            v-if="state.page < data.totalPages"
            @click="state.page = state.page + 1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
input {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.result {
  margin: 1rem 0;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  gap: 1em;
  
  pre {
    font-size: 0.8em;
    background-color: #fefefe;
    padding: 1rem;
    overflow: hidden;
    width: 100%;
  }

  details {
    overflow: hidden;
  }
}

.result-title {
  a {
    color: inherit;
  }
}

.result-highlights {
  color: #666;
  font-size: 0.8em;

  mark {
    background: yellow;
  }


}
</style>
