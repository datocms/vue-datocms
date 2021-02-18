import { mount } from "@vue/test-utils";
import { StructuredText, RenderError, renderRule } from "../index";
import { isHeading } from "datocms-structured-text-utils";

describe("StructuredText", () => {
  beforeEach(() => {
    jest.spyOn(global.console, "error").mockImplementation(() => {});
  });

  describe("with no value", () => {
    it("renders null", () => {
      const wrapper = mount(StructuredText, {
        propsData: { structuredText: null },
      });
      // await wrapper.vm.$nextTick();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("simple dast with no links/blocks", () => {
    const structuredText = {
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
          structuredText,
          propsData: {
            renderText: (text, key) => {
              return (
                <React.Fragment key={key}>
                  {text.replace(/This/, "That")}!!
                </React.Fragment>
              );
            },
            customRules: [
              renderRule(
                isHeading,
                ({ adapter: { renderNode }, node, children, key }) => {
                  return renderNode(`h${node.level + 1}`, { key }, children);
                },
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
    const structuredText = {
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
            renderInlineRecord: ({ record, h, key }) => {
              switch (record.__typename) {
                case "DocPageRecord":
                  return h(
                    "a",
                    {
                      attrs: {
                        href: `/docs/${record.slug}`,
                      },
                      key,
                    },
                    record.title,
                  );
                default:
                  return null;
              }
            },
            renderLinkToRecord: ({
              record,
              children,
              h,
              key,
              transformedMeta,
            }) => {
              switch (record.__typename) {
                case "DocPageRecord":
                  return h(
                    "a",
                    {
                      attrs: {
                        ...transformedMeta,
                        href: `/docs/${record.slug}`,
                      },
                      key,
                    },
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
