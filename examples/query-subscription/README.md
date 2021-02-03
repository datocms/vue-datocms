# query-subscription

Example of using `datocms-listen` to implement real-time updates in a Vue.js v2 application.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## To test locally

Get to the main `vue-datocms` folder and run:
``` bash
$ npm link
```

Then in the `examples/query-subscription` folder run:
``` bash
$ npm link vue-datocms
```
to use the code from the above folder in the example project.
