# nextjs-i18n

I18n hook and component for Next.js with support for plurals, interpolations and JSX substitutions

[![](https://flat.badgen.net/npm/v/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/npm/license/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/npm/types/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/bundlephobia/minzip/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/bundlephobia/tree-shaking/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)
[![](https://flat.badgen.net/npm/dm/nextjs-i18n)](https://www.npmjs.com/package/nextjs-i18n)

## Advantages of using this package ✨

* 📦 **Tiny**: Less than 1kB package.
* 🚦 **SSR**: Supported by default.
* 🌱 **Easy**: You don't need configuration or handle JSON files for translations.
* 🚀 **Powerful**: Supports plurals, templating, variable interpolation, JSX substitutions.
* ✅ **Context**: Textual strings live in their context, hardcoded, which helps understanding what is what.

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
      en="Hi, {{name}}. See your <link>messages</link> of <b>{{today locale}}</b>"
      pt="Olá {{name}}. Acesse suas <link>mensagens</link> do dia <b>{{today locale}}</b>"
      params={{
        name: "Jane Doe",
        link: <a href="/messages" />,
        b: <strong />,
        today: (format: string) => {
          const today = new Date()
          if (format === "locale") {
            return today.toLocaleDateString()
          }
          return today.toDateString()
        },
      }}
    />
  </div>
)
```

## TODO 🛣

This is a list of things we want to provide in the future:

* Able to extract strings from the code into a ICU JSON format
* Command to help update strings in code.
* Being able to add new languages by running a simple command, providing a translations source file.
