import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';
import tsConfig from './tsconfig.json';
import pkgJson from './package.json';

const name = 'VueDatocms';

const baseConfig = {
  input: 'src/index.ts',
  external: [
    ...Object.keys(pkgJson.peerDependencies),
    ...Object.keys(pkgJson.dependencies),
  ],
};

export default [
  // Generate Typesscript types
  {
    input: baseConfig.input,
    output: {
      file: pkgJson.types,
    },
    plugins: [
      dts()
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build
	// (it's quicker to generate multiple builds from a single 
  // configuration where possible, using an array for the 
  // `output` option, where we can specify `file` and 
  // `format` for each target).
  {
    ...baseConfig,
    plugins: [
      esbuild({
        target: tsConfig.compilerOptions.target,
        minify: false,
      }),
    ],
		output: [
			{ file: pkgJson.main, format: 'cjs' },
			{ file: pkgJson.module, format: 'es' }
		]
  },

  // Browser-friendly UMD build
  // and immediately-invoked Function Expression (aka IIFE) 
  {
    ...baseConfig,
    plugins: [
      esbuild({
        target: tsConfig.compilerOptions.target,
        minify: true,
      }),
    ],
    output: [
      {
        name,
        file: pkgJson.browser,
        format: 'umd',
        exports: 'named',
        // Provide global variables to use in the UMD build for externalized deps
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi',
        },      
      },
      {
        name,
        file: pkgJson.unpkg,
        format: 'iife',
        exports: 'named',
        // Provide global variables for externalized deps
        globals: {
          vue: 'Vue',
          'vue-demi': 'VueDemi',
        },      
      },
    ],
  },
];
