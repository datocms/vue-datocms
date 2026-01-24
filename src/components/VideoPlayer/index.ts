import { defineComponent, h, ref, type PropType } from 'vue';

// import '@mux/mux-player';

import { decodeStega } from '@datocms/content-link';
import { useVideoPlayer } from '../../composables/useVideoPlayer';

import type {
  CmcdTypes,
  MaxResolutionValue,
  MinResolutionValue,
  PlaybackTypes,
  RenditionOrderValue,
  StreamTypes,
} from '@mux/playback-core/.';

import type MuxPlayerElement from '@mux/mux-player';
import type { Tokens } from '@mux/mux-player';

type ValueOf<T> = T[keyof T];
type Maybe<T> = T | null;
type Possibly<T> = Maybe<T> | undefined;

export type Video = {
  /** Title attribute (`title`) for the video */
  title?: Possibly<string>;
  /** Alt attribute used for content link integration (passed as data-datocms-content-link-source) */
  alt?: Possibly<string>;
  /** The height of the video */
  height?: Possibly<number>;
  /** The width of the video */
  width?: Possibly<number>;
  /** The MUX playbaack ID */
  muxPlaybackId?: Possibly<string>;
  /** The MUX playbaack ID */
  playbackId?: Possibly<string>;
  /** A data: URI containing a blurhash for the video  */
  blurUpThumb?: Possibly<string>;
  /** Other data can be passed, but they have no effect on rendering the player */
  // biome-ignore lint/suspicious/noExplicitAny: we intentionally want to allow to add any other value to this video object
  [k: string]: any;
};

type KeyTypes = string | number | symbol;

export const isNil = (x: unknown): x is null | undefined => x == undefined;

// Type Guard to determine if a given key is actually a key of some object of type T
export const isKeyOf = <T extends {} = any>(
  k: KeyTypes,
  o: Maybe<T> | undefined,
): k is keyof T => {
  if (isNil(o)) return false;
  return k in o;
};

const PropToAttrNameMap = {
  crossOrigin: 'crossorigin',
  viewBox: 'viewBox',
  playsInline: 'playsinline',
  autoPlay: 'autoplay',
  playbackRate: 'playbackrate',
  playbackRates: 'playbackrates',
};

const toKebabCase = (string: string) =>
  string.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

export const toNativeAttrName = (
  propName: string,
  propValue: any,
): string | undefined => {
  if (typeof propValue === 'boolean' && !propValue) return undefined;
  if (isKeyOf(propName, PropToAttrNameMap)) return PropToAttrNameMap[propName];
  if (typeof propValue == undefined) return undefined;
  if (/[A-Z]/.test(propName)) return toKebabCase(propName);

  return propName;
};

export const toNativeAttrValue = (propValue: any, propName: string) => {
  if (Array.isArray(propValue)) return propValue.join(' ');
  if (typeof propValue === 'boolean') return propValue;

  return propValue;
};

const toHTMLAttrs = (props = {}) => {
  return Object.entries(props).reduce<{ [k: string]: string }>(
    (transformedProps, [propName, propValue]) => {
      const attrName = toNativeAttrName(propName, propValue);

      // Prop was stripped: don't add.
      if (!attrName) {
        return transformedProps;
      }

      const attrValue = toNativeAttrValue(propValue, propName);

      // Prop is undefined: omit it
      if (attrValue === undefined) {
        return transformedProps;
      }

      transformedProps[attrName] = attrValue;

      return transformedProps;
    },
    {},
  );
};

