import { CSSProperties } from 'vue';
import { Video } from '../../components/VideoPlayer';

type Maybe<T> = T | null;
type Possibly<T> = Maybe<T> | undefined;

const computedTitle = (title: Maybe<string> | undefined) => {
  return title ? { title } : undefined;
};

const computedPlaybackId = (
  muxPlaybackId: Possibly<string>,
  playbackId: Possibly<string>,
) => {
  if (!(muxPlaybackId || playbackId)) return undefined;

  return { playbackId: `${muxPlaybackId || playbackId}` };
};

const computedStyle = (width: Possibly<number>, height: Possibly<number>) => {
  if (!(width && height)) return undefined;

  return {
    style: {
      aspectRatio: `${width} / ${height}`,
    },
  };
};

const computedPlaceholder = (blurUpThumb: Possibly<string>) => {
  return blurUpThumb ? { placeholder: blurUpThumb } : undefined;
};

type Style = Maybe<CSSProperties>;
type Title = Maybe<string>;
type PlaybackId = Maybe<string>;
type Placeholder = Maybe<string>;

type AttrsForMuxPlayer = {
  style?: Style;
  title?: Title;
  playbackId?: PlaybackId;
  placeholder?: Placeholder;
};

type UseVideoPlayerArgs = {
  data?: Video;
};

export const useVideoPlayer = ({
  data,
}: UseVideoPlayerArgs): AttrsForMuxPlayer => {
  const { title, width, height, playbackId, muxPlaybackId, blurUpThumb } =
    data || {};

  if (data === undefined) return {};

  return {
    ...(computedTitle(title) || {}),
    ...(computedPlaybackId(muxPlaybackId, playbackId) || {}),
    ...(computedStyle(width, height) || {}),
    ...(computedPlaceholder(blurUpThumb) || {}),
  };
};
