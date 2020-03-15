import { mount } from "@vue/test-utils";
import Image from "../";

const data = {
  alt: "DatoCMS swag",
  aspectRatio: 1.7777777777777777,
  base64:
    "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAgLFQoLDhgQDg0NDh0eHREYIx8lJCIrHB0dLSs7GikyKSEuKjUlKDk1MjIyHyo4PTc+PDcxPjUBCgsLDg0OHBAQHDsoIig7Ozs7Ozs7OzsvOzs7Ozs7Ozs7Lzs7Ozs7Ozs7OzsvOzs7NTsvLy87NTU1Ly8vLzsvL//AABEIAA0AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAGBwABBP/EACEQAAEEAAYDAAAAAAAAAAAAAAEAAgMEBQYHESEiFWFx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAwL/xAAZEQADAAMAAAAAAAAAAAAAAAAAAQIRITH/2gAMAwEAAhEDEQA/AFxLgDWTsAd1J5TGy7hEYqNAaNgECX7sjLMQAHJTEy1Zcarfia4lJMauAxqBhLY6ZlaOzDurWvUOd3jZPfCiEh4xs//Z",
  height: 421,
  sizes: "(max-width: 750px) 100vw, 750px",
  src: "https://www.datocms-assets.com/205/image.png?ar=16%3A9&fit=crop&w=750",
  srcSet:
    "https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.25&fit=crop&w=750 187w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.5&fit=crop&w=750 375w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=0.75&fit=crop&w=750 562w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1&fit=crop&w=750 750w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=1.5&fit=crop&w=750 1125w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=2&fit=crop&w=750 1500w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=3&fit=crop&w=750 2250w,↵https://www.datocms-assets.com/205/image.png?ar=16%3A9&dpr=4&fit=crop&w=750 3000w",
  title: "These are awesome, we know that.",
  width: 750
};

const observerMap = new Map();
const instanceMap = new Map();

describe("Image", () => {
  beforeAll(() => {
    global.IntersectionObserver = jest.fn((cb, options) => {
      const instance = {
        thresholds: Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold],
        root: options.root,
        rootMargin: options.rootMargin,
        time: Date.now(),
        observe: jest.fn(element => {
          instanceMap.set(element, instance);
          observerMap.set(element, cb);
        }),
        unobserve: jest.fn(element => {
          instanceMap.delete(element);
          observerMap.delete(element);
        }),
        disconnect: jest.fn()
      };
      return instance;
    });
  });

  afterEach(() => {
    global.IntersectionObserver.mockClear();
    instanceMap.clear();
    observerMap.clear();
  });

  function mockAllIsIntersecting(isIntersecting) {
    observerMap.forEach((onChange, element) => {
      mockIsIntersecting(element, isIntersecting)
    })
  }

  function mockIsIntersecting(element, isIntersecting) {
    const cb = observerMap.get(element)
    const instance = instanceMap.get(element)
    if (cb && instance) {
      const entry = [
        {
          boundingClientRect: element.getBoundingClientRect(),
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: isIntersecting ? element.getBoundingClientRect() : {},
          isIntersecting,
          rootBounds: instance.root ? instance.root.getBoundingClientRect() : {},
          target: element,
          time: Date.now() - instance.time,
        },
      ]
      cb(entry, instance)
    } else {
      throw new Error(
        'No IntersectionObserver instance found for element. Is it still mounted in the DOM?',
      )
    }
  }

  describe("not visible", () => {
    it("renders the blur-up thumb", async () => {
      const wrapper = mount(Image, {
        propsData: {
          data
        }
      });
      await wrapper.vm.$nextTick();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("visible", () => {
    it("renders the image", async () => {
      const wrapper = mount(Image, {
        propsData: {
          data
        }
      });
      mockAllIsIntersecting(true);
      await wrapper.vm.$nextTick();
      expect(wrapper).toMatchSnapshot();
    });

    describe("image loaded", () => {
      it("shows the image", async () => {
        const wrapper = mount(Image, {
          propsData: {
            data
          }
        });
        mockAllIsIntersecting(true);
        await wrapper.vm.$nextTick();
        wrapper.find("img").trigger("load");
        await wrapper.vm.$nextTick();
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
