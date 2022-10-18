export const isSsr = () => {
  return typeof window === 'undefined'
}

export const isIntersectionObserverAvailable = () => {
  return isSsr() ? false : !!(window as any).IntersectionObserver
}
