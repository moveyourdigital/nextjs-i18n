# nextjs-i18n

I18n hook and component for Next.js with support for plurals, interpolations and JSX substitutions

[![](https://flat.badgen.net/npm/v/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/npm/license/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/npm/types/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/bundlephobia/minzip/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/bundlephobia/tree-shaking/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/npm/dm/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)

## Advantages of using this package ✨

- 📦 **Tiny**: Around ~1kB minzipped.
- 🚦 **SSR**: Supports SSR and SSG very well.
- 🌱 **Easy**: No configuration. Just install and use it. No external translation files needed.
- 🚀 **Powerful**: Supports plurals, templating, variable interpolation, JSX substitutions. Uses mustache syntax.
- 👩🏽‍🎨 **Context**: Textual strings live in code, close to their context.
- ✅ **Tests**: Unit tests with good coverage. Feel free to add your own.

_Tested with React and Preact_

## Installation 🧑🏻‍💻

```sh
npm i -S nextjs-i18n
```

## Simple usage 🕹

### `<I18n />` Component

```jsx
import { I18n } from "nextjs-i18n"

function Component = () => (
  <div>
    <I18n en="Hello {{name}}" pt="Olá, {{name}}" params={{
      name: "John Doe"
    }} />
  </div>
)
```

### `useI18n` hook

```jsx
import { useI18n } from "nextjs-i18n"

function Component = () => {
  const { t } = useI18n()

  return (
    <Header howdy={
      t({
        en: "Hello {{name}}",
        pt: "Olá, {{name}}",
        params: {
          name: "John Doe",
        },
      })
    } />
  )
}
```

## Advanced usage 🛠

### Using plurals

```jsx
import { I18n } from "nextjs-i18n"

function Component = (articles: Article[]) => (
  <div>
    <I18n
      en={{
        0: "Zero articles",
        1: "One article",
        2: "Two articles",
        n: "Many articles",
      }}
      pt={{
        0: "Zero artigos",
        1: "Um artigo",
        2: "Dois artigos",
        n: "Vários artigos",
      }}
      count={articles.length}
    />
  </div>
)
```

### JSX elements and functions interpolation

```jsx
import { I18n } from "nextjs-i18n"

function Component = (articles: Article[]) => (
  <div>
    <I18n
      en={`Hi, {{uppercase name.first}}. See your <link>messages</link> of <b>{{today "m/d/Y"}}</b>`}
      pt={`Olá {{name.first}}. Acesse suas <link>mensagens</link> do dia <b>{{today "d/m/Y"}}</b>`}
      params={{
        name: {
          first: "Jane",
          last: "Doe",
        },
        link: <a href="/messages" />,
        b: <strong />,
        uppercase: (value: string) => {
          return value.toUpperCase()
        },
        today: (format: string) => {
          const date = new Date()
          return format.replace(/d|m|Y/g, (match) => {
            switch (match) {
              case "d": return date.getDate()
              case "m": return date.getMonth() + 1
              case "Y": return date.getFullYear()

          }})
        },
      }}
    />
  </div>
)
```

The example above would return the following `JSX.Element` (using locale `en`):

```jsx
<>
  Hi, JANE. See your <a href="/messages">messages</a> of{" "}
  <strong>2/28/2021</strong>
</>
```

# String rules

- `{{variable}}` performs a direct variable substitution
- `{{func variable}}` invokes `func` and passes the result of variable substitution
- `{{func "123"}}` invokes `func` and passes literal string `123`
- `<tag />` or `<tag>Something</tag>` does JSX interpolation using JSX Element passed in `tag` key.

_Note:_ A valid `JSX.Element` array is returned by I18n when at least one parameter is a `JSX.Element`.
Be careful when using `t` in contexts that only expect strings, such as backends.

## TODO 🛣

This is a list of things we want to provide in the future:

- **Support Gettext**: extract and update PO files.
- **Add new language**: consume PO files to add new languages dynamically.
