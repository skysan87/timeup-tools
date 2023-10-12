# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

```bash
# at root directory
pnpm install -D tailwindcss postcss@latest -F @timeup-tools/web
pnpm install @fortawesome/vue-fontawesome@latest-3 -F @timeup-tools/web
pnpm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons -F @timeup-tools/web
pnpm install -D @nuxt/types -F @timeup-tools/web
pnpm install v-calendar@next @popperjs/core -F @timeup-tools/web
pnpm install -D cross-env -F @timeup-tools/web
pnpm install tailvue -F @timeup-tools/web
```

Make sure to install the dependencies:

```bash
# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```

## Production

Build the application for production:

```bash
# pnpm
pnpm run build
```

Locally preview production build:

```bash
# pnpm
pnpm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
