import {
  render,
  renderRule,
  defaultMetaTransformer,
} from "datocms-structured-text-generic-html-renderer";
import {
  isBlock,
  isInlineItem,
  isItemLink,
  RenderError,
  isStructuredText,
} from "datocms-structured-text-utils";

export { renderRule, RenderError };

export const StructuredText = {
  functional: true,

  props: [
    "data",
    "renderInlineRecord",
    "renderLinkToRecord",
    "renderBlock",
    "metaTransformer",
    "customRules",
    "renderText",
  ],

  render(h, ctx) {
    const {
      data,
      renderInlineRecord,
      renderLinkToRecord,
      renderBlock,
      renderText,
      customRules,
      metaTransformer,
    } = ctx.props;

    if (!data) {
      return null;
    }

    const hAdapter = (tagName, attrsWithKey, childOrChildren) => {
      let data = undefined;

      if (attrsWithKey) {
        const { key, ...attrs } = attrsWithKey;
        data = {
          key,
          attrs,
        };
      }

      return h(
        tagName,
        data,
        Array.isArray(childOrChildren) ? childOrChildren : [childOrChildren],
      );
    };

    const adapter = {
      renderNode: hAdapter,
      renderMark: hAdapter,
      renderFragment: (children, key) => h("div", { key }, children),
      renderText: renderText || ((text) => text),
    };

    const result = render(
      adapter,
      data,
      [
        renderRule(isInlineItem, ({ node, key }) => {
          if (!renderInlineRecord) {
            throw new RenderError(
              `The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!`,
              node,
            );
          }

          if (!isStructuredText(data) || !data.links) {
            throw new RenderError(
              `The Structured Text document contains an 'inlineItem' node, but .links is not present!`,
              node,
            );
          }

          const item = data.links.find((item) => item.id === node.item);

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

          if (!isStructuredText(data) || !data.links) {
            throw new RenderError(
              `The Structured Text document contains an 'itemLink' node, but .links is not present!`,
              node,
            );
          }

          const item = data.links.find((item) => item.id === node.item);

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
            transformedMeta: node.meta
              ? (metaTransformer || defaultMetaTransformer)({
                  node,
                  meta: node.meta,
                })
              : null,
          });
        }),
        renderRule(isBlock, ({ node, key }) => {
          if (!renderBlock) {
            throw new RenderError(
              `The Structured Text document contains a 'block' node, but no 'renderBlock' prop is specified!`,
              node,
            );
          }

          if (!isStructuredText(data) || !data.blocks) {
            throw new RenderError(
              `The Structured Text document contains a 'block' node, but .blocks is not present!`,
              node,
            );
          }

          const item = data.blocks.find((item) => item.id === node.item);

          if (!item) {
            throw new RenderError(
              `The Structured Text document contains a 'block' node, but cannot find a record with ID ${node.item} inside .blocks!`,
              node,
            );
          }

          return renderBlock({ record: item, key, h, adapter });
        }),
      ].concat(customRules || []),
      metaTransformer,
    );

    return result;
  },
};

export const DatocmsStructuredTextPlugin = {
  install: (Vue) => {
    Vue.component("DatocmsStructuredText", StructuredText);
  },
};
