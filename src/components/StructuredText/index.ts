import {
  defaultMetaTransformer,
  render,
  RenderMarkRule,
  renderMarkRule,
  renderNodeRule,
  TransformedMeta,
  TransformMetaFn,
} from 'datocms-structured-text-generic-html-renderer';
import {
  Document as StructuredTextDocument,
  isBlock,
  isInlineItem,
  isItemLink,
  isRoot,
  isStructuredText,
  Node,
  Record as StructuredTextGraphQlResponseRecord,
  RenderError,
  RenderResult,
  RenderRule,
  StructuredText as StructuredTextGraphQlResponse,
} from 'datocms-structured-text-utils';
import { defineComponent, h, VNode, VNodeProps } from 'vue';

export { renderNodeRule, renderMarkRule, RenderError };
// deprecated
export { renderNodeRule as renderRule };
export type { StructuredTextGraphQlResponse, StructuredTextDocument };

type AdapterReturn = VNode | string | null;

const hAdapter = (
  tagName: string,
  props?: VNodeProps,
  childOrChildren?: AdapterReturn | AdapterReturn[],
): AdapterReturn => {
  const { href, target, rel, ...rest } = (props as any) || {};

  return h(
    tagName,
    props,
    typeof childOrChildren === 'undefined' || Array.isArray(childOrChildren)
      ? childOrChildren
      : [childOrChildren],
  );
};

export const defaultAdapter = {
  renderNode: hAdapter,
  renderMark: hAdapter,
  renderFragment: (children: AdapterReturn[], key: string): AdapterReturn =>
    children as any as AdapterReturn,
  renderText: (text: string, key: string): AdapterReturn => text,
};

type H = typeof defaultAdapter.renderNode;
type T = typeof defaultAdapter.renderText;
type F = typeof defaultAdapter.renderFragment;

export function appendKeyToValidElement(
  element: AdapterReturn,
  key: string,
): AdapterReturn {
  if (
    element !== null &&
    typeof element !== 'string' &&
    (element as VNode).key === null
  ) {
    element.key = key;
  }

  return element;
}

export type RenderInlineRecordContext<
  R extends
    StructuredTextGraphQlResponseRecord = StructuredTextGraphQlResponseRecord,
> = {
  record: R;
};

export type RenderRecordLinkContext<
  R extends
    StructuredTextGraphQlResponseRecord = StructuredTextGraphQlResponseRecord,
> = {
  record: R;
  children: RenderResult<H, T, F>[];
  transformedMeta: TransformedMeta;
};

export type RenderBlockContext<
  R extends
    StructuredTextGraphQlResponseRecord = StructuredTextGraphQlResponseRecord,
> = {
  record: R;
};

export type StructuredTextPropTypes<
  R1 extends StructuredTextGraphQlResponseRecord,
  R2 extends StructuredTextGraphQlResponseRecord = R1,
> = {
  /** The actual field value you get from DatoCMS **/
  data:
    | StructuredTextGraphQlResponse<R1, R2>
    | StructuredTextDocument
    | Node
    | null
    | undefined;
  /** A set of additional rules to convert nodes to JSX **/
  customNodeRules?: RenderRule<H, T, F>[];
  /** A set of additional rules to convert marks to JSX **/
  customMarkRules?: RenderMarkRule<H, T, F>[];
  /** Fuction that converts an 'inlineItem' node into React **/
  renderInlineRecord?: (
    context: RenderInlineRecordContext<R2>,
  ) => AdapterReturn;
  /** Fuction that converts an 'itemLink' node into React **/
  renderLinkToRecord?: (context: RenderRecordLinkContext<R2>) => AdapterReturn;
  /** Fuction that converts a 'block' node into React **/
  renderBlock?: (context: RenderBlockContext<R1>) => AdapterReturn;
  /** Function that converts 'link' and 'itemLink' `meta` into HTML props */
  metaTransformer?: TransformMetaFn;
  /** Fuction that converts a simple string text into React **/
  renderText?: T;
  /** React.createElement-like function to use to convert a node into React **/
  renderNode?: H;
  /** Function to use to generate a React.Fragment **/
  renderFragment?: F;
  /** @deprecated use customNodeRules **/
  customRules?: RenderRule<H, T, F>[];
};

