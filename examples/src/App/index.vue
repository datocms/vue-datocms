<script setup lang="ts">
import ImageExamples from '../ImageExamples/index.vue';
import NakedImageExamples from '../NakedImageExamples/index.vue';
import QuerySubscriptionExample from '../QuerySubscriptionExample/index.vue';
import VideoExamples from '../VideoExamples/index.vue';
import SiteSearch from '../SiteSearch/index.vue';
</script>

<template>
  <nav>
    <a href="#naked-image">NakedImage</a>
    <a href="#image">Image</a>
    <a href="#subscriptions">Query Subscription</a>
    <a href="#site-search">Site Search</a>
    <a href="#video">Video</a>
  </nav>

  <a id="naked-image" />
  <h1>NakedImage examples</h1>
  <NakedImageExamples />

  <a id="image" />
  <h1>Image examples</h1>
  <ImageExamples />

  <a id="subscriptions" />
  <h1>Query subscription example</h1>
  <QuerySubscriptionExample />

  <a id="site-search" />
  <h1>Site Search</h1>
  <SiteSearch />

  <a id="video" />
  <h1>Video examples</h1>
  <VideoExamples />
</template>

<style>
nav {
  display: flex;
  gap: 1rem;

  a {
    color: #845ef7;
  }
}

.example {
  border: 1px solid #eee;
  padding: 1rem;
  margin-block: 2rem;
  display: grid;
  gap: 1rem;
  border-radius: 5px;
  overflow: hidden;

  &:before {
    content: attr(data-title);
    font-weight: bold;
    font-size: 1.3em;
  }
}
</style>
