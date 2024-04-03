import hypenateStyleName from 'hyphenate-style-name';

export const isSsr = () => {
  return typeof window === 'undefined';
};

export const isIntersectionObserverAvailable = () => {
  return isSsr() ? false : !!(window as any).IntersectionObserver;
};

export const universalBtoa = (str: string): string =>
  isSsr()
    ? Buffer.from(str.toString(), 'binary').toString('base64')
    : window.btoa(str);

export const absolutePositioning = {
  position: 'absolute',
  left: '0px',
  top: '0px',
  width: '100%',
  height: '100%',
};

export const escapeString = (s: string) => {
  let result = `${s}`;
  result = result.replace(/&/g, '&amp;');
  result = result.replace(/</g, '&lt;');
  result = result.replace(/>/g, '&gt;');
  result = result.replace(/"/g, '&quot;');
  result = result.replace(/'/g, '&#39;');
  return result;
};

export const toCss = (object: Record<string, string | undefined>) => {
  if (!object) {
    return null;
  }

  let result = '';

  for (const styleName in object) {
    if (
      Object.prototype.hasOwnProperty.call(object, styleName) &&
      object[styleName]
    ) {
      result += `${hypenateStyleName(styleName)}: ${object[styleName]}; `;
    }
  }

  return result.length > 0 ? result : null;
};

export const tag = (
  tagName: string,
  attrs: Record<string, string | null | undefined>,
  content?: Array<string | null | undefined> | null,
) => {
  const serializedAttrs = [];

  if (attrs) {
    for (const attrName in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, attrName)) {
        const value = attrs[attrName];
        if (value) {
          serializedAttrs.push(
            `${escapeString(attrName)}="${escapeString(value)}"`,
          );
        }
      }
    }
  }

  const attrsString =
    serializedAttrs.length > 0 ? ` ${serializedAttrs.join(' ')}` : '';

  return content
    ? `<${tagName}${attrsString}>${content.join('')}</${tagName}>`
    : `<${tagName}${attrsString} />`;
};
