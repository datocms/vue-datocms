<template>
  <div id="app">
    <h1>Last 3 posts from the blog</h1>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); grid-gap: 1rem;">
      <div v-for="post in blogPosts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <DatocmsImage v-if="post.coverImage" :data="post.coverImage.responsiveImage"/>
        <DatocmsStructuredText :data="post.excerpt" />
      </div>
    </div>
    <hr />
    <DatocmsStructuredText :data="st" />
  </div>
</template>

<script>

import { Image, StructuredText } from 'vue-datocms'

export default {
  name: 'App',
  data: () => ({
    blogPosts: [],
    st: {
      value: {
        schema: 'dast',
        document: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  url: 'mailto:test@tests.com',
                  type: 'link',
                  children: [
                    {
                      type: 'span',
                      value: 'test@test.com',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
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
                  src width height alt base64
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
