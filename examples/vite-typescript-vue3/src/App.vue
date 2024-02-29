<script setup lang="ts">

import { onMounted, ref } from 'vue';

import { Image, StructuredText, VideoPlayer } from 'vue-datocms';

const video = ref({
  muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
  title: 'Title',
  width: 1080,
  height: 1920,
  blurUpThumb:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLDhAWDhYQDg0NDhUVFg0OFxUZGBYfFiEaHysjHR0oHRUWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OEA4QEC8dFhwvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIABkADgMBIgACEQEDEQH/xAAYAAEAAwEAAAAAAAAAAAAAAAADBAUGAf/EABwQAAICAgMAAAAAAAAAAAAAAAEDAAIEEQUGIf/EABUBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGBEAAgMAAAAAAAAAAAAAAAAAAAIBITH/2gAMAwEAAhEDEQA/AByuKdRJlXTiXWJkfI7bkOprUJPYnAHcSzQXizNl9teCCXuB8EWckUjaf//Z',
});

const videoPlayer = ref();

const blogPosts = ref<any[]>([])

onMounted(async () => {
  const response = await fetch('https://graphql.datocms.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: "Bearer faeb9172e232a75339242faafb9e56de8c8f13b735f7090964",
    },
    body: JSON.stringify({
      query: `
        query RecentBlogPosts {
          allBlogPosts(first: "3") {
            title
            excerpt {
              value
            }
            coverImage {
              responsiveImage {
                src width height alt base64
              }
            }
          }
        }
      `
    })
  })

  const { data } = await response.json()

  blogPosts.value = data.allBlogPosts
})

</script>

<template>
  <div>
    <h1>Last 3 posts from the blog</h1>

    <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 1rem;">
      <div v-for="post in blogPosts">
        <h2>{{ post.title }}</h2>
        <Image v-if="post.coverImage" :data="post.coverImage.responsiveImage" />
        <StructuredText :data="post.excerpt" />
      </div>
    </div>

    <h1>Video examples</h1>
    <hr />
    <VideoPlayer :data="video" class="video-player" controls :auto-play="'muted'" :disable-cookies="false"
      @pause="console.log" @playing="console.log" />
    <hr />
    <VideoPlayer :data="video" :style="{ aspectRatio: '1 / 1' }" accent-color="#ffff00" :disable-cookies="true" />
    <hr />
    <VideoPlayer :data="video" :style="{ aspectRatio: undefined }" accent-color="#ffff00" />
    <hr />
    <VideoPlayer :data="video" :style="{ aspectRatio: '10 / 1', '--controls': 'none', '--media-object-fit': 'cover' }"
      auto-play="muted" loop />
    <hr />
    <VideoPlayer :data="video" :style="undefined" auto-play="muted" />
    <hr />
    <VideoPlayer :data="{ playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY' }" />

  </div>
</template>

<style></style>
