import { mount } from '@vue/test-utils';
import { Image } from '../';

const data = {
  alt: 'DatoCMS swag',
  aspectRatio: 1.7777777777777777,
  base64: 'data:image/jpeg;base64,<IMAGEDATA>',
  height: 421,
  sizes: '(max-width: 750px) 100vw, 750px',
  src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
  srcSet:
    'https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.25&fit=crop&w=750 187w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.5&fit=crop&w=750 375w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.75&fit=crop&w=750 562w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1&fit=crop&w=750 750w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1.5&fit=crop&w=750 1125w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=2&fit=crop&w=750 1500w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=3&fit=crop&w=750 2250w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=4&fit=crop&w=750 3000w',
  title: 'These are awesome, we know that.',
  width: 750,
};

const minimalData = {
  base64: 'data:image/jpeg;base64,<IMAGEDATA>',
  height: 421,
  src: 'https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750',
  width: 750,
};

type IntersectionObserverClass = {
  new (
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit | undefined,
  ): IntersectionObserver;
  prototype: IntersectionObserver;
};

const observerMap = new Map();
const instanceMap = new Map();

let mocked: jest.Mock;

describe('Image', () => {
  beforeAll(() => {
    mocked = jest.fn((cb: IntersectionObserverCallback) => {
      const instance = {
        observe: jest.fn((element: HTMLElement) => {
          instanceMap.set(element, instance);
          observerMap.set(element, cb);
        }),
        unobserve: jest.fn((element: HTMLElement) => {
          instanceMap.delete(element);
          observerMap.delete(element);
        }),
        disconnect: jest.fn(),
      };
      return instance;
    });

    global.window.IntersectionObserver =
      mocked as any as IntersectionObserverClass;
  });

  afterEach(() => {
    mocked.mockClear();
    instanceMap.clear();
    observerMap.clear();
  });

  function mockAllIsIntersecting(isIntersecting: boolean) {
    observerMap.forEach((onChange, element: HTMLElement) => {
      mockIsIntersecting(element, isIntersecting);
    });
  }

  function mockIsIntersecting(element: HTMLElement, isIntersecting: boolean) {
    const cb = observerMap.get(element);
    const instance = instanceMap.get(element);
    if (cb && instance) {
      const entry = [
        {
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: isIntersecting
            ? element.getBoundingClientRect()
            : {},
          isIntersecting,
          rootBounds: instance.root
            ? instance.root.getBoundingClientRect()
            : {},
          target: element,
          time: Date.now() - instance.time,
        },
      ];
      cb(entry, instance);
    } else {
      throw new Error(
        'No IntersectionObserver instance found for element. Is it still mounted in the DOM?',
      );
    }
  }

  describe('not visible', () => {
    it('renders the blur-up thumb', async () => {
      const wrapper = mount(Image, {
        propsData: {
          data,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });
  });

  describe('visible', () => {
    it('renders the image', async () => {
      const wrapper = mount(Image, {
        propsData: {
          data,
        },
      });
      mockAllIsIntersecting(true);
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders the image (minimal data)', async () => {
      const wrapper = mount(Image, {
        propsData: {
          data: minimalData,
        },
      });
      mockAllIsIntersecting(true);
      await wrapper.vm.$nextTick();
      expect(wrapper.html()).toMatchSnapshot();
    });

    describe('image loaded', () => {
      it('shows the image', async () => {
        const wrapper = mount(Image, {
          propsData: {
            data,
          },
        });
        mockAllIsIntersecting(true);
        await wrapper.vm.$nextTick();
        wrapper.find('img').trigger('load');
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('layout property', () => {
      for (const layout of [
        'intrinsic',
        'fixed',
        'responsive',
        'fill',
      ] as const) {
        describe(`layout=${layout}`, () => {
          it('renders the image', async () => {
            const wrapper = mount(Image, {
              propsData: {
                data,
                layout,
              },
            });
            mockAllIsIntersecting(true);
            await wrapper.vm.$nextTick();
            expect(wrapper.html()).toMatchSnapshot();
          });
        });
      }
    });

    describe('passing class and/or style', () => {
      it('renders correctly', async () => {
        const wrapper = mount(Image, {
          propsData: {
            data: minimalData,
            class: 'root-class-name',
            style: { border: '1px solid red' },
            pictureClass: 'picture-class-name',
            pictureStyle: { border: '1px solid yellow ' },
            placeholderClass: 'placeholder-class-name',
            placeholderStyle: { border: '1px solid green ' },
          },
        });

        mockAllIsIntersecting(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('priority=true', () => {
      it('renders correctly', async () => {
        const wrapper = mount(Image, {
          propsData: {
            data: minimalData,
            priority: true,
          },
        });
        mockAllIsIntersecting(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('usePlaceholder=false', () => {
      it('renders correctly', async () => {
        const wrapper = mount(Image, {
          propsData: {
            data: minimalData,
            usePlaceholder: false,
          },
        });

        mockAllIsIntersecting(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
      });
    });

    describe('explicit sizes', () => {
      it('renders correctly', async () => {
        const wrapper = mount(Image, {
          propsData: {
            data: minimalData,
            sizes: '(max-width: 600px) 200px, 50vw',
          },
        });

        mockAllIsIntersecting(true);
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toMatchSnapshot();
      });
    });
  });
});
