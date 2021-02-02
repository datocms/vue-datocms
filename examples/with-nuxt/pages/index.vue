<template>
  <div>
    <div class="seo-inspect">
      Inspect the HTML source and look at all the juicy SEO meta tags we're
      generating!
    </div>
    <div class="app">
      <div class="app-title">DatoCMS Blog</div>
      <div class="app-subtitle">
        News, tips, highlights, and other updates from the team at DatoCMS.
      </div>
      <structured-text
        :data="structuredText"
        :renderInlineRecord="renderInlineRecord"
        :renderLinkToRecord="renderLinkToRecord"
        :renderBlock="renderBlock"
      />
      <article
        v-for="blogPost in data.blogPosts"
        :key="blogPost.id"
        class="blogPost"
      >
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
          >
            {{ blogPost.title }}
          </a>
        </h6>
        <div class="blogPost-excerpt" v-html="blogPost.excerpt" />
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
</template>

<script>
import { request } from "~/lib/datocms";
import { query } from "~/lib/query";
import { Image, StructuredText, toHead } from "vue-datocms";

export default {
  components: {
    "datocms-image": Image,
    "structured-text": StructuredText,
  },
  methods: {
    renderInlineRecord: ({ record, h, key }) => {
      switch (record.__typename) {
        case "DocPageRecord":
          return h(
            "a",
            { attrs: { href: `/docs/${record.slug}` }, key },
            record.title,
          );
        default:
          return null;
      }
    },
    renderLinkToRecord: ({ record, children, h, key }) => {
      switch (record.__typename) {
        case "DocPageRecord":
          return h(
            "a",
            { attrs: { href: `/docs/${record.slug}` }, key },
            children,
          );
        default:
          return null;
      }
    },
    renderBlock: ({ record, key, h }) => {
      switch (record.__typename) {
        case "QuoteRecord":
          return h("figure", { key }, [
            h("blockquote", {}, record.quote),
            h("figcaption", {}, record.author),
          ]);
        default:
          return null;
      }
    },
  },
  async asyncData({ params }) {
    const data = await request({
      query,
    });

    return {
      data,
      structuredText: {
        value: {
          schema: "dast",
          document: {
            type: "root",
            children: [
              {
                type: "heading",
                level: 1,
                children: [
                  {
                    type: "span",
                    value: "This is a ",
                  },
                  {
                    type: "span",
                    marks: ["highlight"],
                    value: "motherfucking website",
                  },
                  {
                    type: "span",
                    value: ".",
                  },
                ],
              },
              {
                type: "paragraph",
                children: [
                  {
                    type: "span",
                    value: "And it's ",
                  },
                  {
                    type: "span",
                    marks: ["strong"],
                    value: "fucking perfect",
                  },
                  {
                    type: "span",
                    value: ".",
                  },
                ],
              },
              {
                type: "heading",
                level: 2,
                children: [
                  {
                    type: "span",
                    value: "Seriously, what the fuck else do you want?",
                  },
                ],
              },
              {
                type: "list",
                style: "bulleted",
                children: [
                  {
                    type: "listItem",
                    children: [
                      {
                        type: "paragraph",
                        children: [
                          {
                            type: "span",
                            value: "Shit's lightweight and loads fast",
                          },
                        ],
                      },
                      {
                        type: "list",
                        style: "bulleted",
                        children: [
                          {
                            type: "listItem",
                            children: [
                              {
                                type: "paragraph",
                                children: [
                                  {
                                    type: "span",
                                    value: "Fits on all your shitty screens",
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "listItem",
                    children: [
                      {
                        type: "paragraph",
                        children: [
                          {
                            type: "span",
                            value: "Looks the same in all your shitty browsers",
                          },
                        ],
                      },
                    ],
                  },
                  {
                    type: "listItem",
                    children: [
                      {
                        type: "paragraph",
                        children: [
                          {
                            type: "span",
                            value:
                              "The motherfucker's accessible to every asshole that visits your site",
                          },
                        ],
                      },
                      {
                        type: "list",
                        style: "bulleted",
                        children: [
                          {
                            type: "listItem",
                            children: [
                              {
                                type: "paragraph",
                                children: [
                                  {
                                    type: "span",
                                    value:
                                      "Shit's legible and gets your fucking point across (if you had one instead of just 5mb pics of hipsters drinking coffee)",
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                type: "heading",
                level: 2,
                children: [
                  {
                    type: "span",
                    value: "It fucking works",
                  },
                ],
              },
              {
                type: "blockquote",
                children: [
                  {
                    type: "paragraph",
                    children: [
                      {
                        type: "span",
                        value:
                          '"Good design is as little design as possible." ',
                      },
                    ],
                  },
                  {
                    type: "paragraph",
                    children: [
                      {
                        type: "span",
                        marks: ["emphasis"],
                        value: "- some German motherfucker",
                      },
                      {
                        type: "span",
                        value: " ",
                      },
                    ],
                  },
                ],
              },
              {
                type: "paragraph",
                children: [
                  {
                    type: "span",
                    value: "From the philosophies expressed (poorly) above, ",
                  },
                  {
                    url: "http://txti.es",
                    type: "link",
                    children: [
                      {
                        type: "span",
                        value: "txti",
                      },
                    ],
                  },
                  {
                    type: "span",
                    value:
                      " was created. You should try it today to make your own motherfucking websites.",
                  },
                ],
              },
            ],
          },
        },
      },
    };
  },
  head() {
    if (!this || !this.data) {
      return;
    }

    return toHead(this.data.page.seo, this.data.site.favicon);
  },
};
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
