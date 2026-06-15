import { mount } from '@vue/test-utils';

require('matchmedia-polyfill');
require('matchmedia-polyfill/matchMedia.addListener');
(global as any).ResizeObserver = require('resize-observer-polyfill');

jest.mock('@mux/mux-player', () => ({}));

import { VideoPlayer } from '../';

describe('VideoPlayer', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  describe('with complete data', () => {
    const data = {
      muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
      title: 'Title',
      width: 1080,
      height: 1920,
      blurUpThumb:
        'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A',
    };

    it('generates a <mux-player/>', () => {
      const wrapper = mount(VideoPlayer, {
        propsData: { data },
      } as any);

      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('with data.thumbnailUrl', () => {
    const data = {
      muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
      title: 'Title',
      width: 1080,
      height: 1920,
      thumbnailUrl: 'https://example.com/thumb.jpg',
    };

    it('uses the thumbnail as poster', () => {
      const wrapper = mount(VideoPlayer, {
        propsData: { data },
      } as any);

      expect(wrapper.get('mux-player').attributes('poster')).toBe(
        'https://example.com/thumb.jpg',
      );
    });

    it('lets an explicitly passed poster win over the thumbnail', () => {
      const wrapper = mount(VideoPlayer, {
        propsData: { data, poster: 'https://example.com/custom.jpg' },
      } as any);

      expect(wrapper.get('mux-player').attributes('poster')).toBe(
        'https://example.com/custom.jpg',
      );
    });
  });
});
