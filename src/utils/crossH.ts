import {
  h as rawH,
  isVue3,
} from "vue-demi";

type Vue2Data = Record<string, any>;

export default function crossH(tag: string, data: Vue2Data | null, ...rest: any[]) {
  if (isVue3) {
    let vue3Data = null;
    if (data) {
      const { domProps, attrs, props, on, ...other } = data;
      vue3Data = {
        ...other,
        ...attrs,
        ...props,
        ...domProps,
        ...Object.entries(on || {}).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [`on${key.charAt(0).toUpperCase() + key.slice(1)}`]: value,
          }),
          {}
        ),
      };
    }
    return rawH(tag, vue3Data, ...rest);
  }

  return rawH(tag, data, ...rest);
};
