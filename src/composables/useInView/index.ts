import { ref, onMounted, onBeforeUnmount } from 'vue';

import { isIntersectionObserverAvailable } from "../../utils";

export const useInView = ({ threshold, rootMargin }: IntersectionObserverInit) => {
  const observer = ref<IntersectionObserver | null>(null);
  const elRef = ref<HTMLElement | null>(null);
  const inView = ref(false);

  onMounted(() => {
    if (isIntersectionObserverAvailable()) {
      observer.value = new IntersectionObserver(
        (entries) => {
          if (entries.some(({ isIntersecting }) => isIntersecting) && observer.value) {
            inView.value = true;
            observer.value.disconnect();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );
      if (elRef.value) {
        observer.value.observe(elRef.value);
      }
    }
  });

  onBeforeUnmount(() => {
    if (isIntersectionObserverAvailable() && observer.value) {
      observer.value.disconnect();
    }
  });

  return { inView, elRef };
};
