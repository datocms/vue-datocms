<template>
  <div id="app">
    <h1>Last 3 posts from the blog</h1>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 1rem;">
      <div v-for="post in blogPosts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <DatocmsImage :data="post.coverImage.responsiveImage"/>
        <DatocmsStructuredText :data="post.excerpt" />
      </div>
    </div>
  </div>
</template>

<script>

import { Image, StructuredText } from 'vue-datocms'

export default {
  name: 'App',
  data: () => ({
    blogPosts: [],
  }),
  components: {
    DatocmsImage: Image,
    DatocmsStructuredText: StructuredText,
  },
  async mounted() {
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
              id
              title
              excerpt {
                value
              }
              coverImage {
                responsiveImage {
                  alt
                  aspectRatio
                  base64
                  bgColor
                  height
                  sizes
                  src
                  srcSet
                  title
                  webpSrcSet 
                  width
                }
              }
            }
          }
        `
      })
    })

    const { data } = await response.json()

    this.blogPosts = data.allBlogPosts    
  }
}
</script>

<style>
</style>
