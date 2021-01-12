import commonjs from "rollup-plugin-commonjs"; // Convert CommonJS modules to ES6
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js", // Path relative to package.json
  output: {
    file: "bundle.js",
    name: "VueDatoCms",
    globals: {
      "@znck/prop-types": "PropTypes",
      "hyphenate-style-name": "hypenateStyleName",
      "datocms-structured-text-generic-html-renderer":
        "datocmsStructuredTextGenericHtmlRenderer",
      "datocms-structured-text-utils": "datocmsStructuredTextUtils",
    },
  },
  external: [
    "@znck/prop-types",
    "hyphenate-style-name",
    "datocms-structured-text-generic-html-renderer",
    "datocms-structured-text-utils",
  ],
  plugins: [
    babel({
      exclude: "node_modules/**",
      runtimeHelpers: true,
    }),
    commonjs(),
  ],
};
