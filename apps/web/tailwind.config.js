/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/components/**/*.{vue,js,ts}`,
    `./src/layouts/**/*.vue`,
    `./src/pages/**/*.vue`,
    `./src/composables/**/*.{js,ts}`,
    `./src/plugins/**/*.{js,ts}`,
    `./src/utils/**/*.{js,ts}`,
    `./src/App.{vue,js,ts}`,
    `./src/app.{vue,js,ts}`,
    `./src/Error.{vue,js,ts}`,
    `./src/error.{vue,js,ts}`,
    `./src/app.config.{js,ts}`,
    'node_modules/tailvue/dist/tailvue.es.js'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

