import { mount } from '@vue/test-utils';

(global as any).ResizeObserver = require('resize-observer-polyfill');

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
        propsData: { data, disableCookies: true },
      } as any);

      expect(wrapper.html()).toMatchSnapshot();
    });
  });
});
