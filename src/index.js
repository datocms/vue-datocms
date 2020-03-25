export * from "./Image";

export const toHead = (...args) => {
  const tags = [].concat(...args);

  const titleTag = tags && tags.find((t) => t.tag === "title");
  const metaTags = tags ? tags.filter((t) => t.tag === "meta") : [];
  const linkTags = tags ? tags.filter((t) => t.tag === "link") : [];

  return {
    title: titleTag && titleTag.content,
    meta: metaTags.map((tag) => ({
      ...tag.attributes,
      hid: tag.attributes.name || tag.attributes.property,
      vmid: tag.attributes.name || tag.attributes.property,
    })),
    link: linkTags.map((tag) => ({
      ...tag.attributes,
      hid:
        tag.attributes.name || `${tag.attributes.rel}-${tag.attributes.sizes}`,
      vmid:
        tag.attributes.name || `${tag.attributes.rel}-${tag.attributes.sizes}`,
    })),
  };
};