export const StructuredText = defineComponent(
  <
    R1 extends StructuredTextGraphQlResponseRecord,
    R2 extends StructuredTextGraphQlResponseRecord = R1,
  >(
    props: StructuredTextPropTypes<R1, R2>,
  ) => {
    return () => {
      return render(props.data, {
        adapter: {
          renderText: props.renderText || defaultAdapter.renderText,
          renderNode: props.renderNode || defaultAdapter.renderNode,
          renderFragment: props.renderFragment || defaultAdapter.renderFragment,
        },
        metaTransformer: props.metaTransformer,
        customMarkRules: props.customMarkRules,
        customNodeRules: [
          renderNodeRule(
            isRoot,
            ({ adapter: { renderNode }, key, children }) => {
              return renderNode('div', { key }, children);
            },
          ),
          renderNodeRule(isInlineItem, ({ node, key }) => {
            if (!props.renderInlineRecord) {
              throw new RenderError(
                `The Structured Text document contains an 'inlineItem' node, but no 'renderInlineRecord' prop is specified!`,
                node,
              );
            }

            if (!isStructuredText(props.data) || !props.data.links) {
              throw new RenderError(
                `The Structured Text document contains an 'inlineItem' node, but .links is not present!`,
                node,
              );
            }

            const item = props.data.links.find((item) => item.id === node.item);

            if (!item) {
              throw new RenderError(
                `The Structured Text document contains an 'inlineItem' node, but cannot find a record with ID ${node.item} inside .links!`,
                node,
              );
            }

            return appendKeyToValidElement(
              props.renderInlineRecord({ record: item }),
              key,
            );
          }),
          renderNodeRule(isItemLink, ({ node, key, children }) => {
            if (!props.renderLinkToRecord) {
              throw new RenderError(
                `The Structured Text document contains an 'itemLink' node, but no 'renderLinkToRecord' prop is specified!`,
                node,
              );
            }

            if (!isStructuredText(props.data) || !props.data.links) {
              throw new RenderError(
                `The Structured Text document contains an 'itemLink' node, but .links is not present!`,
                node,
              );
            }

            const item = props.data.links.find((item) => item.id === node.item);

            if (!item) {
              throw new RenderError(
                `The Structured Text document contains an 'itemLink' node, but cannot find a record with ID ${node.item} inside .links!`,
                node,
              );
            }

            return appendKeyToValidElement(
              props.renderLinkToRecord({
                record: item,
                children: children as any as AdapterReturn[],
                transformedMeta: node.meta
                  ? (props.metaTransformer || defaultMetaTransformer)({
                      node,
                      meta: node.meta,
                    })
                  : null,
              }),
              key,
            );
          }),
          renderNodeRule(isBlock, ({ node, key }) => {
            if (!props.renderBlock) {
              throw new RenderError(
                `The Structured Text document contains a 'block' node, but no 'renderBlock' prop is specified!`,
                node,
              );
            }

            if (!isStructuredText(props.data) || !props.data.blocks) {
              throw new RenderError(
                `The Structured Text document contains a 'block' node, but .blocks is not present!`,
                node,
              );
            }

            const item = props.data.blocks.find(
              (item) => item.id === node.item,
            );

            if (!item) {
              throw new RenderError(
                `The Structured Text document contains a 'block' node, but cannot find a record with ID ${node.item} inside .blocks!`,
                node,
              );
            }

            return appendKeyToValidElement(
              props.renderBlock({ record: item }),
              key,
            );
          }),
          ...(props.customNodeRules || props.customRules || []),
        ],
      });
    };
  },
  {
    name: 'DatocmsStructuredText',
  },
);

export const DatocmsStructuredTextPlugin = {
  install: (Vue: any) => {
    Vue.component('DatocmsStructuredText', StructuredText);
  },
};
