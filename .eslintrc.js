// https://prettier.io/docs/en/integrating-with-linters.html
// https://vuejs.github.io/vetur/linting-error.html#linting
// https://github.com/vuejs/eslint-plugin-vue/blob/v6.2.2/docs/user-guide/README.md
module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/recommended",
        "plugin:prettier/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        // override/add rules settings here, such as:
        // 'vue/no-unused-vars': 'error'
        "vue/html-self-closing": "off"
    }
};