export const VideoPlayer = defineComponent({
  name: 'DatocmsVideoPlayer',
  props: {
    _hlsConfig: {
      type: Object as PropType<MuxPlayerElement['_hlsConfig']>,
      required: false,
    },
    accentColor: {
      type: String,
      required: false,
    },
    audio: {
      type: Boolean,
      required: false,
    },
    autoPlay: {
      type: [Boolean, String] as PropType<boolean | string>,
      required: false,
    },
    backwardSeekOffset: {
      type: Number,
      required: false,
    },
    beaconCollectionDomain: {
      type: String,
      required: false,
    },
    crossOrigin: {
      type: String,
      required: false,
    },
    currentTime: {
      type: Number,
      required: false,
    },
    customDomain: {
      type: String,
      required: false,
    },
    data: {
      type: Object as PropType<Video>,
      required: false,
    },
    debug: {
      type: Boolean,
      required: false,
    },
    defaultDuration: {
      type: Number,
      required: false,
    },
    defaultHiddenCaptions: {
      type: Boolean,
      required: false,
    },
    defaultShowRemainingTime: {
      type: Boolean,
      required: false,
    },
    defaultStreamType: {
      type: String as PropType<ValueOf<StreamTypes>>,
      required: false,
    },
    disableCookies: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    disableTracking: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    disablePictureInPicture: {
      type: Boolean,
      required: false,
    },
    envKey: {
      type: String,
      required: false,
    },
    extraSourceParams: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    forwardSeekOffset: {
      type: Number,
      required: false,
    },
    hotkeys: {
      type: String,
      required: false,
    },
    loop: {
      type: Boolean,
      required: false,
    },
    maxResolution: {
      type: String as PropType<MaxResolutionValue>,
      required: false,
    },
    metadata: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    metadataVideoId: {
      type: String,
      required: false,
    },
    metadataVideoTitle: {
      type: String,
      required: false,
    },
    metadataViewerUserId: {
      type: String,
      required: false,
    },
    minResolution: {
      type: String as PropType<MinResolutionValue>,
      required: false,
    },
    muted: {
      type: Boolean,
      required: false,
    },
    nohotkeys: {
      type: String,
      required: false,
    },
    noVolumePref: {
      type: Boolean,
      required: false,
    },
    paused: {
      type: Boolean,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    playbackId: {
      type: String,
      required: false,
    },
    playbackRate: {
      type: Number,
      required: false,
    },
    playbackRates: {
      type: Array as PropType<Number[]>,
      required: false,
    },
    playerSoftwareName: {
      type: String,
      required: false,
    },
    playerSoftwareVersion: {
      type: String,
      required: false,
    },
    playsInline: {
      type: Boolean,
      required: false,
    },
    poster: {
      type: String,
      required: false,
    },
    preferCmcd: {
      type: String as PropType<ValueOf<CmcdTypes> | undefined>,
      required: false,
    },
    preferPlayback: {
      type: String as PropType<ValueOf<PlaybackTypes> | undefined>,
      required: false,
    },
    preload: {
      type: String,
      required: false,
      default: () => 'metadata',
    },
    primaryColor: {
      type: String,
      required: false,
    },
    renditionOrder: {
      type: String as PropType<RenditionOrderValue>,
      required: false,
    },
    secondaryColor: {
      type: String,
      required: false,
    },
    src: {
      type: String,
      required: false,
    },
    startTime: {
      type: Number,
      required: false,
    },
    storyboardSrc: {
      type: String,
      required: false,
    },
    streamType: {
      type: String as PropType<
        ValueOf<StreamTypes> | 'll-live' | 'live:dvr' | 'll-live:dvr'
      >,
      required: false,
    },
    targetLiveWindow: {
      type: Number,
      required: false,
    },
    theme: {
      type: String,
      required: false,
    },
    themeProps: {
      type: Object as PropType<Record<string, any>>,
      required: false,
    },
    thumbnailTime: {
      type: Number,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    tokens: {
      type: Object as PropType<Tokens>,
      required: false,
    },
    volume: {
      type: Number,
      required: false,
    },
  },
  emits: [
    'abort',
    'canPlay',
    'canPlayThrough',
    'emptied',
    'loadStart',
    'loadedData',
    'loadedMetadata',
    'progress',
    'durationChange',
    'volumeChange',
    'rateChange',
    'resize',
    'waiting',
    'play',
    'playing',
    'timeUpdate',
    'pause',
    'seeking',
    'seeked',
    'stalled',
    'suspend',
    'ended',
    'error',
    'cuePointChange',
    'cuePointsChange',
  ],
  setup: ({
    data = {},
    disableCookies = true,
    disableTracking = true,
    preload = 'metadata',
    ...otherProps
  }) => {
    import('@mux/mux-player');

    const muxPlayerRef = ref<MuxPlayerElement>();

    // Extract alt for DatoCMS Content Link integration
    // See: https://github.com/datocms/content-link
    const { alt } = data;

    const computedProps = {
      ...useVideoPlayer({ data }),
      disableCookies,
      disableTracking,
      preload,
    };

    return {
      muxPlayerRef,
      computedProps,
      otherProps,
      alt,
    };
  },
  mounted() {
    if (this.muxPlayerRef) {
      this.muxPlayerRef.addEventListener('abort', (event) => {
        this.$emit('abort', event);
      });
      this.muxPlayerRef.addEventListener('canplay', (event) => {
        this.$emit('canPlay', event);
      });
      this.muxPlayerRef.addEventListener('canplaythrough', (event) => {
        this.$emit('canPlayThrough', event);
      });
      this.muxPlayerRef.addEventListener('emptied', (event) => {
        this.$emit('emptied', event);
      });
      this.muxPlayerRef.addEventListener('loadstart', (event) => {
        this.$emit('loadStart', event);
      });
      this.muxPlayerRef.addEventListener('loadeddata', (event) => {
        this.$emit('loadedData', event);
      });
      this.muxPlayerRef.addEventListener('loadedmetadata', (event) => {
        this.$emit('loadedMetadata', event);
      });
      this.muxPlayerRef.addEventListener('progress', (event) => {
        this.$emit('progress', event);
      });
      this.muxPlayerRef.addEventListener('durationchange', (event) => {
        this.$emit('durationChange', event);
      });
      this.muxPlayerRef.addEventListener('volumechange', (event) => {
        this.$emit('volumeChange', event);
      });
      this.muxPlayerRef.addEventListener('ratechange', (event) => {
        this.$emit('rateChange', event);
      });
      this.muxPlayerRef.addEventListener('resize', (event) => {
        this.$emit('resize', event);
      });
      this.muxPlayerRef.addEventListener('waiting', (event) => {
        this.$emit('waiting', event);
      });
      this.muxPlayerRef.addEventListener('play', (event) => {
        this.$emit('play', event);
      });
      this.muxPlayerRef.addEventListener('playing', (event) => {
        this.$emit('playing', event);
      });
      this.muxPlayerRef.addEventListener('timeupdate', (event) => {
        this.$emit('timeUpdate', event);
      });
      this.muxPlayerRef.addEventListener('pause', (event) => {
        this.$emit('pause', event);
      });
      this.muxPlayerRef.addEventListener('seeking', (event) => {
        this.$emit('seeking', event);
      });
      this.muxPlayerRef.addEventListener('seeked', (event) => {
        this.$emit('seeked', event);
      });
      this.muxPlayerRef.addEventListener('stalled', (event) => {
        this.$emit('stalled', event);
      });
      this.muxPlayerRef.addEventListener('suspend', (event) => {
        this.$emit('suspend', event);
      });
      this.muxPlayerRef.addEventListener('ended', (event) => {
        this.$emit('ended', event);
      });
      this.muxPlayerRef.addEventListener('error', (event) => {
        this.$emit('error', event);
      });
      this.muxPlayerRef.addEventListener('cuepointchange', (event) => {
        this.$emit('cuePointChange', event);
      });
      this.muxPlayerRef.addEventListener('cuepointschange', (event) => {
        this.$emit('cuePointsChange', event);
      });
    }
  },
  render() {
    return h('mux-player', {
      ref: 'muxPlayerRef',
      'stream-type': 'on-demand',
      'data-datocms-content-link-source':
        this.alt && decodeStega(this.alt) ? this.alt : undefined,
      ...toHTMLAttrs(this.computedProps),
      ...toHTMLAttrs(this.otherProps),
    });
  },
});

export const DatocmsVideoPlayerPlugin = {
  install: (Vue: any) => {
    Vue.component('DatocmsVideoPlayer', VideoPlayer);
  },
};
