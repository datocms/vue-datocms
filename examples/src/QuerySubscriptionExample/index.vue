<script setup lang="ts">
import {
  Image,
  StructuredText,
  toHead,
  useQuerySubscription,
} from 'vue-datocms';
import { useHead } from '@unhead/vue';
import { computed } from 'vue';

const RESPONSIVE_IMAGE_FRAGMENT = `
  aspectRatio
  height
  sizes
  src
  webpSrcSet
  srcSet
  width
  alt
  base64
  title
`;

const META_TAGS_FRAGMENT = `
  attributes
  content
  tag
`;

const query = `
  query AppQuery($first: IntType) {
    page: blog {
      seo: _seoMetaTags {
        ${META_TAGS_FRAGMENT}
      }
    }

    site: _site {
      favicon: faviconMetaTags {
        ${META_TAGS_FRAGMENT}
      }
    }

    blogPosts: allBlogPosts(first: $first, orderBy: _firstPublishedAt_DESC) {
      id
      title
      slug
      excerpt { value }
      coverImage {
        responsiveImage(imgixParams: { w: 550, auto: format }) {
          ${RESPONSIVE_IMAGE_FRAGMENT}
        }
      }
      author {
        name
        avatar {
          responsiveImage(imgixParams: { fit: crop, ar: "1:1", w: 40, auto: format }) {
            ${RESPONSIVE_IMAGE_FRAGMENT}
          }
        }
      }
    }
  }
`;

const { data, error, status } = useQuerySubscription({
  query,
  variables: { first: 4 },
  token: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
});

const metaTags = computed(() =>
  toHead(
    data.value ? [...data.value.page.seo, ...data.value.site.favicon] : [],
  ),
);

const statusMessage = {
  connecting: 'Connecting to DatoCMS...',
  connected: 'Connected to DatoCMS, receiving live updates!',
  closed: 'Connection closed',
};

useHead(metaTags);
</script>

<template>
  <div class="example" data-title="Full-blown example">
    <div class="status">
      <div v-if="status === 'connected'" class="connected-badge" />
      {{ statusMessage[status] }}
    </div>

    <div v-if="error">
      <h1>Error: {{ error.code }}</h1>
      <div>{{ error.message }}</div>

      <pre v-if="error.response">{{
        JSON.stringify(error.response, null, 2)
      }}</pre>
    </div>

    <div class="blogPosts">
      <article
        v-for="blogPost in data?.blogPosts"
        key="{blogPost.id}"
        class="blogPost"
      >
        <Image
          class="blogPost-image"
          :fadeInDuration="1000"
          :data="blogPost.coverImage.responsiveImage"
        />
        <div class="blogPost-content">
          <h6 class="blogPost-title">
            <a
              href="https://www.datocms.com/blog/{{blogPost.slug}}"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ blogPost.title }}
            </a>
          </h6>
          <div class="blogPost-excerpt">
            <StructuredText :data="blogPost.excerpt" />
          </div>
          <footer class="blogPost-author">
            <Image
              class="blogPost-author-image"
              :data="blogPost.author.avatar.responsiveImage"
            />
            Written by {{ blogPost.author.name }}
          </footer>
        </div>
      </article>
    </div>
  </div>
</template>

<style>
.status {
  border-radius: 5px;
  margin-bottom: 1em;
}

.connected-badge {
  display: inline-block;
  position: relative;
  width: 10px;
  height: 10px;
  margin-right: 10px;
}

.connected-badge:after {
  width: 100%;
  height: 100%;
  position: absolute;
  content: "";
  border-radius: 999px;
  background-color: rgba(246, 135, 179, 255);
}

.connected-badge:before {
  width: 100%;
  height: 100%;
  position: absolute;
  content: "";
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  border-radius: 999px;
  background-color: rgba(246, 135, 179, 255);
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.blogPosts {
  @media (min-width: 550px) {
    column-count: 2;
    column-gap: 1rem;
  }
}

.blogPost {
  border: 1px solid #eee;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 2rem;
  break-inside: avoid-column;
}

.blogPost-title {
  font-weight: bold;
  font-size: 1.2em;
  margin: 1em 0;
}

.blogPost-title a {
  color: inherit;
  text-decoration: none;
}

.blogPost-excerpt {
  font-size: 0.9em;
  color: #666;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  & > * {
    margin: 0;
  }
}

.blogPost-image {
  border-radius: 3px;
  flex-shrink: 0;
}

.blogPost-author {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  margin-top: 1em;
  color: #666;
}

.blogPost-author-image {
  border-radius: 50%;
  margin-right: 15px;
  width: 25px;
}
</style>
