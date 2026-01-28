import { defineComponent, watch, onMounted, type PropType } from 'vue';
import {
  useContentLink,
  type UseContentLinkOptions,
  type ClickToEditOptions,
} from '../../composables/useContentLink';

export type ContentLinkProps = Omit<UseContentLinkOptions, 'enabled'> & {
  /** Current pathname to sync with Web Previews plugin */
  currentPath?: string;
  /**
   * Whether to enable click-to-edit overlays on mount, or options to configure them.
   *
   * - `true`: Enable click-to-edit mode immediately
   * - `{ scrollToNearestTarget: true }`: Enable and scroll to nearest editable if none visible
   * - `{ hoverOnly: true }`: Only enable on devices with hover capability (non-touch)
   * - `false`/`undefined`: Don't enable automatically (use Alt/Option key to toggle)
   *
   * @example
   * ```vue
   * <ContentLink :enable-click-to-edit="true" />
   * <ContentLink :enable-click-to-edit="{ scrollToNearestTarget: true }" />
   * <ContentLink :enable-click-to-edit="{ hoverOnly: true, scrollToNearestTarget: true }" />
   * ```
   */
  enableClickToEdit?: boolean | ClickToEditOptions;
  /** Whether to strip stega encoding from text nodes after stamping. */
  stripStega?: boolean;
};

/**
 * ContentLink component enables Visual Editing for DatoCMS content.
 *
 * This component provides two powerful editing experiences:
 *
 * 1. **Standalone website editing**: When viewing your draft content on the website,
 *    editors can click on any content element to open the DatoCMS editor and modify
 *    that specific field. This works by detecting stega-encoded metadata in the content
 *    and creating interactive overlays.
 *
 * 2. **Web Previews plugin integration**: When your preview runs inside the Visual Editing
 *    mode of the DatoCMS Web Previews plugin, this component automatically establishes
 *    bidirectional communication with the plugin. This enables:
 *    - Clicking content to instantly open the correct field in the side panel
 *    - In-plugin navigation: users can navigate to different URLs within Visual mode
 *      (like a browser navigation bar), and the preview updates accordingly
 *    - Synchronized state between the preview and the DatoCMS interface
 *
 * The component handles client-side routing by:
 * - Listening to navigation requests from the Web Previews plugin via `onNavigateTo`
 * - Notifying the plugin when the URL changes via `currentPath` prop
 *
 * This integration is completely automatic when running inside the plugin's iframe,
 * with graceful fallback to opening edit URLs in a new tab when running standalone.
 *
 * **Click-to-edit behavior**:
 * - By default, editors can press and hold Alt/Option key to temporarily enable click-to-edit mode
 * - Set `enableClickToEdit` prop to `true` to enable it programmatically on mount
 * - Release the Alt/Option key to disable it again
 *
 * @example
 * Basic usage (no routing):
 * ```vue
 * <script setup>
 * import { ContentLink } from 'vue-datocms';
 * </script>
 *
 * <template>
 *   <ContentLink />
 *   <!-- Your content here -->
 * </template>
 * ```
 *
 * @example
 * With Vue Router:
 * ```vue
 * <script setup>
 * import { ContentLink } from 'vue-datocms';
 * import { useRouter, useRoute } from 'vue-router';
 *
 * const router = useRouter();
 * const route = useRoute();
 * </script>
 *
 * <template>
 *   <ContentLink
 *     :on-navigate-to="(path) => router.push(path)"
 *     :current-path="route.path"
 *   />
 * </template>
 * ```
 *
 * @example
 * With Nuxt:
 * ```vue
 * <script setup>
 * import { ContentLink } from 'vue-datocms';
 * const router = useRouter();
 * const route = useRoute();
 * </script>
 *
 * <template>
 *   <ContentLink
 *     :on-navigate-to="(path) => router.push(path)"
 *     :current-path="route.path"
 *   />
 * </template>
 * ```
 *
 * @example
 * Enable click-to-edit programmatically:
 * ```vue
 * <template>
 *   <ContentLink :enable-click-to-edit="true" />
 * </template>
 * ```
 *
 * @see https://www.npmjs.com/package/@datocms/content-link
 * @see https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */
export const ContentLink = defineComponent({
  name: 'DatocmsContentLink',
  props: {
    /**
     * Callback when Web Previews plugin requests navigation.
     * Use this to integrate with your router.
     *
     * @example
     * With Vue Router: `(path) => router.push(path)`
     * With Nuxt: `(path) => navigateTo(path)`
     */
    onNavigateTo: {
      type: Function as PropType<(path: string) => void>,
      required: false,
    },
    /**
     * Root element to limit scanning to (instead of document).
     * Pass a ref to a parent element to limit the scope of content link scanning.
     */
    root: {
      type: Object as PropType<UseContentLinkOptions['root']>,
      required: false,
    },
    /**
     * Current pathname to sync with Web Previews plugin.
     * This keeps the plugin in sync with the current page being previewed.
     *
     * @example
     * With Vue Router: `route.path`
     * With Nuxt: `route.path`
     */
    currentPath: {
      type: String,
      required: false,
    },
    /**
     * Whether to enable click-to-edit overlays on mount, or options to configure them.
     *
     * - `true`: Enable click-to-edit mode immediately
     * - `{ scrollToNearestTarget: true }`: Enable and scroll to nearest editable if none visible
     * - `{ hoverOnly: true }`: Only enable on devices with hover capability (non-touch)
     * - `false`/`undefined`: Don't enable automatically (use Alt/Option key to toggle)
     *
     * @example
     * ```vue
     * <ContentLink :enable-click-to-edit="true" />
     * <ContentLink :enable-click-to-edit="{ scrollToNearestTarget: true }" />
     * <ContentLink :enable-click-to-edit="{ hoverOnly: true, scrollToNearestTarget: true }" />
     * ```
     */
    enableClickToEdit: {
      type: [Boolean, Object] as PropType<boolean | ClickToEditOptions>,
      required: false,
    },
    /**
     * Whether to strip stega encoding from text nodes after stamping.
     */
    stripStega: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const { enableClickToEdit: enableClickToEditFn, setCurrentPath } =
      useContentLink({
        enabled:
          props.stripStega !== undefined
            ? { stripStega: props.stripStega }
            : true,
        onNavigateTo: props.onNavigateTo,
        root: props.root,
      });

    // Enable click-to-edit on mount if requested, but never inside an iframe
    // (when inside the DatoCMS Web Previews plugin iframe, the plugin itself
    // controls click-to-edit). This check is SSR-safe because onMounted only
    // runs in the browser.
    onMounted(() => {
      if (
        props.enableClickToEdit &&
        typeof window !== 'undefined' &&
        window.parent === window
      ) {
        enableClickToEditFn(
          props.enableClickToEdit === true
            ? undefined
            : props.enableClickToEdit,
        );
      }
    });

    // Notify the Web Previews plugin when the URL changes
    watch(
      () => props.currentPath,
      (newPath) => {
        if (newPath !== undefined) {
          setCurrentPath(newPath);
        }
      },
      { immediate: true },
    );

    // This component does not render anything
    return () => null;
  },
});

export const DatocmsContentLinkPlugin = {
  install: (Vue: any) => {
    Vue.component('DatocmsContentLink', ContentLink);
  },
};
