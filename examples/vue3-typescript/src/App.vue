<template>
  <metainfo />
  <div v-if="loading">Loading...</div>
  <div v-if="data">
    <div class="seo-inspect">
      Inspect the HTML source and look at all the juicy SEO meta tags we're
      generating!
    </div>
    <div class="app">
      <div class="app-title">DatoCMS Blog</div>
      <div class="app-subtitle">News, tips, highlights, and other updates from the team at DatoCMS.</div>
      <article v-for="blogPost in data.blogPosts" :key="blogPost.id" class="blogPost">
        <datocms-image
          class="blogPost-image"
          :fade-in-duration="1000"
          :data="blogPost.coverImage.responsiveImage"
        />
        <h6 class="blogPost-title">
          <a
            :href="`https://www.datocms.com/blog/${blogPost.slug}`"
            target="_blank"
            rel="noopener noreferrer"
          >{{ blogPost.title }}</a>
        </h6>
        <div class="blogPost-excerpt">
          <datocms-structured-text
            :data="blogPost.excerpt"
            :custom-rules="customRules"
            :render-block="renderBlock"
            :render-inline-record="renderInlineRecord"
            :render-link-to-record="renderLinkToRecord"
          />
        </div>
        <footer class="blogPost-author">
          <datocms-image
            class="blogPost-author-image"
            :data="blogPost.author.avatar.responsiveImage"
          />
          Written by {{ blogPost.author.name }}
        </footer>
      </article>
    </div>
  </div>
  <div v-if="error">{{ JSON.stringify(error) }}</div>
</template>

<script lang="ts">
import { h, defineComponent, computed } from "vue";
import { toHead, Image, StructuredText, RenderBlockContext, renderRule, RenderRecordLinkContext, RenderInlineRecordContext } from "vue-datocms";
import { isLink } from "datocms-structured-text-utils";
import { defaultMetaTransformer } from "datocms-structured-text-generic-html-renderer";
import { useMeta } from "vue-meta";
import { useDato } from "./hooks/useDato";
import { query } from "./query";

export default defineComponent({
  name: "App",
  components: {
    "datocms-image": Image,
    "datocms-structured-text": StructuredText,
  },
  setup() {
    const { data, loading, error } = useDato({
      query,
      apiToken: "faeb9172e232a75339242faafb9e56de8c8f13b735f7090964",
      preview: true,
    });

    const meta = computed(() => {
      return data.value
        ? toHead(data.value.page.seo, data.value.site.favicon)
        : {};
    });

    useMeta(meta);

    return {
      data, loading, error,
    };
  },
  methods: {
    renderBlock: ({ record }: RenderBlockContext) => {
      switch (record.__typename) {
        case "ImageRecord":
          return h("img", {
            src: (record.image as any).url,
            alt: (record.image as any).alt,
          });
        default:
          return null;
      }
    },
    renderLinkToRecord: ({ record, children, transformedMeta }: RenderRecordLinkContext) => {
      switch (record.__typename) {
        case "TeamMemberRecord":
          return h(
            "a",
            {
              ...transformedMeta,
              href: `/team/${record.slug}`,
            },
            children,
          );
        default:
          return null;
      }
    },
    renderInlineRecord: ({ record }: RenderInlineRecordContext) => {
      switch (record.__typename) {
        case "TeamMemberRecord":
          return h(
            "a",
            { href: `/team/${record.slug}` },
            record.firstName as string,
          );
        default:
          return null;
      }
    }
  },
  data() {
    return {
      customRules: [
        renderRule(
          isLink,
          ({ node, children }) => {
            const meta = node.meta ? defaultMetaTransformer({ node, meta: node.meta }) : {};
            return h("a", { class: 'custom-class', href: node.url, ...meta }, children);
          },
        ),
      ]
    };
  },
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
    sans-serif, Apple Color Emoji, Segoe UI Emoji;
  line-height: 1.5;
  color: #333;
}

.app {
  max-width: 750px;
  margin: 0 auto 3em;
}

.app-title {
  font-size: 3em;
  font-weight: bold;
}

.app-subtitle {
  margin-bottom: 4em;
}

.blogPost {
  padding-bottom: 3em;
  border-bottom: 1px solid #eee;
  margin-bottom: 3em;
}

.blogPost-title {
  font-weight: bold;
  font-size: 1.2em;
  margin-bottom: 0.5em;
}

.blogPost-title a {
  color: inherit;
  text-decoration: none;
}

.blogPost-title a:hover {
  text-decoration: underline;
}

.blogPost-excerpt {
  font-size: 0.9em;
  color: #666;
}

.blogPost-image {
  margin-bottom: 2em;
  border-radius: 3px;
}

.blogPost-author {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  margin-top: 1.5em;
  color: #666;
}

.blogPost-author-image {
  border-radius: 50%;
  margin-right: 15px;
  width: 40px;
}

.seo-inspect {
  background: #f5f5f5;
  border-radius: 3px;
  padding: 25px;
  overflow: auto;
  font-size: 11px;
  margin-bottom: 8em;
  text-align: center;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
    monospace;
}
</style>
