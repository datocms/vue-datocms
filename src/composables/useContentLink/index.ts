import { createController, type Controller } from '@datocms/content-link';
import { onMounted, onUnmounted, ref, watch, type Ref } from 'vue';

export interface ClickToEditOptions {
  /**
   * Whether to automatically scroll to the nearest editable element if none
   * is currently visible in the viewport when click-to-edit mode is enabled.
   *
   * @default false
   */
  scrollToNearestTarget?: boolean;

  /**
   * Only enable click-to-edit on devices that support hover (i.e., non-touch devices).
   * Uses `window.matchMedia('(hover: hover)')` to detect hover capability.
   *
   * This is useful to avoid showing overlays on touch devices where they may
   * interfere with normal scrolling and tapping behavior.
   *
   * When set to `true` on a touch-only device, click-to-edit will not be
   * automatically enabled, but users can still toggle it manually using
   * the Alt/Option key.
   *
   * @default false
   */
  hoverOnly?: boolean;
}

export type UseContentLinkOptions = {
  /**
   * Whether the controller is enabled, or an options object.
   * - Pass `true` (default): Enables the controller with stega encoding preserved (allows controller recreation)
   * - Pass `false`: Disables the controller completely
   * - Pass `{ stripStega: true }`: Enables the controller and strips stega encoding after stamping
   *
   * When stripStega is false (default): Stega encoding remains in the DOM, allowing controllers
   * to be disposed and recreated on the same page. The invisible characters don't affect display
   * but preserve the source of truth.
   *
   * When stripStega is true: Stega encoding is permanently removed from text nodes, providing
   * clean textContent for programmatic access. However, recreating a controller on the same page
   * won't detect elements since the encoding is lost.
   */
  enabled?: boolean | { stripStega: boolean };
  /** Callback when Web Previews plugin requests navigation */
  onNavigateTo?: (path: string) => void;
  /** Root element to limit scanning to (instead of document) */
  root?: Ref<ParentNode | null | undefined>;
};

export type UseContentLinkResult = {
  /** The controller instance, or null if disabled */
  controller: Ref<Controller | null>;
  /** Enable click-to-edit overlays */
  enableClickToEdit: (options?: ClickToEditOptions) => void;
  /** Disable click-to-edit overlays */
  disableClickToEdit: () => void;
  /** Check if click-to-edit is enabled */
  isClickToEditEnabled: () => boolean;
  /** Highlight all editable elements */
  flashAll: (scrollToNearestTarget?: boolean) => void;
  /** Notify Web Previews plugin of current path */
  setCurrentPath: (path: string) => void;
};

/**
 * Composable for managing DatoCMS Content Link controller for Visual Editing.
 *
 * This composable provides low-level control over the @datocms/content-link controller,
 * enabling click-to-edit overlays and integration with the DatoCMS Web Previews plugin.
 *
 * For most use cases, consider using the `<ContentLink />` component instead, which
 * provides a simpler declarative API.
 *
 * @param options - Configuration options for the content link controller
 * @returns Controller instance and methods for managing visual editing
 *
 * @example
 * ```vue
 * <script setup>
 * import { useContentLink } from 'vue-datocms';
 * import { useRouter, useRoute } from 'vue-router';
 *
 * const router = useRouter();
 * const route = useRoute();
 *
 * const { controller, enableClickToEdit, setCurrentPath } = useContentLink({
 *   onNavigateTo: (path) => router.push(path),
 * });
 *
 * // Enable click-to-edit on mount
 * onMounted(() => {
 *   enableClickToEdit({ scrollToNearestTarget: true });
 * });
 *
 * // Sync current path with Web Previews plugin
 * watch(() => route.path, (newPath) => {
 *   setCurrentPath(newPath);
 * });
 * </script>
 * ```
 *
 * @see https://www.npmjs.com/package/@datocms/content-link
 */
export function useContentLink(
  options: UseContentLinkOptions = {},
): UseContentLinkResult {
  const { enabled = true, onNavigateTo, root } = options;
  const controller = ref<Controller | null>(null);
  // Store the callback in a ref to avoid recreating the controller when it changes
  const onNavigateToRef = ref(onNavigateTo);

  // Keep the callback ref up to date
  watch(
    () => onNavigateTo,
    (newCallback) => {
      onNavigateToRef.value = newCallback;
    },
  );

  const initializeController = () => {
    // Check if controller is disabled
    const isEnabled =
      enabled === true || (typeof enabled === 'object' && enabled !== null);

    if (!isEnabled) return;

    // Dispose existing controller if any
    if (controller.value) {
      controller.value.dispose();
    }

    // Create new controller
    const controllerOptions: Parameters<typeof createController>[0] = {};

    // Extract stripStega option if enabled is an object
    if (typeof enabled === 'object') {
      controllerOptions.stripStega = enabled.stripStega;
    }

    // The onNavigateTo callback is accessed via ref, so changes don't trigger recreation
    if (onNavigateToRef.value) {
      controllerOptions.onNavigateTo = (path: string) =>
        onNavigateToRef.value?.(path);
    }

    if (root?.value) {
      controllerOptions.root = root.value;
    }

    controller.value = createController(controllerOptions);
  };

  // Initialize controller on mount if enabled
  onMounted(() => {
    initializeController();
  });

  // Dispose controller on unmount
  onUnmounted(() => {
    if (controller.value) {
      controller.value.dispose();
      controller.value = null;
    }
  });

  // Watch for changes in root ref and reinitialize if needed
  if (root) {
    watch(
      root,
      () => {
        if (enabled) {
          initializeController();
        }
      },
      { flush: 'post' },
    );
  }

  // Methods that call through to the controller
  const enableClickToEdit = (opts?: ClickToEditOptions): void => {
    // If hoverOnly is true, check if the device supports hover
    if (
      opts?.hoverOnly &&
      (typeof window === 'undefined' ||
        !window.matchMedia('(hover: hover)').matches)
    ) {
      return;
    }

    controller.value?.enableClickToEdit(
      opts?.scrollToNearestTarget
        ? { scrollToNearestTarget: opts.scrollToNearestTarget }
        : undefined,
    );
  };

  const disableClickToEdit = (): void => {
    controller.value?.disableClickToEdit();
  };

  const isClickToEditEnabled = (): boolean => {
    return controller.value?.isClickToEditEnabled() ?? false;
  };

  const flashAll = (scrollToNearestTarget?: boolean): void => {
    controller.value?.flashAll(scrollToNearestTarget);
  };

  const setCurrentPath = (path: string): void => {
    controller.value?.setCurrentPath(path);
  };

  return {
    controller,
    enableClickToEdit,
    disableClickToEdit,
    isClickToEditEnabled,
    flashAll,
    setCurrentPath,
  };
}

// Re-export types and utilities from @datocms/content-link for convenience
export { decodeStega, stripStega } from '@datocms/content-link';
export type { Controller } from '@datocms/content-link';
