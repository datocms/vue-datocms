
export type SeoMetaTagType = {
  /** the tag for the meta information */
  tag: string;
  /** the inner content of the meta tag */
  content: string | null;
  /** the HTML attributes to attach to the meta tag */
  attributes: Record<string, string> | null;
};

export type ToMetaTagsType = SeoMetaTagType[];

export const toHead = (...args: ToMetaTagsType[]) => {
  const tags = ([] as ToMetaTagsType).concat(...args);

  const titleTag = tags && tags.find((t) => t.tag === "title");
  const metaTags = tags ? tags.filter((t) => t.tag === "meta") : [];
  const linkTags = tags ? tags.filter((t) => t.tag === "link") : [];

  return {
    title: titleTag && titleTag.content,
    meta: metaTags.map((tag) => ({
      ...tag.attributes,
      hid: tag.attributes?.name || tag.attributes?.property,
      vmid: tag.attributes?.name || tag.attributes?.property,
    })),
    link: linkTags.map((tag) => ({
      ...tag.attributes,
      hid: tag.attributes?.name ||
        `${tag.attributes?.rel}-${tag.attributes?.sizes}`,
      vmid: tag.attributes?.name ||
        `${tag.attributes?.rel}-${tag.attributes?.sizes}`,
    })),
  };
};
