<template>
  <StructuredText
    :data="structuredText"
    :renderInlineRecord="renderInlineRecord"
    :renderLinkToRecord="renderLinkToRecord"
    :renderBlock="renderBlock"
  />
  <Image :data="responsiveImage" class="foo" :style="style" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Image,
  StructuredText,
  RenderInlineRecordContext,
  RenderRecordLinkContext,
  StructuredTextGraphQlResponse,
  RenderBlockContext,
} from ".";
import { h } from "vue-demi";

export default defineComponent({
  name: "App",
  components: {
    Image,
    StructuredText,
  },
  methods: {
    renderInlineRecord: ({ record }: RenderInlineRecordContext) => {
      switch (record.__typename) {
        case "DocPageRecord":
          return h(
            "a",
            {
              href: `/docs/${record.slug}`,
            },
            record.title as string
          );
        default:
          return null;
      }
    },
    renderLinkToRecord: ({
      record,
      children,
      transformedMeta,
    }: RenderRecordLinkContext) => {
      switch (record.__typename) {
        case "DocPageRecord":
          return h(
            "a",
            {
              ...transformedMeta,
              href: `/docs/${record.slug}`,
            },
            children
          );
        default:
          return null;
      }
    },
    renderBlock: ({ record }: RenderBlockContext) => {
      switch (record.__typename) {
        case "QuoteRecord":
          return h("figure", null, [
            h("blockquote", null, record.quote as string),
            h("figcaption", null, record.author as string),
          ]);
        default:
          return null;
      }
    },
  },
  data() {
    return {
      style: {
        background: "red",
      },
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
                    value: "title ",
                  },
                  {
                    type: "inlineItem",
                    item: "123",
                  },
                  {
                    type: "span",
                    value: " ",
                  },
                  {
                    type: "itemLink",
                    item: "123",
                    meta: [{ id: "target", value: "_blank" }],
                    children: [{ type: "span", value: "here!" }],
                  },
                ],
              },
              {
                type: "block",
                item: "456",
              },
            ],
          },
        },
        blocks: [
          {
            id: "456",
            __typename: "QuoteRecord",
            quote: "Foo bar.",
            author: "Mark Smith",
          },
        ],
        links: [
          {
            id: "123",
            __typename: "DocPageRecord",
            title: "How to code",
            slug: "how-to-code",
          },
        ],
      } as StructuredTextGraphQlResponse,
      responsiveImage: {
        alt: "Alternate text",
        aspectRatio: 1.5,
        base64:
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLCgoLDhgQGg0NDh0VFhEgHx8tJSIfJSUlKy0vLSk2KSYdJTUlKC0yPjI1HTY4PTc1SC0yMi8BCgsLDg0OHBAQHDsoIig7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzU7Lzs7Oy87Lzs7OzsvOy8vOy8vL//AABEIABAAGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwAEBf/EACAQAAEDBAIDAAAAAAAAAAAAAAECAwUABAYREkETFIH/xAAWAQADAAAAAAAAAAAAAAAAAAABAgP/xAAaEQABBQEAAAAAAAAAAAAAAAACAAEDESES/9oADAMBAAIRAxEAPwDcVkTFqoFagBRDF5XavsjS0n7SgkbB+Tb8YdUnfYNWoiPuopkJLy1Adk0Y3Ig1K8dHiNMxmWlMKVyFSlplsq965b5HZOqlDsxylGaORytl/9k=",
        bgColor: "#3e8bb2",
        height: 2304,
        sizes: "(max-width: 3456px) 100vw, 3456px",
        src:
          "https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg",
        srcSet:
          "https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg?dpr=0.25 864w,https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg?dpr=0.5 1728w,https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg?dpr=0.75 2592w,https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg 3456w",
        title: "My title",
        webpSrcSet:
          "https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg?dpr=0.25&fm=webp 864w,https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg?dpr=0.5&fm=webp 1728w,https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg?dpr=0.75&fm=webp 2592w,https://www.datocms-assets.com/45563/1618330573-yovan-verma-myupfxl4xj0-unsplash.jpg?fm=webp 3456w",
        width: 3456,
      },
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>