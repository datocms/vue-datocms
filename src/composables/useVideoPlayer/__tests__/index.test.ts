import { useVideoPlayer } from '../';

describe('useVideoPlayer', () => {
  describe('when data object', () => {
    describe('is complete', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        title: 'Title',
        width: 1080,
        height: 1920,
        blurUpThumb:
          'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A',
      };

      it('unwraps data into props ready for MUX player', () => {
        const props = { data };

        expect(useVideoPlayer(props)).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          title: 'Title',
          style: {
            aspectRatio: '1080 / 1920',
          },
          placeholder:
            'data:image/bmp;base64,Qk0eAAAAAAAAABoAAAAMAAAAAQABAAEAGAAAAP8A',
        });
      });
    });

    describe('contains `muxPlaybackId`', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
      };

      it('uses it for `playbackId`', () => {
        const props = { data };

        expect(useVideoPlayer(props)).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        });
      });
    });

    describe('contains `playbackId`', () => {
      const data = {
        playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
      };

      it('uses it for `playbackId`', () => {
        const props = { data };

        expect(useVideoPlayer(props)).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        });
      });
    });

    describe('lacks of `width` and `height` values', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        title: 'Title',
      };

      it('avoids adding aspect ratio', () => {
        const props = { data };

        expect(useVideoPlayer(props)).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          title: 'Title',
        });
      });
    });

    describe('lacks of `title` value', () => {
      const data = {
        muxPlaybackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
        width: 1080,
        height: 1920,
      };

      it('avoids adding a title', () => {
        const props = { data };

        expect(useVideoPlayer(props)).toStrictEqual({
          playbackId: 'ip028MAXF026dU900bKiyNDttjonw7A1dFY',
          style: {
            aspectRatio: '1080 / 1920',
          },
        });
      });
    });
  });
});
