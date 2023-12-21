<script setup lang="ts">
  
import { ref, onMounted, h } from 'vue';

import { Image, StructuredText } from 'vue-datocms'

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
        <Image v-if="post.coverImage" :data="post.coverImage.responsiveImage"/>
        <StructuredText :data="post.excerpt" />
      </div>
    </div>
  </div>
</template>

<style>
</style>
