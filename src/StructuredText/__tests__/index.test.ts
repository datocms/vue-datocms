import { mount } from "@vue/test-utils";
import { h } from "vue-demi";
import {
  StructuredText,
  RenderError,
  renderNodeRule,
  StructuredTextGraphQlResponse,
  StructuredTextDocument,
  RenderInlineRecordContext,
  RenderRecordLinkContext,
  RenderBlockContext,
} from "../";
import { isHeading } from "datocms-structured-text-utils";

describe("StructuredText", () => {
  beforeEach(() => {
    jest.spyOn(global.console, "error").mockImplementation(() => {});
  });

  describe("with no value", () => {
    it("renders null", () => {
      const wrapper = mount(StructuredText, {
        propsData: { data: null },
      });
      // await wrapper.vm.$nextTick();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("simple dast /2", () => {
    const structuredText: StructuredTextDocument = {
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
                value: "This\nis a\ntitle!",
              },
            ],
          },
          {
            type: "code",
            language: "javascript",
            highlight: [1],
            code: "function greetings() {\n  console.log('Hi!');\n}",
          },
        ],
      },
    };

    describe("with default rules", () => {
      it("renders the document", () => {
        const wrapper = mount(StructuredText, {
          propsData: { data: structuredText },
        });
        // await wrapper.vm.$nextTick();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  describe("simple dast with no links/blocks", () => {
    const structuredText: StructuredTextGraphQlResponse = {
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
                  value: "This\nis a\ntitle!",
                },
              ],
            },
            {
              type: "code",
              language: "javascript",
              highlight: [1],
              code: "function greetings() {\n  console.log('Hi!');\n}",
            },
          ],
        },
      },
    };

    describe("with default rules", () => {
      it("renders the document", () => {
        const wrapper = mount(StructuredText, {
          propsData: { data: structuredText },
        });
        // await wrapper.vm.$nextTick();
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe("with custom rules", () => {
      it("renders the document", () => {
        const wrapper = mount(StructuredText, {
          propsData: {
            data: structuredText,
            renderText: (text: string) => {
              return `${text.replace(/This/, "That")}!!`;
            },
            customNodeRules: [
              renderNodeRule(
                isHeading,
                ({ adapter: { renderNode }, node, children, key }) => {
                  return renderNode(`h${node.level + 1}`, { key }, children);
                }
              ),
            ],
          },
        });
        // await wrapper.vm.$nextTick();

        expect(wrapper).toMatchSnapshot();
      });
    });
  });

  describe("with links/blocks", () => {
    const structuredText: StructuredTextGraphQlResponse = {
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
                  value: "This is a",
                },
                {
                  type: "span",
                  marks: ["highlight"],
                  value: "title",
                },
                {
                  type: "inlineItem",
                  item: "123",
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
    };

    describe("with default rules", () => {
      it("renders the document", async () => {
        const wrapper = mount(StructuredText, {
          propsData: {
            data: structuredText,
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
        });
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe("with missing renderInlineRecord prop", () => {
      it("raises an error", () => {
        expect(() => {
          mount(StructuredText, {
            propsData: { data: structuredText },
          });
        }).toThrow(RenderError);
      });
    });

    describe("with missing record", () => {
      it("raises an error", () => {
        expect(() => {
          mount(StructuredText, {
            propsData: {
              data: { ...structuredText, links: [] },
              renderInlineRecord: () => {
                return null;
              },
            },
          });
        }).toThrow(RenderError);
      });
    });
  });
});
