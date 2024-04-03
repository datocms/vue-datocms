import { toHead } from '../';

describe('toHead', () => {
  it('returns data in the proper shape', async () => {
    expect(
      toHead([
        {
          attributes: null,
          content:
            'September update — New pricing, better DX, trash bin plugin, product roadmap, and much more!',
          tag: 'title',
        },
        {
          attributes: {
            property: 'og:title',
            content:
              'September update — New pricing, better DX, trash bin plugin, product roadmap, and much more!',
          },
          content: null,
          tag: 'meta',
        },
        {
          attributes: {
            name: 'twitter:title',
            content:
              'September update — New pricing, better DX, trash bin plugin, product roadmap, and much more!',
          },
          content: null,
          tag: 'meta',
        },
      ]),
    ).toEqual({
      link: [],
      meta: [
        {
          content:
            'September update — New pricing, better DX, trash bin plugin, product roadmap, and much more!',
          hid: 'og:title',
          property: 'og:title',
          vmid: 'og:title',
        },
        {
          content:
            'September update — New pricing, better DX, trash bin plugin, product roadmap, and much more!',
          hid: 'twitter:title',
          name: 'twitter:title',
          vmid: 'twitter:title',
        },
      ],
      title:
        'September update — New pricing, better DX, trash bin plugin, product roadmap, and much more!',
    });
  });
});
