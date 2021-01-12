import {
  render,
  renderRule,
} from "datocms-structured-text-generic-html-renderer";
import {
  isBlock,
  isInlineItem,
  isItemLink,
  RenderError,
} from "datocms-structured-text-utils";

export { renderRule, RenderError };

export const StructuredText = {
  functional: true,

  props: [
    "structuredText",
    "renderInlineRecord",
    "renderLinkToRecord",
    "renderBlock",
    "customRules",
    "renderText",
  ],

  render(h, ctx) {
    const {
      structuredText,
      renderInlineRecord,
      renderLinkToRecord,
      renderBlock,
      renderText,
      customRules,
    } = ctx.props;

    if (!structuredText) {
      return null;
    }

    const hAdapter = (tagName, { key, ...attrs }, children) => {
      const data = {
        key,
        attrs,
      };

      return h(tagName, data, children);
    };

    const adapter = {
      renderNode: hAdapter,
      renderMark: hAdapter,
      renderFragment: (children, key) => h("div", { key }, children),
      renderText: renderText || ((text) => text),
    };

    const result = render(
      adapter,
      structuredText,
      [
        renderRule(isInlineItem, ({ node, key }) => {
          if (!renderInlineRecord) {
            throw new RenderError(
              `The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!`,
              node,
            );
          }

          if (!structuredText.links) {
            throw new RenderError(
              `The Structured Text document contains an 'inlineItem' node, but .links is not present!`,
              node,
            );
          }

          const item = structuredText.links.find(
            (item) => item.id === node.item,
          );

          if (!item) {
            throw new RenderError(
              `The Structured Text document contains an 'inlineItem' node, but cannot find a record with ID ${node.item} inside .links!`,
              node,
            );
          }

          return renderInlineRecord({ record: item, key, h, adapter });
        }),
        renderRule(isItemLink, ({ node, key, children }) => {
          if (!renderLinkToRecord) {
            throw new RenderError(
              `The Structured Text document contains an 'itemLink' node, but no 'renderLinkToRecord' prop is specified!`,
              node,
            );
          }

          if (!structuredText.links) {
            throw new RenderError(
              `The Structured Text document contains an 'itemLink' node, but .links is not present!`,
              node,
            );
          }

          const item = structuredText.links.find(
            (item) => item.id === node.item,
          );

          if (!item) {
            throw new RenderError(
              `The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ${node.item} inside .links!`,
              node,
            );
          }

          return renderLinkToRecord({
            record: item,
            children: children,
            key,
            h,
            adapter,
          });
        }),
        renderRule(isBlock, ({ node, key }) => {
          if (!renderBlock) {
            throw new RenderError(
              `The Structured Text document contains a 'block' node, but no 'renderBlock' prop is specified!`,
              node,
            );
          }

          if (!structuredText.blocks) {
            throw new RenderError(
              `The Structured Text document contains a 'block' node, but .blocks is not present!`,
              node,
            );
          }

          const item = structuredText.blocks.find(
            (item) => item.id === node.item,
          );

          if (!item) {
            throw new RenderError(
              `The Structured Text document contains a 'block' node, but cannot find a record with ID ${node.item} inside .blocks!`,
              node,
            );
          }

          return renderBlock({ record: item, key, h, adapter });
        }),
      ].concat(customRules || []),
    );

    return result;
  },
};

export const DatocmsStructuredTextPlugin = {
  install: (Vue) => {
    Vue.component("DatocmsStructuredText", StructuredText);
  },
};
